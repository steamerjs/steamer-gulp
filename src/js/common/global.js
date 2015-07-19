var util = {};
module.exports = util;

var ls  = window.localStorage;

function getCookie(name){
    var r = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)'),
        m = document.cookie.match(r);
    return (!m ? '' : m[1]);
}

function getUin(){
    var uin = getCookie('uin');
    if(!uin){
        return 0;
    }
    uin += '';
    return uin.replace(/^[\D0]+/g,'');    
}

function ldw(){

    var str = getCookie('skey');
    var hash = 5381;
    for (var i = 0, len = str.length; i < len; ++i) {
        hash += (hash << 5) + str.charAt(i).charCodeAt();
    }


    return this.CSRFToken = hash & 0x7fffffff;	
}

function setCache(name,value){
    try{
        return ls.setItem(name,value);
    }catch(e){

    }
}

function getCache(name){
    try{
        return ls.getItem(name);
    }catch(e){

    }
}

function getParameter(name,str) {
    str = str || location.href;

    // 拿到queryString
    str = str.split("?");

    if (str[1]) {
        str = str[1]
    }

    // decode url again
    str = decodeURIComponent(str);

    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"), m = str.match(r);
    return decodeURIComponent(!m ? "" : m[2]);
}

util.getCookie = getCookie;
util.getLdw = ldw;
util.getUin = getUin;
util.getParameter = getParameter;
util.setCache = setCache;
util.getCache = getCache;
