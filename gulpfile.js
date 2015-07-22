'use strict';

var fs = require('fs');

var gulp = require('gulp');

// 丑化压缩js
var uglify = require('gulp-uglify');
// 压缩html
var minifyHTML = require('gulp-minify-html');
// 压缩css
var minifycss = require('gulp-minify-css');
//压缩图片
var imagemin = require('gulp-imagemin');

var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var webpack = require('gulp-webpack');
var run = require('run-sequence');

var replace = require('gulp-replace');

var concat = require('gulp-concat');

var clean = require('gulp-clean');

var merge = require('merge-stream');

var gulpif = require('gulp-if');

var config = require('./steamer.js');

var path = require('path');

// 代码中使用：___cdn 替换cdn路径
var urlCdn = config.cdn;

// 代码中使用：___web 替换web路径
var urlWeb = config.root;
// 时间戳
var timeline = new Date().getTime();


var filePath = {
	src: './src/',
	dev: './dev/',
	dist: './dist/'
};

var typePath = {
	css: 'css/',
	js: 'js/',
	img: 'img/',
	lib: 'lib/',
	tpl: 'tpl/'
};

var pathFix = function(path) {
	return path.replace(/\\/g, '/');
};


// 清理dev文件夹
gulp.task('clean-dev', function() {
    return gulp.src([filePath.dev], {read: false})
               .pipe(clean());
});

gulp.task('clone-lib', function() {
	return gulp.src([filePath.src + typePath.lib + '**/*'])
		       .pipe(gulp.dest(filePath.dev + typePath.lib));
});

gulp.task('clone-img', function() {
	return gulp.src([filePath.src + typePath.img + '**/*'])
			   .pipe(gulp.dest(filePath.dev + typePath.img));
});

gulp.task('clone-html', function() {
	return gulp.src([filePath.src + '*.html'])
	           .pipe(replace(/\_\_\_(cdnCss)/g, urlCdn.css))
        	   .pipe(replace(/\_\_\_(cdnJs)/g, urlCdn.js))
        	   .pipe(replace(/\_\_\_(cdnImg)/g, urlCdn.img))
        	   .pipe(replace(/\_\_\_(cdn)/g, urlCdn.default))
        	   .pipe(replace(/\_\_\_(web)/g, urlWeb))
        	   .pipe(replace(/\_\_\_(timeline)/g, timeline))
			   .pipe(gulp.dest(filePath.dev));
});

gulp.task('clone-css', function() {
	return gulp.src([filePath.src + typePath.css + '*.css'])
				.pipe(replace(/@import url\('(.+?\.css)'\);*/ig, function(a,b){
		            if (fs.existsSync(b)) {
		                return fs.readFileSync(b);
		            }
		        }))
	           .pipe(replace(/\_\_\_(cdnImg)/g, urlCdn.img))
		       .pipe(replace(/\_\_\_(web)/g, urlWeb))
		       .pipe(replace(/\_\_\_(timeline)/g, timeline))
			   .pipe(gulp.dest(filePath.dev + typePath.css));
});

var walk = function(folder, callback, depth) {
	var files = fs.readdirSync(folder);
    var res = [];
    var folderPath = pathFix(folder);
    folder = folderPath.split('/');
    folder = folder[folder.length - 2];

    files.forEach(function(file){

        var pathName = path.join(folderPath, file);
        
        // 同步获取文件信息
        var stat = fs.statSync(pathName)
        if(stat.isDirectory()) {
            // 迭代目录
            walk(pathName + '/', callback, depth + 1);
        } else {
            res.push(folderPath + file);
        }
    });

    (depth > 0) && callback(folder, res);
};

gulp.task('combine-css', function() {
	walk('./src/css/', function(filename, res) {
        return  gulp.src(res)   
			        .pipe(concat(filename + '.css'))
			        .pipe(gulp.dest(filePath.dev + typePath.css));
    }, 0);
});

gulp.task('clone-js', function() {
	return gulp.src([filePath.src + typePath.js + '*.js'])
			   .pipe(replace(/tmpl:( )*"(.*)"/ig, function(a,b){
			   		var path = a.replace('tmpl: ', '').replace(/"/ig, '');
		            if (fs.existsSync(path)) {
		                return 'tmpl: "' + fs.readFileSync(path) + '"';
		            }
		        }))
	           .pipe(replace(/\_\_\_(cdnJs)/g, urlCdn.js))
			   .pipe(gulp.dest(filePath.dev + typePath.js));
});

gulp.task('combine-js', function() {
	walk('./src/js/', function(filename, res) {
        return  gulp.src(res)   
			        .pipe(concat(filename + '.js'))
			        .pipe(gulp.dest(filePath.dev + typePath.js));
    });
});

gulp.task('clone-tpl', function() {
	return gulp.src([filePath.src + typePath.tpl + '**/*'])
	           .pipe(replace(/\_\_\_(cdnImg)/g, urlCdn.img))
			   .pipe(gulp.dest(filePath.dev + typePath.tpl));
});

gulp.task('dev', function() {
    run('clone-lib', 'combine-css', 'combine-js', 'clone-img', 'clone-html', 'clone-css', 'clone-js', 'clone-tpl');
});

gulp.task('default', ['clean-dev'], function() {
	run('dev');
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

gulp.task('minify-js', function() {
    return gulp.src(['./dev/js/**/*'])
	           .pipe(uglify())
	           .pipe(rev())
			   .pipe(gulp.dest('./dist/js/'))
			   .pipe(rev.manifest())
        	   .pipe(gulp.dest('rev/js'));
});

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

gulp.task('minify-img', function() {

    return gulp.src(['./dev/img/**/*'])
			          // .pipe(imagemin())
			          .pipe(rev())
					  .pipe(gulp.dest('./dist/img/'))
					  .pipe(rev.manifest())
		        	  .pipe(gulp.dest('rev/img'));
});

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
		        .pipe(replace(/<script.*src=[\"|\']*(.+)\?\_\_\_inline.*?<\/script>/ig, function(a, b) {
		            b = 'dist/' + b;
		            if (!fs.existsSync(b)) {
		                return '';
		            }
		            return '<script>' + fs.readFileSync(b) + '</script>';
		        }))
		        .pipe(replace(/<link.*href=[\"|\']*(.+)\?\_\_\_inline.*?>/ig, function(a,b) {
		            b = 'dist/' + b;
		            if (!fs.existsSync(b)) {
		                return '';
		            }
		            return '<style type="text/css">'+fs.readFileSync(b)+'</style>';
		        }))
	           .pipe(minifyHTML())
			   .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-lib', function() {
    return gulp.src(['./dev/lib/**/*'])
			   .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('clean-rev', function() {
    return gulp.src(['./rev/'], {read: false})
               .pipe(clean());
});

gulp.task('dist', ['clean-dist'], function() {
	run('copy-lib', 'minify-img', 'minify-css', 'md5-css', 'minify-js', 'md5-js', 'minify-html', 'clean-rev');
});