## Steamer 2.0

Webpack for Development and Gulp&Webpack for Production

## src结构例子
```
--src
 |
----css 
 |
 |-common.scss
 |-layout.scss
 |-sprites (生成的合图相关样式及图片文件)
 |
----js
 |
 |-component (公共组件)
 |
 |-index
 |   |
 |   |-component (其它相关组件)
 |   |-main.js
 |   |-index.scss
 |
 |-detail
 |   |
 |   |-component
 |   |-main.js
 |   |-index.scss
 |
 |
----img
 |
 |-sprites (通过gulp的sprites插件对此处文件进行合图，生成到css/sprites下)
 |-static (普通图片)
 |-base64（约定base64文件放置于此，但其实是通过webpack去小于一定大小的文件进行内联）
 |
----libs
 |
 |-bootstrap
 |-react
 |-jquery
 |-fontawesome
 |
 |
index.html
detail.html
```

## 教程
可以打开gulpfile.js以及webpack.config.js看看注释。
关于webpack的优化用法，可以参考我的文章[《webpack使用优化》](https://github.com/lcxfs1991/blog/issues/2)

## 还没完成，后面弄成一个Boilerplate
