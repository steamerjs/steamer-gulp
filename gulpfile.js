var gulp = require("gulp");
var gulpif = require("gulp-if");
var gutil = require("gulp-util");
var webpack = require("webpack");
var execSync = require('child_process').execSync;
var _ = require('lodash');
var merge = require('merge-stream');

// 使gulp任务串行
var run = require('run-sequence');

// 清除
var clean = require('gulp-clean');

// 丑化压缩js
var uglify = require('gulp-uglify');
// 压缩html
var minifyHTML = require('gulp-minify-html');
// 压缩css
var minifycss = require('gulp-minify-css');
// 压缩图片

// 文件md5
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

// 文件内联
var inline = require('gulp-inline-res');
// 文件cdn
var htmlrefs = require('gulp-htmlrefs');

// 合图
var spritesmith = require('gulp.spritesmith');

// webpack配置
var webpackConfig = require('./webpack.config.js');

var Config = {
	env: 'dist' // dist | pub | offline
};
// 基准文件夹路径
Config.filePath = {
	src: './src/',
	// dev: './dev/',
	dist: './dist/',
	pub: './pub/',
	tmp: './tmp/',
	rev: './rev/'
};
// 文件cdn路径及md5
Config.refOpt = {
	urlPrefix: 'http://www.xxx.com/',
	offlinePrefix: 'http://www.xxx.com/',
    scope: [Config.filePath.pub]
};
// 合图
Config.sprites = {
	imgName: '../../css/sprites/sprites.png',
    cssName: 'sprites.scss',
    imgDest: Config.filePath.src + 'css/sprites/',
    cssDest: Config.filePath.src + 'css/sprites/'
};

// 清除dist文件
gulp.task('clean-dist', function() {
    return gulp.src([Config.filePath.dist, Config.filePath.pub, Config.filePath.rev, Config.filePath.src + 'css/sprites/'], {read: false})
               .pipe(clean());
});

// 合图，这里的合图路径需要根据项目具体来设定
gulp.task('sprites', function () {
	var spriteData = gulp.src(Config.filePath.src + 'img/sprites/*.png').pipe(spritesmith({
    	imgName: Config.sprites.imgName,
    	cssName: Config.sprites.cssName
  	}));

  	// Pipe image stream through image optimizer and onto disk
  	var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(gulp.dest(Config.sprites.imgDest));

  	// Pipe CSS stream through CSS optimizer and onto disk
  	var cssStream = spriteData.css
    .pipe(gulp.dest(Config.sprites.cssDest));

  	// Return a merged stream to handle both `end` events
  	return merge(imgStream, cssStream);
});

// 设置webpack内静态资料路径
var setPublicPath = function() {
	var urlPrefix = Config.refOpt.urlPrefix;;
	var offlinePrefix = Config.refOpt.offlinePrefix;
	switch(Config.env){
		case 'dist':
			webpackConfig.output.publicPath = urlPrefix;
			break;
		case 'pub':
			webpackConfig.output.publicPath = urlPrefix;
			break;
		case 'offline':
			webpackConfig.output.publicPath = offlinePrefix;
			break;
		default:
			webpackConfig.output.publicPath = urlPrefix;
			break;
	}
};

// gulp与webpack搭配使用，仅用于生产环境，这里并非gulp-webpack插件
gulp.task("webpack", function(callback) {
	setPublicPath();
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

// 复制lib
gulp.task('copy-lib', function() {
	var result = (Config.env === 'dist');
	var libSrc = Config.filePath.src;
	var libDest = (result) ? Config.filePath.dist : Config.filePath.pub;
    return gulp.src([libSrc + 'libs/**/*'])
    		   // .pipe(gulpif(!result, uglify()))
			   .pipe(gulp.dest(libDest + 'libs/'));
});

// 复制fonts
gulp.task('copy-font', function() {
	var libSrc = Config.filePath.dist;
	var libDest = Config.filePath.pub;
    return gulp.src([libSrc + 'fonts/**/*'])
			   .pipe(gulp.dest(libDest + 'fonts/'));
});

// 压缩img并使用rev记录img的md5名称
gulp.task('minify-img', function() {
    return gulp.src(['./dist/img/**/*'])
	           .pipe(rev())
			   .pipe(gulp.dest('./pub/img/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/img'));
});

// 压缩css并使用rev和revCollector进行css文件内图片md5改名
gulp.task('minify-css', function() {
    return gulp.src(['./rev/img/*.json', './dist/css/**/*'])
    			.pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
	           .pipe(minifycss())
	           .pipe(rev())
			   .pipe(gulp.dest('./pub/css/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/css'));
});

// css文件md5化
gulp.task('md5-css', function() {
    return gulp.src(['./rev/img/*.json', './dist/css/**/*'])
	           .pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'img/': 'img/',
		            }
		        }))
			   .pipe(gulp.dest('./pub/css/'))
});
// 压缩js
gulp.task('minify-js', function() {
    return gulp.src(['./dist/js/**/*'])
	           .pipe(uglify())
	           .pipe(rev())
			   .pipe(gulp.dest('./pub/js/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/js'));
});
// js文件md5化
gulp.task('md5-js', function() {
    return gulp.src(['./rev/js/*.json', './rev/css/*.json', './rev/img/*.json', './dist/js/**/*'])
	           .pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
			   .pipe(gulp.dest('./pub/js/'))
});

// 压缩html文件并对html内资源名md5改名
gulp.task('minify-html', function() {
	Config.refOpt.mapping =  _.extend(
    	require(Config.filePath.rev + 'css/rev-manifest.json'),
    	require(Config.filePath.rev + 'js/rev-manifest.json')
    );

    return gulp.src(['./rev/**/*.json', './dist/*.html'])
    			.pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
		        .pipe(inline({dest: 'pub'}))
		        .pipe(htmlrefs(Config.refOpt))
	            .pipe(minifyHTML())
			    .pipe(gulp.dest('./pub/'));
});

// 开环境境，只使用gulp去处理合图和库文件
gulp.task('dist', ['sprites', 'copy-lib'], function(cb) {
	cb();
});

// 生产环境，旧的办法，需要用到gulp来内联以及md5
gulp.task('pub', ['clean-dist', 'sprites'], function() {
	Config.env = 'pub';
	run('webpack', 'copy-lib', 'copy-font', 'minify-img', 'minify-css', 'minify-js', 'minify-html');
});

gulp.task('default', function() {
	run('dist');
});