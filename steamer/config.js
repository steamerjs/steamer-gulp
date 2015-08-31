'use strict';

module.exports = {
	// 基础url
    root: 'http://qq.com',
    // cdn路径
    cdn: {
    	default: 'http://s.url.cn/steamer/',
    	js: 'http://s1.url.cn/steamer/',
    	css: 'http://s2.url.cn/steamer/',
    	img: 'http://s3.url.cn/steamer/'
    },
    // 基准文件夹路径
    filePath: {
		src: './src/',
		dev: './dev/',
		dist: './dist/',
		tmp: './tmp/'
	},
	// 文件类型路径
	typePath: {
		css: 'css/',
		js: 'js/',
		img: 'img/',
		lib: 'lib/',
		tpl: 'tpl/',
		spritesImg: 'img/sprites/',
		spritesCss: 'css/sprites/'
	},
	// 字符串匹配，用于各类特殊字符串替换，如cdn，时间戳，内联等
	regex: {
		cdnCss: /\_\_\_(cdnCss)/g,
		cdnJs: /\_\_\_(cdnJs)/g,
		cdnImg: /\_\_\_(cdnImg)/g,
		cdn: /\_\_\_(cdn)/g,
		web: /\_\_\_(web)/g,
		timeline: /\_\_\_(timeline)/g,
		import: /@import url\('(.+?\.css)'\);*/ig,
		// tpl: /tmpl:\((\"|\')*.*(\"|')\);/ig,
		// tmpl:("|')(\w)*.html("|')
		tpl: /tmpl:.*( )*(\"|\')(.*)(\"|\')\)/ig,
		// tpl: /tmpl:.*\((\"|\')*.*(\"|')\)/ig,
		scriptInline: /<script.*src=[\"|\']*(.+)\?\_\_\_inline.*?<\/script>/ig,
		linkInline: /<link.*href=[\"|\']*(.+)\?\_\_\_inline.*?>/ig,
	},
	// webpack 配置
	webpack: {
		//插件项
	    // plugins: [new HtmlWebpackPlugin()],
	    //页面入口文件配置
	    entry: {
	        index : ['./src/js/_index/main.js']
	    },
	    //入口文件输出配置
	    output: {
	        // path: './dev/js/',
	        filename: '[name].js'
	    },
	    module: {
	        //加载器配置
	        loaders: [
	            // { test: /\.css$/, loader: 'style-loader!css-loader' },
	            // { test: /\.js$/, loader: 'jsx-loader?harmony' },
	            // { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
	            // { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
	            {
	                test: /\.js$/,
	                loader: 'babel-loader'
	            }, 
	            {
	                test: /\.jsx$/,
	                loader: 'babel-loader!jsx-loader?harmony'
	            }
	        ]
	    },
	    //其它解决方案配置
	    resolve: {
	        extensions: ["", ".js", ".jsx", '.es6'],
	    }
	}
};
