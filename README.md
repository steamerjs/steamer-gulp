
# 功能

* 文件复制
* 文件压缩
* 文件md5
* 文件合并
* 代码内联
* cdn地址
* 合图
* 离线包 // todo
* 基本打点 // todo
* 数据上报代码片段 // todo


# 文件目录
```
src
   —— css -- 样式目录
       —— common -- 公共样式， 不会生成到dev
       —— sprites -- 合图样式，不会生成到dev
       —— index -- index页面样式，最终生成index.css
          —— index.css
          —— _index_inline.css -- 不会被合并 // Todo

   —— img -- 图片目录
       —— sprites -- 合图目录
          —— guide -- 此目录里的图片最终生成guide.png

   —— js  -- js目录
       —— common -- 公共js， 不会生成到dev
       —— index -- index页面js，最终生成到index.js

   —— lib -- 第三方库，libs 所有文件会被复制到 dev 目录，js/css 文件名 md5 化

   —— tpl -- 模版文件  // Todo
      —— common -- 公共模版
      —— index -- index页面模版
```