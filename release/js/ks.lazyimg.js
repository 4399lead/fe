/**
 * @description    : 图片延时加载组件 ue.lazyimg
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-21 created by czonechan
 * @parameter      :
 */

define(function(require,exports,module){
    function windowHeight(){
        return window.innerHeight || document.documentElement.clientHeight;
    }

    function scrollTop(){
        return document.body.scrollTop || document.documentElement.scrollTop;
    }

    var lazyimg = function(options){
        options = $.extend({}, {
            target : '',
            type : ''
        },options);
        this._timer = null;
        this.init(options);
    };


    var loadCount = 0;
    var scrollImgs = [];

    lazyimg.prototype = {
        init : function(options){
            var imgs = options.target.find('img[data-src]');
            var that = this;

            if(options.type === 'scroll'){
                scrollImgs = imgs;
                that.loadByScroll();
                $(window).unbind("scroll.lazyImg resize.lazyImg").bind("scroll.lazyImg resize.lazyImg", function(){
                    that._timer = setTimeout(function(){that.loadByScroll()},200);
                })
            } else {
                that.load(imgs);
            }
        },

        load : function(imgs){
            var img;
            for( var i = 0, len = imgs.length; i < len; i++ ){
                img = $(imgs[i]);
                if (!!img.attr('data-src')){
                    img.attr("src", img.attr('data-src')).removeAttr("data-src");
                }
            }
        },

        loadByScroll : function(){
            var img;
            var that = this;
            for( var i = 0, len = scrollImgs.length; i < len; i++ ){
                img = $(scrollImgs[i]);
                if (windowHeight() + scrollTop() >= img.offset().top){
                    if (!!img.attr('data-src')){
                        loadCount++;
                        img.attr("src", img.attr('data-src')).removeAttr("data-src");
                    }
                }
            }

            if (loadCount == scrollImgs.length){
                clearTimeout(that._timer);
                $(window).unbind("scroll.lazyImg resize.lazyImg");
            }
        }
    }
    module.exports  = lazyimg;
});
