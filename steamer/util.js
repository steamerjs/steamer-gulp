var fs = require('fs');
var path = require('path');
var gulp_replace = require('gulp-replace');

var Util = (function() {

	// 将windows的path\转变成跟linux统一
	var pathFix = function(path) {
		return path.replace(/\\/g, '/');
	};

	// 遍历深度为depth的文件夹内文件
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