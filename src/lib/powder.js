'use strict';
//console
if (typeof window.console == 'undefined') {
    window.console = {};
    window.console.log = function(txt) {
        //alert(txt);
    };
}
//单体创建
window.powder = window.powder || {};
powder.type = function(o) {
    var t = Object.prototype.toString.call(o),
        l = t.length;
    return o == null ? String(o) : t.slice(8, l - 1);
};
//空函数
powder.emptyFn = function() {
    return;
};
//获取夹角
powder.getAngle = function(y, x) {
    return Math.atan2(y, x) / Math.PI * 180.0;
};
//夹角回归
powder.reviseAngle = function(n) {
    //if(n>360 || n<-360){n=n%360;}
    //if(n<0){n=n+360;}
    (n > 360 || n < -360) && (n = n % 360);
    (n < 0) && (n = n + 360);
    return n;
};
//获取距离
powder.getDis = function(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};
//touch 附加材料
powder.touchAttr = {};
//设置最小距离产生时判断为发生移动
powder.touchAttr.minMove = 5;
//please call this
// 方向检测
//【必选】x横向移动距离,y纵向移动距离
//【可选】duration滑动持续时间，判断手指在容器$(this)内的滑动速率决定移动方向
powder.touchAttr.directionDetect = function(x, y, duration) {
    var self = this,
        pta = powder.touchAttr;
    //移动距离低于minMove方向监测失败
    if (Math.abs(x) > pta.minMove ||
        Math.abs(y) > pta.minMove ||
        Math.abs(x) < -pta.minMove ||
        Math.abs(y) < -pta.minMove) {
        //move true
    } else {
        //move false
        return false;
    }
    if (duration) { //容器模式
        if (Math.tan(powder.getDis(x, y) / duration) > 0.22) { //速率大于0.22
            if (Math.abs(x) > Math.abs(y)) {
                return x < 0 ? 'left' : 'right';
            } else {
                return y < 0 ? 'down' : 'up';
            }
        } else {
            if (Math.abs(x) > Math.abs(y) && Math.abs(x) >= (powder.wClientWidth() / 6)) {
                return x < 0 ? 'left' : 'right';
            } else if (Math.abs(y) >= Math.abs(x) && Math.abs(y) >= (powder.wClientHeight() / 6)) {
                return y < 0 ? 'down' : 'up';
            }
        }/* else {
            if (Math.abs(x) > Math.abs(y) && Math.abs(x) >= ($(self).width() / 6)) {//靠，全屏滚动这个6会变得很长
                return x < 0 ? 'left' : 'right';
            } else if (Math.abs(y) >= Math.abs(x) && Math.abs(y) >= ($(self).height() / 6)) {
                return y < 0 ? 'down' : 'up';
            }
        }*/
    } else { //标准模式
        if (Math.abs(x) > Math.abs(y)) {
            return x < 0 ? 'left' : 'right';
        } else {
            return y < 0 ? 'down' : 'up';
        }
    }
    return false;
};
//please call this
//检查对象正确性，用无意义的一个字段作为监测条件
//this:待检测的对象
//txt:错误抛出文案
powder.touchAttr.justCheck = function(txt) {
    var self = this;
    if (typeof self == 'undefined') {
        console.log('source:' + txt + '; err:this undefined');
        return true;
    } else if (typeof self.nothingIsJustOneNullFlag == 'undefined') {
        console.log('source:' + txt + '; err:this.nothingIsJustOneNullFlag undefined');
        return true;
    } else {
        return false;
    }
};
//please call this
//ref:强制刷新 true ，false
powder.touchAttr.layout = function(ref) {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.layout')) {
        return;
    }
    if (typeof self.isSetLayoutFlag == 'undefined' || ref) {
        self.isSetLayoutFlag = true; //状态设置为已设置
    } else if (self.isSetLayoutFlag) {
        return; //已初始化过
    }
    var _self = $(self);
    var offset = _self.offset();
    self.bL = offset.left;
    self.bT = offset.top;
    self.bW = _self.width();
    self.bH = _self.height();
    self.bR = self.bL + self.bW;
    self.bB = self.bT + self.bH;
};
//please call this
powder.touchAttr.scaleLim = function() {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.scaleLim')) {
        return;
    }
    if (self.scale < self.scaleMin) {
        self.scale = self.scaleMin;
    } else if (self.scale > self.scaleMax) {
        self.scale = self.scaleMax;
    }
};
//please call this
//attr:待检查的属性
powder.touchAttr.isOptFn = function(attr) {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.isOptFn')) {
        return;
    }
    if (typeof self[attr] == "function") {
        return true;
    } else {
        return false;
    }
};
//please call this
//attr:待检查的属性
//es:事件对象
powder.touchAttr.isOptFnRun = function(attr, es) {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.isOptFnRun')) {
        return;
    }
    if (pta.isOptFn.call(self, attr)) {
        self[attr](es);
        return true;
    } else {
        return false;
    }
};
//please call this
//边界检测
//x:横坐标；y:纵坐标
powder.touchAttr.borderDetect = function(x, y) {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.borderDetect')) {
        return;
    }
    return (x < self.bL || x > self.bR || y < self.bT || y > self.bB);
};
//please call this
//函数过滤器，如果外部没有调用outFn接口那么依赖相关的fn逻辑也将不存在
//优化专用，避免创建多余运算逻辑
powder.touchAttr.filter = function(outFn, fn) {
    var self = this,
        pta = powder.touchAttr;
    if (pta.justCheck.call(self, 'pta.filter')) {
        return;
    }
    var flag = false;
    var temp = outFn.split(",");
    for (var i = 0, len = temp.length; i < len; i++) {
        if (pta.isOptFn.call(self, temp[i])) {
            flag = true;
            break;
        }
    }
    if (flag) {
        self['filter_' + outFn] = fn;
    } else {
        self['filter_' + outFn] = powder.emptyFn;
    }
};

powder.touch = function(box, selector, args) {
    var opt = {
        nothingIsJustOneNullFlag: true, //一个空标识

        beforeActiveClass: false, //是否给当前容器增加tap前的active效果
        afterActiveClass: false, //是否给当前容器增加tap后的active效果

        isHasMove: false, //是否发生移动
        isReadyMove: false, //touch是否准备好要移动了，用来判断当前的movefn是否在startfn之后，此状态与endfn无关
        directionMod: "box", //方向感应模式，有两种状态标准状态normal,容器模式box

        recordRotation: 0, //记录旋转角度
        recordScale: 1, //记录缩放比率

        scaleMin: 0.1, //最小缩放倍率
        scaleMax: 10, //最大缩放倍率

        isMultiMod: false, //是否为多指操作模式，当双指中的一指离开该状态依然为true直到双指均已离开状态才恢复为false
        isMultiple: false, //多指操作中，当双指中的一指离开该状态置为false
        isMultiStart: false, //multistart是否执行过

        tapCount: 0, //鼠标点击次数
        isDblMoveMod: false, //是否dblMove模式
        isDblMoveStart: false, //dblMoveStart是否执行过
        isLongTapMoveMod: false, //是否LongTap模式
        isLongTapMoveStart: false, //LongTapStart是否执行过

        isHangs: false, // touch是否被挂起，挂起逻辑上一般是代码的手工挂起所以挂起必须设定挂起的时长
        //hangs:function(es,time,fn){},//挂起回调

        isLeave: false, //是否离开区域
        isLeaveReturn: true, //离开区域是否主动挂起

        //off:function(eName){},//事件解绑

        preventDefault: false, //是否禁用浏览器默认行为，默认不会禁止默认行为
        noScroll: false //禁用滚动条
    };
    (function() {
        for (var k in args) {
            opt[k] = args[k];
        }
    })();

    //记录保存
    opt.record = function() {
            var self = this,
                pta = powder.touchAttr;
            if (pta.justCheck.call(self, 'opt.record')) {
                return;
            }
            self.recordRotation = self.rotation;
            self.recordScale = self.scale;
        }
        //end的部分状态单独抽离封装，主要给touch挂起时使用
    opt.endSubFn = function(es) {
        var self = this,
            pta = powder.touchAttr;
        if (pta.justCheck.call(self, 'opt.endSubFn')) {
            return;
        }
        self.touchLen = es.touches.length;
        self.endTime = new Date();
        self.duration = self.endTime - self.startTime;
        //longtap
        clearTimeout(self.longTapTime);
        //endfn
        self.filter_endFn(es);
        //tap后active效果
        if (self.afterActiveClass) {
            $(self).addClass(self.afterActiveClass);
            setTimeout(function() {
                $(self).removeClass(self.afterActiveClass);
            }, 200);
        }
        //
        if (!self.isHasMove && self.touchLen == 0) {
            self.tapCount = self.tapCount + 1;
            self["filter_tap,dblTap,singleTap"](es);
        } else {
            clearTimeout(self.tapTimeout);
        }
        //重置tapcount
        if (self.isHasMove) {
            self.tapCount = 0;
        }
        //
        if (self.touchLen < 1) {
            self.isMultiStart = false;
            self.isMultiMod = false;
            //
            self.isHangs = false;
            //
            self.isReadyMove = false;
            //
            self.isDblMoveMod = false;
            self.isDblMoveStart = false;
            //
            self.isLongTapMoveMod = false;
            self.isLongTapMoveStart = false;
        }
        self.isMultiple = false;
    };
    // touch挂起 
    // time:挂起时长，多长时间后解挂 
    // fn:time之后回调
    // es:事件
    opt.hangs = function(time, fn, es) {
        var self = this,
            pta = powder.touchAttr;
        if (pta.justCheck.call(self, 'opt.hangs')) {
            return;
        }
        self.isHangs = true;
        setTimeout(function() {
            self.isHangs = false;
            if (typeof fn == "function") {
                fn.call(self);
            }
        }, time);
        self.endSubFn.call(self,es);
    }
    var filterRun = function(self) {
        var pta = powder.touchAttr;
        //start end
        pta.filter.call(self, "startFn", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter startFn')) {
                return;
            }
            self.startFn(es);
        });
        pta.filter.call(self, "endFn", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter endFn')) {
                return;
            }
            self.endFn(es);
        });
        //multi
        pta.filter.call(self, "multiStart", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter multiStart')) {
                return;
            }
            self.multiStart(es);
        });
        pta.filter.call(self, "multiMove", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter multiMove')) {
                return;
            }
            var e0 = es.touches[0],
                e1 = es.touches[1],
                xLen = e1.pageX - e0.pageX,
                yLen = e1.pageY - e0.pageY,
                angle = powder.getAngle(yLen, xLen),
                gDis = powder.getDis(xLen, yLen);
            if (!self.isMultiple) {
                self.gStartDis = gDis;
                self.gStartAngle = angle;
            } else {
                self.gEndDis = gDis;
                self.gEndAngle = angle;
                //缩放倍率计算
                self.scale = (gDis / self.gStartDis) * self.recordScale;
                //缩放倍率限制
                pta.scaleLim.call(self);
                //旋转值计算
                self.rotation = powder.reviseAngle(angle - self.gStartAngle + self.recordRotation);
            }
            self.multiMove(es);
        });
        //longtap
        pta.filter.call(self, "longTapMoveStart", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter longTapMoveStart')) {
                return;
            }
            self.longTapMoveStart(es);
        });
        pta.filter.call(self, "longTapMove", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter longTapMove')) {
                return;
            }
            if (self.mY > 0) {
                self.scale = self.recordScale * (1 + self.distance / 150);
            } else {
                self.scale = self.recordScale * 1 / (1 + self.distance / 150);
            }
            //缩放倍率限制
            pta.scaleLim.call(self);
            self.longTapMove(es);
        });
        //dblmove
        pta.filter.call(self, "dblMoveStart", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter dblMoveStart')) {
                return;
            }
            self.dblMoveStart(es);
        });
        pta.filter.call(self, "dblMove", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter dblMove')) {
                return;
            }
            if (self.mY > 0) {
                self.scale = self.recordScale * (1 + self.distance / 150);
            } else {
                self.scale = self.recordScale * 1 / (1 + self.distance / 150);
            }
            //缩放倍率限制
            pta.scaleLim.call(self);
            self.dblMove(es);
        });
        //touchleave
        pta.filter.call(self, "leaveFn", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter leaveFn')) {
                return;
            }
            //beforeActiveClass
            if (self.beforeActiveClass) {
                $(self).removeClass(self.beforeActiveClass);
            }
            self.leaveFn(es);
        });
        //movefn
        pta.filter.call(self, "moveFn", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter moveFn')) {
                return;
            }
            self.moveFn(es);
        });
        //tap
        pta.filter.call(self, "tap,dblTap,singleTap", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter tap,dblTap,singleTap')) {
                return;
            }
            if (!self.isHasMove && self.touchLen == 0) {
                self.tapCount++;
                pta.isOptFnRun.call(self, "tap", es);
                if (!pta.isOptFn.call(self, "dblMove") && pta.isOptFn.call(self, "dblTap") && self.tapCount == 2) {
                    self.dblTap(self, es);
                    self.tapCount = 0;
                }
                //taptimeout
                clearTimeout(self.tapTimeout);
                self.tapTimeout = setTimeout(function() {
                    if (pta.isOptFn.call(self, "singleTap") && self.tapCount == 1) {
                        self.singleTap(es);
                    } else if (pta.isOptFn.call(self, "dblMove") && pta.isOptFn.call(self, "dblTap") && self.tapCount == 2) {
                        self.dblTap(es);
                    }
                    self.tapCount = 0;
                }, 250);

            } else {
                clearTimeout(self.tapTimeout);
            }
        });
        pta.filter.call(self, "longTap", function(es) {
            var self = this;
            if (pta.justCheck.call(self, 'filter longTap')) {
                return;
            }
            self.longTap(es);
        });
    };

    var startFn = function(es) {
            //creat opt
            var self = this,
                pta = powder.touchAttr;
            if (typeof self.nothingIsJustOneNullFlag == 'undefined') {
                for (var k in opt) {
                    self[k] = opt[k];
                }
                filterRun(self);
            }
            //hang
            if (self.isHangs) {
                return;
            }
            //init
            var e = es.touches[0];
            pta.layout.call(self);
            self.touchLen = es.touches.length;
            self.startX = e.pageX;
            self.startY = e.pageY;
            self.startTime = new Date();
            self.angle = 0;
            self.distance = 0;
            self.speed = 0;
            self.direction = false;
            self.identifier = e.identifier;
            self.filter_startFn(es);
            //tap前active效果
            if (self.beforeActiveClass) {
                $(self).addClass(self.beforeActiveClass);
                setTimeout(function() {
                    $(self).removeClass(self.beforeActiveClass);
                }, 200);
            }
            //longTap
            clearTimeout(self.longTapTime);
            self.longTapTime = setTimeout(function() {
                if (self.touchLen == 1 && self.tapCount == 0) { //单击
                    self.filter_longTap(es);
                    self.tapCount = -1;
                }
            }, 400);
            if (self.touchLen > 1) {
                clearTimeout(self.longTapTime);
            }
            //ismultimod
            if (self.touchLen > 1) {
                self.isMultiMod = true;
            }
            //其他状态
            self.isLeave = false;
            self.isReadyMove = true;
            self.isHasMove = false;
            self.preventDefault && (es.preventDefault());
        }
        //
    var moveFn = function(es) {
        var self = this,
            e = es.touches[0],
            pta = powder.touchAttr;
        if ((pta.borderDetect.call(self, e.pageX, e.pageY) && !self.isMultiMod) || self.isHangs || !self.isReadyMove) {
            if (pta.borderDetect.call(self, e.pageX, e.pageY)) {
                //leaveFn
                if (!self.isLeave) {
                    self.filter_leaveFn(es);
                    self.isLeave = true;
                }
                if(self.isLeaveReturn){
                    return;
                }
            }else{
                self.isReadyMove = false;
                return; //这里千万别return false，否则当出现事件嵌套时，冒泡将被阻止
            }
        }
        self.endX = e.pageX;
        self.endY = e.pageY;
        self.endTime = new Date();
        self.duration = self.endTime - self.startTime;
        self.mX = self.endX - self.startX;
        self.mY = self.endY - self.startY;
        self.angle = powder.getAngle(self.mY, self.mX);
        self.distance = powder.getDis(self.mX, self.mY);
        self.speed = self.mX / self.duration;
        if (self.directionMod == "box") {
            self.direction = pta.directionDetect.call(self, self.mX, self.mY, self.duration);
        } else {
            self.direction = pta.directionDetect.call(self, self.mX, self.mY);
        }
        if (Math.abs(self.distance) > pta.minMove) {
            //longtap
            clearTimeout(self.longTapTime);
            //beforeActiveClass
            if (self.beforeActiveClass) {
                $(self).removeClass(self.beforeActiveClass);
            }
            //
            self.isHasMove = true;
            clearTimeout(self.tapTimeout);
            if (self.tapCount == 1) { //双击移动
                self.tapCount = -2;
            }
        }
        //multi
        if (self.touchLen > 1) {
            if (!self.isMultiStart) {
                self.filter_multiStart(es);
                self.isMultiStart = true;
            }
            self.filter_multiMove(es);
            self.isMultiple = true;
        } else {
            //longtap
            if (!self.isLongTapMoveStart && self.tapCount == -1) {
                self.filter_longTapMoveStart(es);
                self.isLongTapMoveStart = true;

            }
            if (self.tapCount == -1) {
                self.filter_longTapMove(es);
                self.isLongTapMoveMod = true;
            }
            //dblmove
            if (!self.isDblMoveStart && self.tapCount == -2) {
                self.filter_dblMoveStart(es);
                self.isDblMoveStart = true;
            }
            if (self.tapCount == -2) {
                self.filter_dblMove(es);
                self.isDblMoveMod = true;
            }
        }
        //movefn
        self.filter_moveFn(es);
        //preventdefault
        if (Math.abs(self.distance) > 0 && self.noScroll) {
            es.preventDefault();
        } else {
            self.preventDefault && (es.preventDefault());
        }
    }

    var endFn = function(es) {
        var self = this;
        //beforeActiveClass
        if (self.beforeActiveClass) {
            $(self).removeClass(self.beforeActiveClass);
        }
        if (self.isHangs || !self.isReadyMove) {
            return; //这里千万别return false，否则当出现事件嵌套时，冒泡将被阻止
        }
        self.endSubFn(es);
        self.preventDefault && (es.preventDefault());
    }

    //龙套跑起
    if (selector) {
        box.on('touchstart', selector, startFn);
        box.on('touchmove', selector, moveFn);
        box.on('touchend', selector, endFn);
    } else {
        box.on('touchstart', startFn);
        box.on('touchmove', moveFn);
        box.on('touchend', endFn);
    }

    //return
    return opt;
};
if (window.jQuery || window.Zepto) {
    (function($) {
        $.fn.pTouch = function(a, b) {
            if (b) {
                return powder.touch($(this), a, b);
            } else if (a) {
                return powder.touch($(this), '', a);
            }

        };
    })(window.jQuery || window.Zepto);
};


//===============================================================================

powder.wClientHeight = function(r) {
    var d = document;
    if (!powder._clientHeight || r) {
        powder._clientHeight = d.documentElement.clientHeight || d.body.clientHeight;
    }
    return powder._clientHeight;
};
powder.wClientWidth = function(r) {
    var d = document;
    if (!powder._clientWidth || r) {
        powder._clientWidth = d.documentElement.clientWidth || d.body.clientWidth;
    }
    return powder._clientWidth;
};
powder.nowUrl = location.href;
powder.addQueryValue= function(key, val, url) {
    var strurl = url || powder.nowUrl;
    strurl = strurl.replace(/#.*/gi, "");
    if (strurl.indexOf("?") < 0) {
        return strurl + "?" + key + "=" + val;
    } else {
        var laststr = strurl.slice(-1);
        if (laststr == "&") {
            return strurl + key + "=" + val;
        } else {
            return strurl + "&" + key + "=" + val;
        }
    }
};
powder.addQueryString= function(str, url) {
    var strurl = url || powder.nowUrl;
    strurl = strurl.replace(/#.*/gi, "");
    if (strurl.indexOf("?") < 0) {
        return strurl + "?" + str;
    } else {
        var laststr = strurl.slice(-1);
        if (laststr == "&") {
            return strurl + str;
        } else {
            return strurl + "&" + str;
        }
    }
};
powder.setQueryValue= function(key, val, url) {
    var strurl = url || powder.nowUrl;
    //url清理
    strurl = strurl.replace(new RegExp("([\&|\?])" + key + "=[^&]*(&{0,1})", "ig"), "$1");
    if (val == null) {
        return strurl;
    } else {
        //添加
        return powder.addQueryValue(key, encodeURIComponent(val), strurl);
    }
};
powder.getQueryValue= function(key, url) {
    var strurl = url || powder.nowUrl;
    var vals = new RegExp("[\&|\?]" + key + "=([^&]*)&{0,1}", "ig").exec(strurl);
    return vals ? (vals[1].replace(/#.*/gi, "")) : "";
};
//元素按flexW:flexH比率撑满全屏并局中
powder.boxCoverMiddle = function(boxW,boxH,flexW,flexH,cb){
    var newW = boxW,
        newH = boxH,
        canMarginLeft = 0,
        canMarginTop = 0,
        flexW = flexW || 2,
        flexH = flexH || 3;
    if(boxW * flexH < boxH * flexW) {//参照物2:3，结果height偏高，需对img width 进行调整
        newW = newH * flexW / flexH;
        canMarginLeft = -(newW - boxW) / 2;
    } else {//参照物2:3，结果height偏低，需对img height 进行调整
        newH = newW * flexH / flexW;
        canMarginTop = -(newH - boxH) / 2;
    }
    cb(newW,newH,canMarginLeft,canMarginTop);
};
//新增css规则
powder.styleAddRule = function(ruleName,ruleValue){
    var style = document.styleSheets[document.styleSheets.length - 1];
    if(style.addRule) {
        style.addRule(ruleName, ruleValue);
    } else {
        style.insertRule(ruleName + '{' + ruleValue + '}');
    }
};