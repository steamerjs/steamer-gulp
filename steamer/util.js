var fs = require('fs');
var path = require('path');
var gulp_replace = require('gulp-replace');

var Util = (function() {

	// 将windows的path\转变成跟linux统一
	var pathFix = function(path) {
		return path.replace(/\\/g, '/');
	};

	var _checkUnderScoreName = function(folderPath) {

		var arr = folderPath.split('/'),
			len  = arr.length;
		console.log(folderPath.split('/')[len - 2].indexOf('_') === 0);
		// console.log(folderPath[len - 1], folderPath[len - 1].indexOf('_') === 0);
		return folderPath[len - 2].indexOf('_') === 0;

	};

	// 遍历深度为depth的文件夹内文件
	var walk = function(folder, callback, depth) {
		if (!fs.existsSync(folder)){
			return false;
		}
		var files = fs.readdirSync(folder),
	    	res = [],
	    	folderPath = pathFix(folder);

	    folder = folderPath.split('/');
	    folder = folder[folder.length - 2];

	    files.forEach(function(file){

	        var pathName = path.join(folderPath, file);
	        // 同步获取文件信息
	        var stat = fs.statSync(pathName)
	        if(stat.isDirectory()) {
	            // 迭代目录
	            if (file.indexOf('_') !== 0) {
	            	walk(pathName + '/', callback, depth + 1);
	            }
	            else {
	            	callback(file, res, false);
	            }
	        } else {
	        	// 条件1：避免隐藏文件； 条件2：首字符为下划线的不合并
	            (file.indexOf('.') > 0) && (file.indexOf('_') !== 0) && res.push(folderPath + file);
	        }
	    });
	    
	    (depth > 0) && callback(folder, res, true);
	};

	// 换取文件后缀
	// var getExt = function(filename) {
	// 	var path = filename.split('.');
	// 	return path[path.length - 1];
	// };

	// 替换文件字符
	var replace = function(regex, replacement) {
		return gulp_replace(regex, replacement);
	};

	var importRes = function(a,b) {
		if (fs.existsSync(b)) {
            return fs.readFileSync(b);
        }
	}

	return {
		pathFix: pathFix,
		walk: walk,
		replace: replace,
		importRes: importRes
	}

})();

module.exports = Util;