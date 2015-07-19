'use strict';
module.exports = (function() {
    return {
        uin: function() {
            //return powder.cookie("uin").replace(/[^\d]/g,"");
            //return powder.cookie("uin").replace("o0","");
            var uin = (document.cookie.match(/\W*uin=o(\d+)/) || [])[1];
            if (uin) {
                uin = uin.replace(/^[\D0]+/g, '');
            } else {
                uin = 0;
            }
            return uin;
        },
        bkn: function() {
            function getToken() {
                var skey = powder.cookie('skey');
                if(skey===null){
                    return;
                }
                var hash = 5381;
                for (var i = 0, len = skey.length; i < len; ++i) {
                    hash += (hash << 5) + skey.charCodeAt(i);
                }
                var _token = hash & 0x7fffffff;
                return _token;
            }
            return getToken();
        },
        //呼起QQ客户端
        //呼起后要调用的uri地址
        launchUriInQQ: function(uri, failCallback) {
            var f = document.createElement("iframe");
            f.style.display = "none";
            document.body.appendChild(f);
            var isSuccess = false;
            f.onload = function() {
                isSuccess = true;
            };
            f.src = 'mqqapi://forward/url?src_type=web&version=1&url_prefix=' + btoa(uri);
            setTimeout(function(){
                if(!isSuccess){
                    f.src = 'mqqapi://forward/url?src_type=web&version=1&t=1&url_prefix=' + btoa(uri);
                }
            },500);
            //f.src = 'mqqapi://forward/url?src_type=web&version=1&url_prefix=' + btoa(uri);
            // console.log(uri);
            // console.log('mqqapi://forward/url?src_type=web&version=1&url_prefix=' + btoa(uri));

        },
        //呼起手Q客户端群资料卡
        callQun: function(uin) {
            if(mqq.iOS){
                mqq.invoke("nav", "openGroupAioOrProfile", {"uin" : uin});
            }else if(mqq.android){
                //mqq.invoke("im", "aioorprofile", {"uin" : uin});
                var f = document.createElement("iframe");
                f.style.display = "none";
                document.body.appendChild(f);
                f.src = 'mqqapi://im/aioorprofile?src_type=internal&version=2&uin='+uin+'&jump_from=h5';
            }
        }
    };
})();