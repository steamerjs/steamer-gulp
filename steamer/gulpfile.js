
'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

// gulp if 条件
var gulpif = require('gulp-if');
// 文件重命名
var rename = require("gulp-rename");
// 丑化压缩js
var uglify = require('gulp-uglify');
// 压缩html
var minifyHTML = require('gulp-minify-html');
var minify = require('html-minifier').minify;
// 压缩css
var minifycss = require('gulp-minify-css');
// 压缩图片
var imagemin = require('gulp-imagemin');
// 文件md5
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var webpack = require('webpack-stream');
// var webpack = require('webpack');
// 使gulp任务串行
var run = require('run-sequence');
// 文字替换
var replace = require('gulp-replace');
// 合并
var concat = require('gulp-concat');
// 清除
var clean = require('gulp-clean');
// 流合并
var merge = require('merge-stream');
// 合图
var spriter = require('gulp.spritesmith');
// 压缩
var zip = require('gulp-zip');
// bigpipe 模版
var bgTpl = require('gulp-bigpipe-template');

var inline = require('gulp-inline-res');

// 实时刷新
var livereload = require('gulp-livereload');
livereload({ start: true });
// 配置文件
var config = require('./config');
// 公共方法库
var util = require('./util');

// 代码中使用：___cdn 替换cdn路径
var urlCdn = config.cdn;

// 代码中使用：___web 替换web路径
var urlWeb = config.root;
// 时间戳
var timeline = new Date().getTime();
// src, dev dist, pack文件夹位置
var filePath = config.filePath;
// js, css, img等文件夹位置
var typePath = config.typePath;
// 常用regex
var regex = config.regex;
// webpack配置
var webpackConfig = config.webpack;

var isBigPipeSupported = config.isBigPipeSupported;
var bigPipeTplConfig = config.bigPipeTplConfig;

var isImageMinSupported = config.isImageMinSupported;

// 清理dev文件夹
gulp.task('clean-dev', function() {
    return gulp.src([filePath.dev], {read: false})
               .pipe(clean());
});
// 直接复制lib文件
gulp.task('clone-lib', function() {
	return gulp.src([filePath.src + typePath.lib + '**/*'])
		       .pipe(gulp.dest(filePath.dev + typePath.lib));
});
// 合图
gulp.task('sprites', function() {
	util.walk('./src/img/sprites/', function(filename, res) {
		if (!res.length) {
			return;
		}

        var spriteData = gulp.src(res).pipe(spriter({
			imgName: filename + '.png',
		    cssName: filename + '.css'
		}));
		// 合图同时生成合图图片和css样式		
		var imgStream = spriteData.img.pipe(gulp.dest(filePath.dev + typePath.img));

		var cssStream = spriteData.css.pipe(gulp.dest(filePath.src + typePath.spritesCss));
                // 将多个流合并起来再return，才符合gulp的使用，通知下个任务可以开始
		return merge(imgStream, cssStream);
    }, 1);
});
// 复制图片，合图图片源被排除，防止文件重复
gulp.task('clone-img', function() {
	return gulp.src([filePath.src + typePath.img + '**/*', 
					 '!' + filePath.src + typePath.spritesImg + '**/*',
					 '!' + filePath.src + typePath.spritesImg])
			   .pipe(gulp.dest(filePath.dev + typePath.img));
});
// 复制html文件，同时对静态资源做cdn路径替换
gulp.task('clone-html', function() {
	return gulp.src([filePath.src + '*.html'])
	           .pipe(util.replace(regex.cdnCss, urlCdn.css))
        	   .pipe(util.replace(regex.cdnJs, urlCdn.js))
        	   .pipe(util.replace(regex.cdnImg, urlCdn.img))
        	   .pipe(util.replace(regex.cdn, urlCdn.default))
        	   .pipe(util.replace(regex.web, urlWeb))
        	   .pipe(util.replace(regex.timeline, timeline))
			   .pipe(gulp.dest(filePath.dev))
			   .pipe(livereload());
});
// 复制css，允许import其它css，并排除合图样式
gulp.task('clone-css', function() {
	return  gulp.src([filePath.src + typePath.css + '*.css',
					 '!' + filePath.src + typePath.spritesCss + '**/*',
					 '!' + filePath.src + typePath.spritesCss])
				.pipe(util.replace(regex.import, util.importRes))
				.pipe(util.replace(regex.cdnImg, urlCdn.img))
				.pipe(util.replace(regex.web, urlWeb))
        	    .pipe(util.replace(regex.timeline, timeline))
			    .pipe(gulp.dest(filePath.dev + typePath.css))
			    .pipe(livereload());
});
// 合并css
gulp.task('combine-css', function() {
	util.walk('./src/css/', function(filename, res) {
        return  gulp.src(res)   
			        .pipe(concat(filename + '.css'))
                    .pipe(util.replace(regex.import, util.importRes))
					.pipe(util.replace(regex.cdnImg, urlCdn.img))
					.pipe(util.replace(regex.web, urlWeb))
        	    	.pipe(util.replace(regex.timeline, timeline))
			        .pipe(gulp.dest(filePath.dev + typePath.css));
    }, 0);
});
// 复制js
gulp.task('clone-js', function() {
	return gulp.src([filePath.src + typePath.js + '*.js'])
	           .pipe(util.replace(regex.cdnJs, urlCdn.js))
			   .pipe(gulp.dest(filePath.dev + typePath.js))
			   .pipe(livereload());
});
// 合并js及js使用webpack打包，此处分两种情况，没有underscore开头的文件夹，直接合并，否则用webpack打包
gulp.task('combine-js', function() {
	util.walk('./src/js/', function(filename, res, isConcat) {
		if (isConcat) {
	        return  gulp.src(res)   
				        .pipe(concat(filename + '.js'))
				        .pipe(util.replace(regex.cdnJs, urlCdn.js))
				        .pipe(inline())
				        // .pipe(util.replace(regex.tpl, function(a) {
				        // 	var b = a.replace(/tmpl:.*\((\"|\')/ig, '')
				        // 				 .replace(/(\"|\')\)/ig, '')
				        // 				 .replace(/(\.\.\/)*/ig, '');
				        //     var b = 'src/' + b;

				        //     if (!fs.existsSync(b)) {
				        //         return '';
				        //     }
				        //     return minify("'" + fs.readFileSync(b) + "'", {collapseWhitespace: true});
				        // }))
				        .pipe(gulp.dest(filePath.dev + typePath.js));
		}
		else {
			var folderPath = filePath.src + typePath.js + filename;
			var mainJsPath = '/main.js';

			webpackConfig.entry.index[0] = folderPath + mainJsPath;
			webpackConfig.output.filename = filename.replace('_', '') + '.js';

			return gulp.src(folderPath + mainJsPath)
					   .pipe(webpack(webpackConfig))
					   .pipe(rename(typePath.js + filename.replace('_', '') + '.js'))
					   .pipe(gulp.dest(filePath.dev))
		}
    }, 0);
});
// dev的任务
gulp.task('dev', function() {
    run('clone-lib', 'combine-css', 'combine-js', 'sprites', 'clone-img', 'clone-html', 'clone-css', 'clone-js');
});
// dev任务开启及watch,提供livereload进行实时刷新
gulp.task('default', ['clean-dev'], function() {
	run('dev');
	livereload.listen();
    gulp.watch(['src/**/*'], ['dev']);
});


// dev ↑
//===================================================================================
// dist ↓


// 清理dist文件夹
gulp.task('clean-dist', function() {
    return gulp.src([filePath.dist], {read: false})
               .pipe(clean());
});
// 压缩css并使用rev和revCollector进行css文件内图片md5改名
gulp.task('minify-css', function() {
    return gulp.src(['rev/img/*.json', './dev/css/**/*'])
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
			   .pipe(gulp.dest('./dist/css/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/css'));
});

// css文件md5化
gulp.task('md5-css', function() {
    return gulp.src(['rev/css/*.json', 'rev/img/*.json', './dist/css/**/*'])
	           .pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
			   .pipe(gulp.dest('./dist/css/'))
});
// 压缩js
gulp.task('minify-js', function() {
    return gulp.src(['./dev/js/**/*'])
	           .pipe(uglify())
	           .pipe(rev())
			   .pipe(gulp.dest('./dist/js/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/js'));
});
js文件md5化
gulp.task('md5-js', function() {
    return gulp.src(['rev/js/*.json', 'rev/css/*.json', 'rev/img/*.json', './dist/js/**/*'])
	           .pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
			   .pipe(gulp.dest('./dist/js/'))
});
// 压缩html文件并对html内资源名md5改名
gulp.task('minify-html', function() {
    return gulp.src(['rev/**/*.json', './dev/*.html'])
    			.pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': 'css/',
		                'js/': 'js/',
		                'img/': 'img/',
		            }
		        }))
		        .pipe(inline())
		        // .pipe(util.replace(regex.scriptInline, function(a, b) {
		        //     b = 'dist/' + b;
		        //     if (!fs.existsSync(b)) {
		        //         return '';
		        //     }
		        //     return '<script>' + fs.readFileSync(b) + '</script>';
		        // }))
		        // .pipe(util.replace(regex.linkInline, function(a,b) {
		        //     b = 'dist/' + b;
		        //     if (!fs.existsSync(b)) {
		        //         return '';
		        //     }
		        //     return '<style type="text/css">'+fs.readFileSync(b)+'</style>';
		        // }))
		        .pipe(gulpif(isBigPipeSupported, bgTpl(bigPipeTplConfig)))
	            .pipe(minifyHTML())
			    .pipe(gulp.dest('./dist/'));
});
// 复制lib
gulp.task('copy-lib', function() {
    return gulp.src(['./dev/lib/**/*'])
			   .pipe(gulp.dest('./dist/lib/'));
});
// 清除md5辅助文件
gulp.task('clean-rev', function() {
    return gulp.src(['./rev/'], {read: false})
               .pipe(clean());
});
// dist任务流程
gulp.task('dist', ['clean-dist'], function() {
	run('copy-lib', 'minify-css', 'md5-css', 'minify-js', 'md5-js', 'minify-html', 'clean-rev');
});
// 压缩图片
gulp.task('min-img', function() {

    return gulp.src(['./dev/img/**/*'])
			          .pipe(gulpif(isImageMinSupported, imagemin()))
			          .pipe(rev())
					  .pipe(gulp.dest('./dist/img/'))
					  .pipe(rev.manifest())
		        	  .pipe(gulp.dest('rev/img'));
});


/* offline package generator 离线包生成   */

var removeHttp = function(url) {
    return url.replace(/https?:\/\//, '');
};

var createUrl = function(path) {
    var url = '';

    for (var i = 0, len = path.length; i < len; i++) {
        url += path[i] + '/';
    }

    return url;
};

gulp.task('cleanPack', function() {
    return gulp.src(['./pack', './archive.zip'], {read: false})
        .pipe(clean());
})

gulp.task('zip', function() {
    return gulp.src('./pack/**')
                .pipe(zip('archive.zip'))
                .pipe(gulp.dest('./'));
});

gulp.task('offline', function() {

    var htmlPath = removeHttp(urlWeb).split('/');
    var stream1 = gulp.src('./dist/*.html')
        .pipe(gulp.dest('./pack/' + createUrl(htmlPath)));

    var jsPath = removeHttp(urlCdn.js).split('/');
    var stream2 = gulp.src('./dist/js/*.js')
        .pipe(gulp.dest('./pack/' + createUrl(jsPath) + 'js/'));

    var imgPath = removeHttp(urlCdn.img).split('/');
    var stream3 = gulp.src('./dist/img/**/')
        .pipe(gulp.dest('./pack/' + createUrl(imgPath) + 'img/'));

    var cssPath = removeHttp(urlCdn.css).split('/');
    var stream4 = gulp.src('./dist/css/**/')
        .pipe(gulp.dest('./pack/' + createUrl(cssPath) + 'img/'));

    console.log(createUrl(htmlPath), createUrl(jsPath), createUrl(imgPath), createUrl(cssPath));

    return merge(stream1, stream2, stream3, stream4);

})

gulp.task('pack', function() {
    run('cleanPack', 'offline', 'zip');   
});
