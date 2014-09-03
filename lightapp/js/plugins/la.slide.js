;(function(){
    function slide(options){
        var defaults = {
            delay : 5000,
            speed : 200,
            autoplay : true,

            target : "",
            nav_target : "",
            items : "",

            hasTap : true,
            margin : 0,
            width : 0,
            ratio : 0,            
            scrollNum : 1
        };

        this.options = $.extend(defaults, options);
        this.init();
        slide.list.push(this);
    }

    slide.prototype = {
        init : function(){
            var _this = this,
                options = this.options;

            _this.target = $(options.target);
            _this.nav_target = $(options.nav_target);
            _this.items = $(options.items);
            _this.width = options.width;
            _this.full_width = options.width + options.margin;
            _this.ratio = options.ratio;
            _this.scrollNum = options.scrollNum;
            _this.v_width = window.innerWidth || document.documentElement.clientWidth;
            _this.speed = options.speed;
            _this.delay = options.delay;
            _this.autoplay = options.autoplay;

            if(options.width <= 0){
                _this.width = _this.v_width;
                _this.full_width = _this.width + options.margin;
                _this.resize = true;
            }

            if(options.scrollNum == "auto"){
                _this.scrollNum = Math.floor( _this.v_width / (_this.full_width));
                _this.resize = true;
            }

            _this.prehtml = _this.target.html();
            _this.item_length = _this.items.length;
            _this.cur = _this.item_length;
            _this.real_cur = 0;

            var html = _this.target.html();
            _this.target.append(html + html);
            _this.items = $(options.items);

            _this.items.removeClass("ctl-active").slice(_this.cur, _this.cur + _this.scrollNum).addClass("ctl-active");
            
            if (_this.ratio > 0){
                var height = Math.round(_this.width / _this.ratio);
                _this.items.width(_this.width).height(height).show();
                _this.target.width(_this.items.length * _this.full_width ).height(height);
            } else {
                _this.items.width(_this.width).show();
                _this.target.width(_this.items.length * _this.full_width);
            }

            _this.target.css("margin-left", - _this.item_length * _this.full_width);
            _this.maxMarginLeft = (_this.items.length - 1) * _this.full_width;

            if(_this.scrollNum == 1){
                _this.nav_target.html("");

                for(var i = 0; i < _this.item_length; i++){
                    _this.nav_target.append("<li></li>");
                }

                _this.nav_target.find("li").slice(_this.real_cur, _this.real_cur + _this.scrollNum).addClass("ctl-active");
            } else {
                _this.nav_target.hide();
            }

            _this.bind();
            _this.autoPlay();
        },

        bind : function(){
            var _this = this;

            var is_touch_start = false;
            var start_x, end_x, start_y, end_y, margin_left;

            _this.target.unbind("touchstart").bind("touchstart", function(e){
                var $this = $(this);
                if (is_touch_start) return false;

                is_touch_start = true;
                margin_left = parseInt(_this.target.css("margin-left"));
                start_x = e.changedTouches[0].clientX;
                start_y = e.changedTouches[0].clientY;
                _this.stop();

            }).unbind("touchmove").bind("touchmove", function(e){
                var $this = $(this);
                if (!is_touch_start) return false;

                end_x = e.changedTouches[0].clientX;
                end_y = e.changedTouches[0].clientY;

                var _margin_left = end_x - start_x + margin_left;
                (_margin_left > 0) && (_margin_left = 0);
                (_margin_left < -_this.maxMarginLeft) && (_margin_left = -_this.maxMarginLeft);

                _this.target.css({
                    "margin-left" : _margin_left
                });

                if (Math.abs(end_x - start_x) > 20 ){
                    e.preventDefault();
                }

            }).unbind("touchend").bind("touchend", function(e){
                is_touch_start = false;
                var next = end_x - start_x > 0 ? _this.cur - _this.scrollNum : _this.cur + _this.scrollNum;

                setTimeout(function(){
                    if (next >= 0 && next <  _this.items.length && Math.abs(end_x - start_x) > _this.width / 3){
                         _this.target.animate({
                            "margin-left" : - next *  _this.full_width
                        }, 200, 'linear', function(){
                            if (next > _this.cur){
                                _this.target.append(_this.items.slice(0, _this.scrollNum));
                                
                                if(_this.scrollNum == 1){
                                    _this.real_cur++;
                                    if (_this.real_cur == _this.item_length){
                                        _this.real_cur = 0;
                                    }
                                }
                            } else {
                                var items = $(_this.items.toArray().reverse());
                                _this.target.prepend(items.slice(0, _this.scrollNum));
                                
                                if(_this.scrollNum == 1){
                                    _this.real_cur--;
                                    if (_this.real_cur == -1){
                                        _this.real_cur = _this.item_length - 1;
                                    }
                                }
                            }

                            _this.items = $(_this.options.items);

                            setTimeout(function(){
                                _this.items.removeClass("ctl-active").slice(_this.cur, _this.cur+ _this.scrollNum).addClass("ctl-active");
                                if(_this.scrollNum == 1){
                                    _this.nav_target.find("li").removeClass("ctl-active").eq(_this.real_cur).addClass("ctl-active");
                                }
                                _this.target.css("margin-left", - _this.item_length * _this.full_width);
                                _this.autoPlay();
                            }, 0);
                        });
                    } else {
                        _this.target.animate({
                            "margin-left" : - _this.cur * _this.full_width
                        }, 200, 'linear', function(){
                             _this.autoPlay();
                        });
                    }

                },0);

            });
        },

        stop : function(){
            if (!this.autoplay) return;
            clearInterval(this.autoplaytimer);
        },

        autoPlay : function(){
            var _this = this;

            if (!_this.autoplay) return;
            _this.stop();

            _this.autoplaytimer = setInterval(function(){
                var next = _this.cur + _this.scrollNum;

                _this.target.animate({
                    "margin-left" : -next * _this.full_width
                }, _this.speed, function(){
                    _this.target.append(_this.items.slice(0, _this.scrollNum));
                    
                    setTimeout(function(){              
                        _this.items = $(_this.options.items);

                        _this.real_cur += _this.scrollNum;
                        if (_this.real_cur == _this.item_length){
                            _this.real_cur = 0;
                        }

                        _this.items.removeClass("ctl-active").slice(_this.cur, _this.cur + _this.scrollNum).addClass("ctl-active");

                        if(_this.scrollNum == 1){
                            _this.nav_target.find("li").removeClass("ctl-active").eq(_this.real_cur).addClass("ctl-active");
                        }
                        
                        _this.target.css("margin-left", - _this.item_length * _this.full_width);
                    }, 0);
                });

            }, _this.delay + _this.delay);
        },

        reset : function(){
            var _this = this,
                options = _this.options;

            _this.v_width = window.innerWidth || document.documentElement.clientWidth;

            if(options.width <= 0){
                _this.width = _this.v_width;
            }
            _this.full_width = _this.width + options.margin;
            if(options.scrollNum == "auto"){
                _this.scrollNum = Math.floor( _this.v_width / (_this.full_width));
            }

            if (_this.ratio > 0){
                var height = Math.round(_this.width / _this.ratio);
                _this.items.width(_this.width).height(height).show();
                _this.target.width(_this.items.length * _this.full_width).height(height);
            } else {
                _this.items.width(_this.width).show();
                _this.target.width(_this.items.length * _this.full_width);
            }

            this.maxMarginLeft = (_this.items.length - 1) * _this.full_width;
            _this.target.css({
                "margin-left" : - _this.cur * _this.full_width
            });
        }
    }

    slide.list = [];

    var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        resize_time;

    window.addEventListener(RESIZE_EV, function(){
        clearTimeout(resize_time);
        resize_time = setTimeout(function(){
            for(var i = slide.list.length - 1; i >= 0; i--){
                if(typeof slide.list[i].options.resize === "function"){
                    slide.list[i].resize();
                } else if(slide.list[i].resize === true){
                    slide.list[i].reset();
                }
            }
        }, 500);
    });

    window.LightApp = window.LightApp || {};
    LightApp.slide = slide;
})();


