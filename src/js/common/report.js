'use strict';

var report = {};
module.exports = report;

window.G = window.G || {};
window.G.report = report;

var APPID = {
    badjs: 283,
    mm: 1000215,
    tdw: 'dc00141'
};

var UIN = (document.cookie.match(/\W*uin=o(\d+)/) || [])[1];
if (UIN) {
    UIN = UIN.replace(/^[\D0]+/g, '');
} else {
    UIN = 0;
}

var GCODE = (window.location.search.match(/[?&]gc=(\d+)[^?&]?/) || [])[1] || G.gc;


var type = function(o) {
    var t = Object.prototype.toString.call(o),
        l = t.length;
    return o == null ? String(o) : t.slice(8, l - 1);
};

var arrayIndexOf = function(arrData, oKey) {
    for (var i = 0, len = arrData.length; i < len; i++) {
        if (arrData[i] == oKey) {
            return true;
        }
    }
    return false;
};

//罗盘上报
// report.tdw(
//     ['opername','module','action'],
//     [opername,module,action]
// );
report.tdw = function(fields, data) {
    if (type(data) != 'Array') {
        console.log('The param "data" required and must be an array.');
    };

    // 保证data是二维数组
    if (type(data[0]) != 'Array') data = [data];

    // 此处统一填群号
    if (GCODE && !arrayIndexOf(fields, 'obj1')) {
        fields.unshift('obj1');
        data[0].unshift(G.gc);
    }
    // 此处统一添加qq版本号
    if (!arrayIndexOf(fields, 'obj2')) {
        fields.unshift('obj2');
        if (typeof mqq == 'undefined') {
            data[0].unshift(navigator.userAgent);
        } else {
            data[0].unshift(mqq.QQVersion);
        }
    }
    // 此处统一添加uin
    if (UIN && !arrayIndexOf(fields, 'uin')) {
        fields.unshift('uin');
        data[0].unshift(UIN);
    }
    // 加时间戳，确保不会被缓存
    // 实践发现fields不能encodeURIComponent
    var url = 'http://cgi.connect.qq.com/report/tdw/report?table=' + APPID.tdw + '&fields=' + JSON.stringify(fields) + '&datas=' + encodeURIComponent(JSON.stringify(data)) + '&t=' + Date.now();
    var img = new Image();
    img.src = url;
    img = null;
};

//monitor 上报
//report.m(232334);
//report.m([2323,445,5643]);
report.m = function(id) {
    var url = 'http://cgi.connect.qq.com/report/report_vm?monitors=[' + id + ']&t=' + Date.now();
    var img = new Image();
    img.src = url;
    img = null;
};

//huatuo上报
//report.h(223,5334,6676,[1,2,5,7],[2223,4423,664,77]);
report.h = function(f1, f2, f3, fields, data) {
    var str = '';
    fields.forEach(function(item, i) {
        str += item + '=' + data[i] + '&';
    });
    var speedparams = encodeURIComponent('flag1=' + f1 + '&flag2=' + f2 + '&flag3=' + f3 + '&' + str);
    var url = 'http://report.huatuo.qq.com/report.cgi?appid=10016&speedparams='+speedparams;
    var img = new Image();
    img.src = url;
    img = null;
};