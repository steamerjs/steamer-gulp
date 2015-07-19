'use strict';
//ajax请求相关
var client = require('./client');

module.exports = (function() {
    return {
        ajax: function(opt) {
            var setting = {};
            //运行时间初始化
            var startTime = new Date().getTime();
            //超时逻辑
            var overtime = 5000; //超时时间
            var timer = setTimeout(function() {
                console.log("请求超时！");
                opt.error && opt.error({
                    ec: 999
                });
            }, overtime);
            //data
            setting = $.extend(true, {}, opt);
            setting.data = setting.data || {};
            //bkn
            if (!setting.data.bkn) {
                setting.data.bkn = client.bkn();
            }
            //跨域支持
            //setting.xhrFields={withCredentials : true};
            //
            setting.timeout = overtime;
            var success = function(data) {
                clearTimeout(timer);
                try {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                } catch (e) {
                    console.debug(opt.url, e, data);
                }
                var endTime = new Date().getTime() - startTime;
                var ec = (data || {}).ec || data.retcode;
                if (typeof ec === 'undefined') {
                    ec = 999;
                }
                opt.success && opt.success(data);
            };
            setting.success = success;
            var error = function(data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = {
                        ec: 999
                    }
                    console.debug(e);
                }
                opt.error && opt.error(data);
            };
            setting.error = error;
            // console.log(opt);
            // console.log(setting);
            //ajax
            $.ajax(setting);
        },
        //postErr统一的post出错处理
        postErr: function(d) {
            switch (d.ec) {
                case 1:
                    console.log("你已经处于离线状态，请上线后再次尝试");
                    break;
                case 2:
                    console.log("系统内部错误!");
                    break;
                case 3:
                    console.log("输入参数错误!");
                    break;
                case 4:
                    console.log("BASEKEY错误!");
                    break;
                case 999:
                    console.log("CGI数据拉取失败!");
                    break;
                default:
                    console.log("未知错误，错误码:d.ec=" + d.ec);
            }
        }
    };
})();