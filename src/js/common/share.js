'use strict';
var report = require('./report.js');

module.exports = (function() {
    var _share={
        init:function(title){
            //分享文案
            G.share = G.share || {};
            G.share.url=G.share.url || location.href;
            if(pageMap == 'index'){
                G.share.title=G.share.title || '我的群荣获橙名尊享，速来膜拜！',
                G.share.desc=G.share.desc || '《'+decodeURIComponent(powder.getQueryValue('name'))+'》上周表现优秀，荣获橙名尊享！';
                G.share.img=G.share.img || '___cdn/img/index/share.png?___md5';
            }else if(pageMap == 'cancel'){
                G.share.title=G.share.title || '我的群被取消橙名尊享，加把劲下周赢回来！',
                G.share.desc=G.share.desc || '《'+decodeURIComponent(powder.getQueryValue('name'))+'》上周表现欠佳，被取消橙名尊享！';
                G.share.img=G.share.img || '___cdn/img/cancel/share.png?___md5';
            }
        },
        qq:function(){
            var shareQQBox = $("#share-qq"),
                shareQQ = shareQQBox.find('[data-share]'),
                shareQQCancel = shareQQBox.find('[data-cancel]');
            shareQQBox.show();
            setTimeout(function(){
                shareQQ.addClass('show');
            },20);
            //注册事件
            if(!window.shareQQFlag){
                window.shareQQFlag=true;
                //取消按钮
                shareQQCancel.pTouch({tap:function(){
                    shareQQ.removeClass('show');
                    setTimeout(function(){
                        shareQQBox.hide();
                    },200);
                }});
                //每一个分享按钮
                $("#share-qq").pTouch({noScroll:true,tap:function(){
                    shareQQ.removeClass('show');
                    setTimeout(function(){
                        shareQQBox.hide();
                    },200);
                }});
                shareQQBox.pTouch('[data-index]',{tap:function(){
                    var self=this;
                    //上报逻辑
                    var m='';
                    switch($(self).data('index')){
                        case '1':
                        case 1:
                            m='qzone';
                            break;
                        case '2':
                        case 2:
                            m='wx';
                            m='weixin';
                            break;
                        case '3':
                        case 3:
                            m='pyq';
                            m='circle';
                            break;
                        case '0':
                        case 0:
                            m='qq';
                            break;
                    }
                    if(pageMap == 'index'){
                        report.tdw(
                            ['opername','module','action','ver1'],
                            ['orange_local','give_reward','Clk_sns',m]
                        );
                    }else if(pageMap == 'cancel'){
                        report.tdw(
                            ['opername','module','action','ver1'],
                            ['orange_local','cancle_reward','Clk_sns',m]
                        );
                    }
                    G.share.url = powder.setQueryValue('source',m,G.share.url);
                    mqq.ui.shareMessage({
                        title: G.share.title,
                        desc: G.share.desc,
                        share_type: $(self).data("index"),
                        share_url: G.share.url,
                        image_url: G.share.img,
                        back: true
                    },function(result){
                        if(result.retCode == 0){
                            mqq.ui.showTips({
                                text: '已发送'
                            });
                        }
                    });
                    
                }});
            }
        },
        wx:function(){
            document.addEventListener('WeixinJSBridgeReady', function() {
                //WeixinJSBridge.invoke('hideToolbar', function(res) {});

                // 发送给朋友
                WeixinJSBridge.on("menu:share:appmessage", shareFriends);

                // 发送到朋友圈分享
                WeixinJSBridge.on("menu:share:timeline", shareTimeline);
            });
            window.shareData = {
                img_url: G.share.img,
                img_width: "300",
                img_height: "300",
                link: G.share.url,
                desc: G.share.desc,
                title: G.share.title
            };
            function shareFriends() {
                WeixinJSBridge && WeixinJSBridge.invoke("sendAppMessage", window.shareData, function(b) {
                    // G.report.tdw(
                    //     ['opername','module','action','ver1'],
                    //     ['Grp_gohome','share','Clksns','wx']
                    // );
                })
            }

            function shareTimeline() {
                WeixinJSBridge && WeixinJSBridge.invoke("shareTimeline", window.shareData, function(b) {
                    // G.report.tdw(
                    //     ['opername','module','action','ver1'],
                    //     ['Grp_gohome','share','Clksns','pyq']
                    // );
                })
            }
        }
    };
    return {
        qq:function(){
            _share.init();
            _share.qq();
        },
        wx:function(){
            _share.init();
            _share.wx();
            // var shareWX = $("#share-wx-box");
            // shareWX.show();
            // //tap事件绑定
            // if(!window.shareWXFlag){
            //     window.shareWXFlag=true;
            //     shareWX.pTouch({noScroll:true,tap:function(){
            //         shareWX.hide();
            //     }});
            // }
        },
        openmobile:function(){
            _share.init();
            //定向分享Api
            //http://tapd.oa.com/QQConnectMobile/wikis/view/H5%2525E5%2525AE%25259A%2525E5%252590%252591%2525E5%252588%252586%2525E4%2525BA%2525ABweb%2525E9%2525A1%2525B5%2525E9%25259D%2525A2%2525E6%25258E%2525A5%2525E5%252585%2525A5wiki
            var url=G.share.url;
            var img=encodeURIComponent(G.share.img);
            
            //client.launchUriInQQ('http://openmobile.qq.com/api/check?page=shareindex.html&style=9&status_os=0&sdkp=0&title='+G.share.title+'&summary='+G.share.desc+'&imageUrl='+img+'&targetUrl='+url+'&page_url='+url+'&pagetitle='+encodeURIComponent('回家的路QQ群与你同行'));
            location.href='http://openmobile.qq.com/api/check?page=shareindex.html&style=9&status_os=0&sdkp=0&title='+G.share.title+'&summary='+G.share.desc+'&imageUrl='+img+'&targetUrl='+url+'&page_url='+url+'&pagetitle='+encodeURIComponent(G.share.desc)+'&appid=101051061';
        }//,
        // share:function(){
        //     _share.init();
        //     var shareWX = $("#share-wx-box");
        //     //显示分享弹层
        //     if(G.media === 'qq'){
        //         _share.qq();
        //     }else if(G.media === 'qzone'){
        //         shareWX.show();
        //     }else if(G.media === 'wx'){
        //         shareWX.show();
        //     }else{
        //         //定向分享Api
        //         //http://tapd.oa.com/QQConnectMobile/wikis/view/H5%2525E5%2525AE%25259A%2525E5%252590%252591%2525E5%252588%252586%2525E4%2525BA%2525ABweb%2525E9%2525A1%2525B5%2525E9%25259D%2525A2%2525E6%25258E%2525A5%2525E5%252585%2525A5wiki
        //         var url=G.share.url;
        //         var img=encodeURIComponent(G.share.img);
                
        //         //client.launchUriInQQ('http://openmobile.qq.com/api/check?page=shareindex.html&style=9&status_os=0&sdkp=0&title='+G.share.title+'&summary='+G.share.desc+'&imageUrl='+img+'&targetUrl='+url+'&page_url='+url+'&pagetitle='+encodeURIComponent('回家的路QQ群与你同行'));
        //         location.href='http://openmobile.qq.com/api/check?page=shareindex.html&style=9&status_os=0&sdkp=0&title='+G.share.title+'&summary='+G.share.desc+'&imageUrl='+img+'&targetUrl='+url+'&page_url='+url+'&pagetitle='+encodeURIComponent(G.share.desc)+'&appid=101051061';
        //     }
        //     //微信模式
        //     if(!window.shareWXFlag){
        //         window.shareWXFlag=true;
        //         shareWX.pTouch({noScroll:true,tap:function(){
        //             shareWX.hide();
        //         }});
        //     }
            
        // }
    };
})();