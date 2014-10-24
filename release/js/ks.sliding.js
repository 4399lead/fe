/**
 * @description    : 无缝滚动
 *
 */
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

    function Sliding(options){
        var defaults = {
            delay : 50,
            speed : 1
        }

        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Sliding.prototype = {
        constructor : Sliding,

        init : function(){
            var _this = this,
                options = _this.options,
                $target = $(options.target),
                $items = $(options.items);


            if($items.length > options.num){
                _this.height = $target.height();
                $target.append($items.clone());
                _this.offsetTop = parseInt($target.css("margin-top") || 0);
                _this.start();

                $target.bind("mouseover", function(){
                    _this.stop();
                }).bind("mouseout", function(){
                        _this.start();
                    });
            }
        },

        start : function(){
            var _this = this,
                options = _this.options,
                $target = $(options.target),
                $items = $(options.items);

            //个数太少不滚动
            if($items.length > options.num){
                clearInterval(_this.timer);
                _this.timer = setInterval(function(){
                    _this.offsetTop -= options.speed;

                    if(_this.height <= Math.abs(_this.offsetTop)){
                        _this.offsetTop = 0;
                    }

                    $target.css({
                        "margin-top" : _this.offsetTop
                    });
                }, options.delay)
            }
        },

        stop : function(){
            var _this = this,
                options = _this.options;

            clearInterval(_this.timer);
        }
    };

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = Sliding;
    }else{
        exports.sliding = Sliding;
    }
    
}));