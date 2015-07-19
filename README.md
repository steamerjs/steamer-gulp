```
./src
├── css  -- sass 样式目录，不需要编译生成 .css 文件的子模块，请使用 _ 开头
│   ├── common   -- 公共样式
│   │   ├── _level.scss  -- 自动 sprite 合并图片示范
│   │   ├── _reset.scss  -- reset css 公共模块
│   │   └── _ricons.scss  -- retina 高清 sprite 合并图片示范
│   ├── index  -- index 页面样式子模块，可以将 index 所需样式进行子模块划分，便于管理
│   │   └── _submodule.scss  -- 子模块，以下划线开头
│   │   └── index.scss  -- 合并所有 index 页面样式子模块，公共模块，合图...
├── favicon.ico
├── img  -- 图片目录
│   ├── common  -- 不需合图的图片，文件会自动在文件名加上md5，filename-md5.png
│   │   ├── banner.png  -- 自动生成 banner-be70f3b1.png
│   ├── sprite  -- 需要合图的图片，安装生成 sprite 图片名进行目录划分，可以自己新建子目录
│   │   ├── icons  -- 普清图，最终合并生成 icons-sbb41937c32.png
│   │   ├── icons@2x -- 2x高清图，生成 icons@2x-sb721890e87.png
│   │   └── level -- 普清图，生成 level-s99b1a493c7.png
│   └── static  -- 不需合图的图片，不需自动md5重命名的图片
│       ├── static-img-url.png
├── index.html  -- 首页
├── js  -- js 目录，使用 cmd require 规范进行模块之间应用
│   ├── common -- 公共模块
│   │   ├── config.js
│   │   └── global.js
│   ├── index  -- 首页 js 模块
│   │   └── index.js
│   └── libs  -- 第三方 js 库，会被复制到 dist 目录，js/css 文件名 md5 化
│       └── jquery
├── libs  -- 第三方库，libs 所有文件会被复制到 dist 目录，js/css 文件名 md5 化
│   └── bootstrap
│       ├── bootstrap.css
│       └── bootstrap.js
└── tpl  -- handlebar 模板文件
    ├── common  -- 公共模板页面片
    │   ├── footer.hbs
    │   └── header.hbs
    └── index  -- 首页模板
        └── list.hbs
```