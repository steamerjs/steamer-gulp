'use strict';

module.exports = {
    root: 'http://qinfo.clt.qq.com/qlevel',
    cdn: {
    	default: 'http://s2.url.cn/qqun/qinfo/qlevel',
    	js: 'http://s2.url.cn/qqun/qinfo/qlevel',
    	css: 'http://s2.url.cn/qqun/qinfo/qlevel',
    	img: 'http://s2.url.cn/qqun/qinfo/qlevel'
    },
    filePath: {
		src: './src/',
		dev: './dev/',
		dist: './dist/',
		tmp: './tmp/'
	},
	typePath: {
		css: 'css/',
		js: 'js/',
		img: 'img/',
		lib: 'lib/',
		tpl: 'tpl/',
		spritesImg: 'img/sprites/',
		spritesCss: 'css/sprites/'
	},
	regex: {
		cdnCss: /\_\_\_(cdnCss)/g,
		cdnJs: /\_\_\_(cdnJs)/g,
		cdnImg: /\_\_\_(cdnImg)/g,
		cdn: /\_\_\_(cdn)/g,
		web: /\_\_\_(web)/g,
		timeline: /\_\_\_(timeline)/g,
		import: /@import url\('(.+?\.css)'\);*/ig,
		tpl: /tmpl:( )*"(.*)"/ig,
		scriptInline: /<script.*src=[\"|\']*(.+)\?\_\_\_inline.*?<\/script>/ig,
		linkInline: /<link.*href=[\"|\']*(.+)\?\_\_\_inline.*?>/ig,
	},
	webpack: {
		output: {
	        // filename: '[name].js'
	    },
	    loaders: [
		  { test: /\.html/, loader: "html-loader" },
		]
	}
};
