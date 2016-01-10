var path = require('path');
var webpack = require('webpack');

var config = {
    env: process.env.NODE_ENV,
    path: {
        src: path.resolve(__dirname, "src"),
        dist: path.resolve(__dirname, "dist"),
        pub: path.resolve(__dirname, "pub"),
    },
    defaultPath: "http://www.daoshishuo.com/",
    cdn: "http://www.daoshishuo.com/"
};
var nodeModulesPath = path.join(__dirname, 'node_modules');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var route = ['answer_add', 'ask', 'ask_add', 'ask_detail', 'cms',
             'forget', 'index', 'industry_manage', 'mentor', 'mentor_apply',
             'mentor_appoint', 'mentor_appoint_detail', 'mentor_book', 'mentor_cancel',
             'mentor_pass', 'mentor_student', 'money_withdraw', 'payment', 'question_add',
             'relation', 'result', 'type_manage', 'user', 'user_invite', 'user_msg',
             'user_pic', 'user_profile', 'user_resetpassword', 'withdraw']


/**
 * [devConfig 开发环境配置]
 * @type {Object}
 */
var devConfig = {
    entry: {
        // common: ['util'],
        common: ['jquery', 'bootstrap', 'utils'],
        // answer_add: path.join(config.path.src, "/js/_answer_add/main.js"),
        // ask: path.join(config.path.src, "/js/_ask/main.js"),
        // ask_add: path.join(config.path.src, "/js/_ask_add/main.js"),
        // ask_detail: path.join(config.path.src, "/js/_ask_detail/main.js"),
        // cms: path.join(config.path.src, "/js/_cms/main.js"),
        // forget: path.join(config.path.src, "/js/_forget/main.js"),
        // index: path.join(config.path.src, "/js/_index/main.js"),
        // industry_manage: path.join(config.path.src, "/js/_industry_manage/main.js"),
        // mentor: path.join(config.path.src, "/js/_mentor/main.js"),
        // mentor_apply: path.join(config.path.src, "/js/_mentor_apply/main.js"),
        // mentor_appoint: path.join(config.path.src, "/js/_mentor_appoint/main.js"),
        // mentor_appoint_detail: path.join(config.path.src, "/js/_mentor_appoint_detail/main.js"),
        // mentor_book: path.join(config.path.src, "/js/_mentor_book/main.js"),
        // mentor_cancel: path.join(config.path.src, "/js/_mentor_cancel/main.js"),
        // mentor_pass: path.join(config.path.src, "/js/_mentor_pass/main.js"),
        // mentor_student: path.join(config.path.src, "/js/_mentor_student/main.js"),
        // money_withdraw: path.join(config.path.src, "/js/_money_withdraw/main.js"),
        // payment: path.join(config.path.src, "/js/_payment/main.js"),
        // question_add: path.join(config.path.src, "/js/_question_add/main.js"),
        // relation: path.join(config.path.src, "/js/_relation/main.js"),
        // result: path.join(config.path.src, "/js/_result/main.js"),
        // type_manage: path.join(config.path.src, "/js/_type_manage/main.js"),
        // user: path.join(config.path.src, "/js/_user/main.js"),
        // user_invite: path.join(config.path.src, "/js/_user_invite/main.js"),
        // user_msg: path.join(config.path.src, "/js/_user_msg/main.js"),
        // user_pic: path.join(config.path.src, "/js/_user_pic/main.js"),
        // user_profile: path.join(config.path.src, "/js/_user_profile/main.js"),
        // user_resetpassword: path.join(config.path.src, "/js/_user_resetpassword/main.js"),
        // withdraw: path.join(config.path.src, "/js/_withdraw/main.js"),
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist),
        filename: "js/[name].js"
    },
    externals: {
      'react': 'React' 
    },
    module: {
        // noParse: [path.join(nodeModulesPath, '/react/dist/react.min')],
        loaders: [
            { 
                test: /\.js?$/,
                loader: "babel-loader?presets[]=es2015&presets[]=react",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
                include: path.resolve(config.path.src)
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
                include: [nodeModulesPath, path.resolve(config.path.src)]
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader"),
                include: [path.resolve(config.path.src), nodeModulesPath]
            },
            {
                test: /\.(jpg|png|gif)$/i,
                loader: "url-loader?limit=1000&name=img/[name]-[hash:10].[ext]",
                include: path.resolve(config.path.src)
            },
            {
                test: path.join(config.path.src, '/libs/jq/jquery-2.1.4.min'),
                loader: 'expose?jQuery'
            },
            { 
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,  
                loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]' 
            },
            {
                test: path.join(config.path.src, '/js/common/utils'),
                loader: 'expose?Utils'
            },
            {
                test: path.join(config.path.src, '/libs/react/react'),
                loader: 'expose?React'
            },
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx", ".es6", "css", "scss", "png", "jpg", "jpeg"],
        alias: {
            'react': path.join(nodeModulesPath, 'react/react.js'),
            'react': path.join(nodeModulesPath, '/react/dist/react.min'),
            'object-assign': path.join(nodeModulesPath, 'object-assign/index.js'),
            'redux': path.join(nodeModulesPath, 'redux/dist/redux.js'),
            'react-redux': path.join(nodeModulesPath, 'react-redux/dist/react-redux.js'),
            'utils': path.join(config.path.src, 'js/common/utils.js'),
            'jquery': path.join(config.path.src, '/libs/jq/jquery-2.1.4.min'),
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "js/common.js",
            chunks: route
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ExtractTextPlugin("./css/[name].css"),
        new webpack.NoErrorsPlugin()
    ],
    // devtool: "#inline-source-map",
    devServer: {
        port: 8081,
        contentBase: './dist',
    }
};

route.forEach(function(item) {
    devConfig.entry[item] = path.join(config.path.src, "/js/_" + item + "/main.js")
    
    var htmlPlugin = new HtmlWebpackPlugin({
        filename: item + ".html",
        excludeChunks: ['test'],
        template: "src/" + item + ".html"
    });
    devConfig.plugins.push(htmlPlugin);

});

console.log(devConfig);

// var prodConfig = {};
// Object.assign(prodConfig, devConfig);

// if (devConfig.env === 'production') {
//     prodConfig.output.publicPath = config.cdn;
//     prodConfig.output.path = path.join(config.path.pub);

//     prodConfig.addPlugins = function(plugin, opt) {
//         prodConfig.plugins.push(new plugin(opt));
//     };  

//     prodConfig.addPlugins(Clean, ['pub']);  
//     prodConfig.addPlugins(webpack.optimize.UglifyJsPlugin, {
//         compress: {
//             warnings: false
//         }
//     });
// }

// module.exports = (config.env === 'production') ? prodConfig : devConfig;
module.exports = devConfig;
