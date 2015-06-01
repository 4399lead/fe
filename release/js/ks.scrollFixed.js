;(function(factory) {
    // CMD/SeaJS
    if(typeof define === "function") {
        define(factory);
    }
    // No module loader
    else {
        factory('', window['ue'] = window['ue'] || {}, '');
    }

}(function(require, exports, module) {

    var ie6fixList = [],
        ie6 = $.browser.msie && $.browser.version=="6.0",
        last_window_resize_time = new Date();

    /*获取浏览器可见区域的宽高*/
    function getVisibleSize(){
        return {
            width : $(document).width(),//window.innerWidth || document.documentElement.clientWidth,
            height : window.innerHeight || document.documentElement.clientHeight
        }
    }

    /*获取滚动条滚动的高度*/
    function getScrollTop(){
        return  document.documentElement.scrollTop || document.body.scrollTop;
    }

    /*获取滚动条滚动的高度*/
    function getScrollLeft(){
        return  document.documentElement.scrollLeft || document.body.scrollLeft;
    }

    function scrollFixed(options){

        if(this.constructor !== scrollFixed){
            return new scrollFixed(options);
        }
            
        var defaults = {
            target : "",
            top : 10,
            left : 20
        };

        options = $.extend(defaults, options);

        ie6fixList.push(options);
        if (ie6fixList.length == 1){
            if (ie6){
                setInterval(timerFun,400);
            } else {
                setInterval(timerFun1,50);
            }
        }

    }

    function timerFun(){
        var h = getVisibleSize().height,
            s = getScrollTop();
        for(var i = 0 ; i < ie6fixList.length; i++){
            if (getScrollTop() > ie6fixList[i].top){
                ie6fixList[i].target.css({
                    "position" : "absolute"
                });
                ie6fixList[i].target.stop().animate({
                    top : getScrollTop()
                }, 300);
            } else {
                ie6fixList[i].target.css({
                    "position" : "static"
                })
            }
        }

    }
    function timerFun1(){
        var h = getVisibleSize().height,
            s = getScrollTop();

        for(var i = 0 ; i < ie6fixList.length; i++){
            if (getScrollTop() > ie6fixList[i].top){
                ie6fixList[i].target.css({
                    "position" : "fixed",
                    "top" : 0
                });

            } else {
                ie6fixList[i].target.css({
                    "position" : "static"
                })
            }
        }
    }

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = scrollFixed;
    }else{
        exports.scrollFixed = scrollFixed;
    }

}));