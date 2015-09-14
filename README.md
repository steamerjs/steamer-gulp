# 使用
* 开发模式: gulp
* 生成dist发布文件: gulp dist
* 生成离线包: gulp pack

# 功能

* 文件复制
* 文件压缩
* 图片压缩
* 文件md5
* 文件合并
* webpack打包及es6特性
* 代码内联
* cdn地址
* 合图
* 实时刷新
* 离线包
* bigpipe模版分割
* 基本打点 // todo
* 数据上报代码片段 // todo
* 自动化测试 // todo


# 文件目录
```
src
   —— css -- 样式目录
       —— common -- 公共样式， 不会生成到dev
       —— sprites -- 合图样式，不会生成到dev
       —— index -- index页面样式，最终生成index.css
          —— index.css
          —— _index_inline.css -- 下划线开头不会被合并

   —— img -- 图片目录
       —— sprites -- 合图目录
          —— guide -- 此目录里的图片最终生成guide.png

   —— js  -- js目录
       —— common -- 公共js， 不会生成到dev
       —— index -- index页面js，最终生成到index.js
          —— index.js
          —— index_other.js
          —— _index_inline.js 下划线开头不会被合并
       —— _detail —— detail页面js，最终生成到detail.js
          —— main.js 入口文件
          —— main_other.js
          —— _detail_inline 下划线开头不会被合并

   —— lib -- 第三方库，libs 所有文件会被复制到 dev 目录，js/css 文件名 md5 化

   —— tpl -- 模版文件  // Todo
      —— common -- 公共模版
      —— index -- index页面模版
```

# 用法

## 文件内联
```
<script src="/lib/powder.js?___inline"></script>
<link rel="stylesheet" href="/css/all.css?___inline">
<tpl src="src/tpl/detail.html?___inline"></tpl>
```
在js文件中用html模版，可以这样写:
```
var detailTpl = "<tpl src="src/tpl/detail.html?___inline"></tpl>"
```
具体可以参考https://github.com/lcxfs1991/gulp-inline-src


## 静态资源时间戳
```
<script src="/lib/powder.js?___timeline"></script>
<link rel="stylesheet" href="/css/all.css?___timeline">
```

## 文件cdn

* script cdn
```
<script src="___cdnJs/lib/powder.js?___inline"></script>
```

* css cdn
```
<link rel="stylesheet" href="___cdnCss/css/all.css">
```

* img cdn

```
.icon2{

    background: url(___cdnImg/img/con2.png) no-repeat 50% 0%;
}
```

* default cdn
```
___cdn
```


## 在css文件中加入另一个css文件内容，开头带下划线的文件不支持，如_index_inline.css
```
@import url('./src/css/index.css');
```

## 下划线js文件夹
在js文件夹下面带下划线开头的文件夹，如_index，会使用webpack进行文件打包

打包js文件
```
var $ = require('zepto');
```

## bigpipe模版支持
具体配置和用法请参考
https://github.com/lcxfs1991/gulp-bigpipe-template

# 配置文件(./steamer/config.js)
可配置项如下：
* 基础url
* cdn路径
* 文件源及终点
* 基准文件夹路径（如src, dev, dist等)
* 文件类型路径 (如js, css等)
* 字符串匹配，用于各类特殊字符串替换，如cdn，时间戳，内联等
* webpack配置
<<<<<<< HEAD
* 是否支持bigpipe模板
* 是否支持图片压缩

# Changelog
* 1.1.0 基本功能可使用
=======
>>>>>>> b8c5dfa4a5ce096bcf9d24bae70350c4a55ddd9f
