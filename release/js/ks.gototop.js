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
    var ie6 = $.browser.msie && $.browser.version=="6.0";

    function GotoTop(options){
        if(this.constructor !== GotoTop){
            return new GotoTop(options);
        }
        
        var defaults = {
            target : $(""),
            relative : "",
            scrollTop : 10,
            btn : $(""),
            mini : "mini",
            mini_width : 1024,
            fade : true,
            hide : true,
            speed : 400,
            onscroll : function(){}
        };

        options = $.extend(defaults, options);

        var width = options.target.width(),
            height = options.target.height(),
            $window = $(window),
            relative = options.relative,
            target = options.target,
            left = options.left,
            bottom = options.bottom,
            top = options.top,
            right = options.right,
            min_width = options.relative.width();

        if(typeof left !== "number" && typeof right !== "number"){
            options.left = 10;
        }

        if(typeof top !== "number" && typeof bottom !== "number"){
            options.bottom = 20;
        }

        if (options.btn.length == 0){
            options.btn = target;
        } else{
            options.btn.bind("click", function(){
                $("html,body").animate({"scrollTop" : 0, "scrollY" : 0}, options.speed);
                return false;
            });
        }

        var _this = this;

        var style;
        var min_width_cal;

        if (ie6){
            target.css("position", "absolute");
            var pre_scroll_left = $window.scrollLeft();
            var h = $window.height(),
                s = $window.scrollTop();

            if (typeof top === "number"){
                target.css({"top": (s + top)});
            } else {
                target.css({"top": (h + s - bottom - height)});
            }

            if(typeof left === "number"){
                left = parseInt(left);
                min_width_cal = min_width + (width + left) * 2 + 21;
            } else {
                right = parseInt(right);
                min_width_cal = min_width + (width + right) * 2 + 21;
            }

            $(window).bind("resize.gototop scroll.gototop", function(){
                clearTimeout(_this.scroll_timer);

                _this.scroll_timer = setTimeout(function(){
                    var h = $window.height(),
                        s = $window.scrollTop();

                    if ($window.width() <= options.mini_width){
                        target.addClass(options.mini);
                    } else {
                        target.removeClass(options.mini);
                    }

                    if (typeof top === "number"){
                        target.stop().animate({"top": (s + top)}, 300);
                    } else {
                        target.stop().animate({"top": (h + s - bottom - height)}, 300);
                    }

                    if (s <= options.scrollTop){
                        if(options.fade){
                            options.btn.stop().animate({
                                opacity : 0
                            }, 300, function(){
                                if(options.hide){
                                    options.btn.hide();
                                } else{
                                    options.btn.css("visibility", "hidden");
                                }
                                
                            });
                        } else {
                            if(options.hide){
                                options.btn.hide();
                            } else{
                                options.btn.css("visibility", "hidden");
                            }
                        }
                        
                    } else {
                        if(options.hide){
                            options.btn.stop().css("display", "block");
                        } else{
                            options.btn.stop().css("visibility", "visible");
                        }

                        if(options.fade){
                            options.btn.animate({
                                opacity : 1
                            }, 300);
                        }
                    }

                    if ($window.width() < min_width_cal ){

                        if(typeof left === "number"){
                            target.css({
                                left : "auto",
                                right : left + $window.scrollLeft() - pre_scroll_left,
                                "margin-left" : 0
                            })

                            target.css({right : left})

                            pre_scroll_left = $window.scrollLeft();
                        } else {
                            target.css({
                                left : right + $window.scrollLeft() ,
                                right : "auto",
                                "margin-left" : 0
                            })
                        }

                    } else {

                        if(typeof left === "number"){
                            target.css({
                                left : "50%",
                                "margin-left" : min_width / 2 + left,
                                right : "auto"
                            })

                        } else {
                            target.css({
                                left : "50%",
                                "margin-left" : -(min_width / 2 + width + right),
                                right : "auto"
                            })
                        }
                    }

                    options.onscroll.call(this, $window.scrollTop(), $(document).height() - $window.height() - $window.scrollTop());

                }, 200);
            });
        } else {
            style = {
                "position" : "fixed"
            }

            if (typeof top === "number"){
                style.top = top;
            } else {
                bottom = parseInt(bottom);
                style.bottom = bottom;
            }

            style.left = "50%";

            if(typeof left === "number"){
                left = parseInt(left);
                style["margin-left"] = min_width / 2 + left;
                min_width_cal = min_width + (width + left) * 2 + 21;
            } else {
                right = parseInt(right);
                style["margin-left"] = -(min_width / 2 + right + width);
                min_width_cal = min_width + (width + right) * 2 + 21;
            }

            target.css(style);

            $(window).bind("resize.gototop scroll.gototop", function(e){

                if ($window.width() <= options.mini_width){
                    target.addClass(options.mini);
                } else {
                    target.removeClass(options.mini);
                }

                if ($window.scrollTop() <= options.scrollTop){
                    options.btn.stop().animate({
                        opacity : 0
                    },300, function(){
                        if(options.hide){
                            options.btn.hide();
                        } else{
                             options.btn.css("visibility", "hidden");
                        }
                    });
                } else {
                    if(options.hide){
                        options.btn.stop().css("display", "block");
                    } else{
                        options.btn.stop().css("visibility", "visible");
                    }

                    options.btn.animate({
                        opacity : 1
                    }, 300);
                    
                }

                if ($window.width() < min_width_cal){
                    if(typeof left === "number"){
                        target.css({
                            left : "auto",
                            right : left
                        });
                    } else {
                        target.css({
                            left : right,
                            "margin-left" : "0",
                            right : "auto"
                        });
                    }
                    
                } else {
                    if(typeof left === "number"){
                        target.css({
                            left : "50%",
                            "margin-left" : min_width / 2 + left,
                            right : "auto"
                        })
                    } else {
                        target.css({
                            left : "50%",
                            "margin-left" : -(min_width / 2 + right + width),
                            right : "auto"
                        })
                    }
                }

                options.onscroll.call(this, $window.scrollTop(), $(document).height() - $window.height() - $window.scrollTop());
            });
        }

        $(window).trigger("scroll");
    };

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = GotoTop;
    }else{
        exports.gototop =  GotoTop;
    }  
}));