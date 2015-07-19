'use strict';


(function($) {


    var client = require('./common/client.js'),
        report = require('./common/report.js'),
        share = require('./common/share.js');


    window.G = {};
    G.noSupport = false;
    G.gc = powder.getQueryValue('gc');
    //平台判断
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        G.media = 'wx';
    } else if (/Qzone/i.test(navigator.userAgent)) {
        G.media = 'qzone';
    } else if (mqq.QQVersion != "0") {
        G.media = 'qq';
    } else {
        G.media = 'other';
    }
    if (powder.getQueryValue('source')) {
        G.reportMedia = powder.getQueryValue('source');
    } else {
        G.reportMedia = 'qqaid';
    }
    if (G.media !== 'qq' && !powder.getQueryValue('qq')) {
        $('#OpenByQQ').show();
        $('#layout').hide();
        G.noSupport = true;
        client.launchUriInQQ(location.href);
    }
    G.newH = function(w, h, newW) {
        return h * newW / w;
    };
    if(!G.noSupport){
        //full style
        //console.log('ClientWidth:'+powder.wClientWidth())
        if (powder.wClientWidth() < 375) {
            $('body').addClass('minWidth');
        } else if (powder.wClientWidth() > 375) {
            $('body').addClass('maxWidth');
        }
        //pageMap
        if (pageMap == 'index') {
            //自适应
            $('#banner').height(G.newH(1242, 1066, powder.wClientWidth()));
            $('#con1').height(G.newH(1242, 406, powder.wClientWidth()));
            $('#con2').height(G.newH(1242, 390, powder.wClientWidth()));
            $('#con3').height(G.newH(1242, 459, powder.wClientWidth()));
            if(mqq.iOS){
                $('#con1').addClass('con1-ios');
            }else{
                $('#con1').addClass('con1');
            }
            report.tdw(
                ['opername', 'module', 'action', 'ver1'], ['orange_local', 'give_reward', 'exp', G.reportMedia]
            );
        } else if (pageMap == 'cancel') {
            //自适应
            $('#encourage').height(G.newH(1014, 304, $('#encourage').width()));
            $('#cancel-con1').height(G.newH(1242, 658, powder.wClientWidth()));
            $('#cancel-con2').height(G.newH(1242, 388, powder.wClientWidth()));
            $('#cancel-con3').height(G.newH(1242, 552, powder.wClientWidth()));
            $('#ornament').height(G.newH(1242, 1340, powder.wClientWidth()));
            if(mqq.iOS){
                $('#cancel-con1').addClass('cancel-con1-ios');
            }else{
                $('#cancel-con1').addClass('cancel-con1');
            }
            //立即去群里唠嗑
            if (mqq.compare("5.5") > -1 || powder.getQueryValue('qq')) {
                $('#callQun').pTouch({
                    tap: function() {
                        client.callQun(G.gc);
                        report.tdw(
                            ['opername', 'module', 'action'], ['orange_local', 'cancle_reward', 'Clk_button']
                        );
                    },
                    beforeActiveClass: 'active'
                });
            } else {
                $('#callQun').hide();
            }
            report.tdw(
                ['opername', 'module', 'action', 'ver1'], ['orange_local', 'cancle_reward', 'exp', G.reportMedia]
            );
        }
        if(!G.noSupport){
            //设置qq客户端顶部背景色
            mqq.ui.setWebViewBehavior({
                navBgColor: 0xff9b30,
                navTextColor: 0xffffff,
                actionButton: 1
            });
        }
        //群名称
        $('#qunName').html(decodeURIComponent(powder.getQueryValue('name')));

        //右上角分享按钮设置
        if (G.media === 'qq') { //qq
            mqq.ui.setActionButton({
                iconID: 4
            }, function() {
                if (pageMap == 'index') {
                    report.tdw(
                        ['opername', 'module', 'action'], ['orange_local', 'give_reward', 'Clk_share']
                    );
                } else if (pageMap == 'cancel') {
                    report.tdw(
                        ['opername', 'module', 'action'], ['orange_local', 'cancle_reward', 'Clk_share']
                    );
                }
                share.qq();
            });
        } else if (G.media === 'wx') {
            share.wx();
        }





        //banner定点
        var percent = powder.wClientWidth() / 1242;
        var left = 328 * percent,
            top = 718 * percent,
            width = 602 * percent,
            height = 104 * percent;
        $('#qunNameBox').css({
            top: top,
            height: height,
            lineHeight: height + 'px'
        });


        $(window).load(function(){
            window.timeOnLoad = new Date().getTime();
            if (pageMap == 'index') {
                report.h(1539,1,1,[1,2,3,4],
                    [
                    timeCssEnd-timeDomStart,
                    timeDomReady-timeDomStart,
                    timeOnLoad-timeDomStart,
                    timeDomReady-timeJsStart]
                );
            } else if (pageMap == 'cancel') {
                report.h(1539,1,2,[1,2,3,4],
                    [
                    timeCssEnd-timeDomStart,
                    timeDomReady-timeDomStart,
                    timeOnLoad-timeDomStart,
                    timeDomReady-timeJsStart]
                );
            }
            
        });
        

    }



})(Zepto);