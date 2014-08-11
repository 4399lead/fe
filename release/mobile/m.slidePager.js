var Mo = Mo || {};
(function(){
    Mo.slidePager = function (options){
        var defaults = {
            speed : 400,
            default_page : 1,
            pager_item_cur : "cur",
            setPageContent : function(direction){}
        };

        this.options = $.extend(defaults, options);
        this.init();
        Mo.slidePager.list.push(this);
    }

    Mo.slidePager.prototype = {
        init : function(){
            var _this = this,
                options = this.options;
            
            _this.v_width = window.innerWidth || document.documentElement.clientWidth;
            
            if(!options.width){
                _this.width = _this.v_width;
            }

            _this.is_animating = false;

            _this.page_target = $(options.page_target);

            _this.cur_page = $(options.page_item);
            _this.prev_page = _this.cur_page.clone().html('');
            _this.next_page = _this.cur_page.clone().html('');
            _this.pages = _this.prev_page.add(_this.cur_page).add(_this.next_page);

            _this.page_target.css({
                width : _this.width,
                position : "relative"
            });

            _this.pages.css({
                width : _this.width,
                height : "100%"
            });

            _this.prev_page.css({
                position : "absolute",
                left : -_this.width,
                display : "block",
                top : 0
            });

            _this.next_page.css({
                position : "absolute",
                left : _this.width,
                top : 0,
                display : "block"  
            });

            _this.page_target.prepend(_this.prev_page);
            _this.page_target.append(_this.next_page);

            //分页
            _this.pager_target = $(options.pager_target);
            _this.pager_item = $(options.pager_item);

            _this.page_num = options.default_page;
            _this.pager_item.eq(_this.page_num - 1).addClass(options.pager_item_cur);
            _this.page_count = _this.pager_item.length;

            _this.options.setPageContent.call(_this, _this.page_num - 1, _this.prev_page);
            _this.options.setPageContent.call(_this, _this.page_num + 1, _this.next_page);

            //分页总宽度
            _this.pager_width = 0;
            _this.pager_item.each(function(){
                _this.pager_width += $(this).offset().width + parseInt($(this).css("margin-left") || 0) + parseInt($(this).css("margin-right") || 0);
            });

            _this.pager_target.width(_this.pager_width);

            _this.bind();
        },

        bind : function(){
            var _this = this,
                options = this.options;

            (function(){

                var is_touch_start = false;
                var start_x, end_x, start_y, end_y, margin_left;
                var direction;
                var delta_x = 0;
                var is_end = false;

                _this.page_target.unbind("touchstart").bind("touchstart", function(e){
                    var $this = $(this);

                    if (is_touch_start || _this.is_animating){

                        return false;
                    }

                    is_touch_start = true;
                    margin_left = parseInt(_this.page_target.css("margin-left"));
                    start_x = e.changedTouches[0].clientX;
                    start_y = e.changedTouches[0].clientY;
                    delta_x = 0;
                }).unbind("touchmove").bind("touchmove", function(e){
                    var $this = $(this);
                    if (!is_touch_start){
                        return false;
                    }

                    end_x = e.changedTouches[0].clientX;
                    end_y = e.changedTouches[0].clientY;
                    delta_x = end_x - start_x;

                    if (Math.abs(delta_x) > 20 ){
                        e.preventDefault();
                    }

                    direction = delta_x > 0 ? -1 : 1;

                    is_end = (_this.page_num == 1 && direction < 0) || (_this.page_num == _this.page_count && direction > 0);

                    var _margin_left = delta_x + margin_left;

                    if(is_end){
                        (_margin_left > _this.v_width * 2 / 3) && (_margin_left = _this.v_width * 2 / 3);
                        (_margin_left < -_this.v_width * 2 / 3) && (_margin_left = -_this.v_width * 2 / 3);
                    } else {
                        (_margin_left > _this.v_width) && (_margin_left = _this.v_width);
                        (_margin_left < -_this.v_width) && (_margin_left = -_this.v_width);
                    }
                    
                    _this.page_target.css({
                        "margin-left" : _margin_left
                    });
                }).unbind("touchend").bind("touchend", function(e){
                    if (!is_touch_start || _this.is_animating){
                        return false;
                    }

                    is_touch_start = false;
                    setTimeout(function(){
                        if (!is_end && Math.abs(delta_x) > _this.width / 3){
                            _this.is_animating = true;

                            var next_page = _this.page_num + direction;

                            if(next_page > _this.page_count){
                                next_page = _this.page_count;
                            }

                            if(next_page < 1){
                                next_page = 1;
                            }

                            _this.page_num = next_page;
                            _this.scrollToPager(next_page);

                            _this.page_target.animate({
                                "margin-left" : -_this.width * direction
                            }, options.speed, 'linear', function(){
                                
                                _this.afterScrollPage(direction);
                            });
                        } else {
                            _this.is_animating = true;

                            _this.page_target.animate({
                                "margin-left" : 0
                            }, 200, 'linear', function(){
                                _this.is_animating = false;
                            });
                        }

                    },0);
                });
            })();

            (function(){

                var is_touch_start = false;
                var start_x, end_x, start_y, end_y, margin_left;
                var direction;
                var delta_x = 0;
                var is_end = false;

                _this.pager_target.unbind("touchstart").bind("touchstart", function(e){
                    var $this = $(this);

                    if (is_touch_start || _this.is_animating){
                        return false;
                    }

                    is_touch_start = true;
                    margin_left = parseInt(_this.pager_target.css("margin-left"));
                    start_x = e.changedTouches[0].clientX;
                    start_y = e.changedTouches[0].clientY;
                }).unbind("touchmove").bind("touchmove", function(e){
                    var $this = $(this);
                    if (!is_touch_start){
                        return false;
                    }

                    
                    end_x = e.changedTouches[0].clientX;
                    end_y = e.changedTouches[0].clientY;
                    delta_x = end_x - start_x;

                    if (Math.abs(delta_x) > 20 ){
                        e.preventDefault();
                    }

                    var _margin_left = delta_x + margin_left;

                    (_margin_left < -_this.pager_width + _this.v_width) && (_margin_left = -_this.pager_width + _this.v_width);
                    (_margin_left > 0) && (_margin_left = 0);
                    
                    _this.pager_target.css({
                        "margin-left" : _margin_left
                    });

                }).unbind("touchend").bind("touchend", function(e){
                    is_touch_start = false;
                });
            })();

            _this.pager_item.unbind("click").bind("click", function(e){
                var index = $(this).index();

                if( (index + 1) == _this.page_num){
                    return false;
                }

                _this.scrollToPage(index + 1);
                return false;
            });
        },

        scrollToPage : function(page){
            var _this = this,
                options = this.options;

            if(page >= 1 && page<= _this.page_count && page != _this.page_num){
                _this.is_animating = true;
                direction = page > _this.page_num ? 1 : -1;

                _this.page_num = page;
                
                
                if(direction > 0){
                    _this.options.setPageContent.call(_this, _this.page_num, _this.next_page);
                } else {
                    _this.options.setPageContent.call(_this, _this.page_num, _this.prev_page);
                }
                

                _this.page_target.animate({
                    "margin-left" : -_this.width * direction
                }, options.speed, 'linear', function(){
                    _this.afterScrollPage(direction);
                });

                _this.scrollToPager(page);
            }
        },

        scrollToPager : function(page){
            var _this = this,
                options = this.options;

            var offset = _this.pager_item.eq(page - 1).offset();
            var _margin_left = -offset.left + parseInt(_this.pager_target.css("margin-left"));

            _margin_left = _this.v_width / 2 + _margin_left - offset.width / 2;

            (_margin_left < -_this.pager_width + _this.v_width) && (_margin_left = -_this.pager_width + _this.v_width);
            (_margin_left > 0) && (_margin_left = 0);

            _this.pager_target.animate({
                "margin-left" : _margin_left
            }, options.speed, 'linear', function(){

            });
        },

        afterScrollPage : function(direction){
            var _this = this,
                options = this.options;
                
            _this.page_target.css({
                "margin-left" : 0
            });

            var tmp_page = _this.cur_page;

            if(direction > 0){
                _this.page_target.append(_this.prev_page);
                _this.cur_page = _this.next_page;
                _this.next_page = _this.prev_page;
                _this.prev_page = tmp_page;
            } else {
                _this.page_target.prepend(_this.next_page);
                _this.cur_page = _this.prev_page;
                _this.next_page = _this.next_page;
                _this.prev_page = tmp_page;
            }

            _this.options.setPageContent.call(_this, _this.page_num + 1, _this.next_page);
            _this.options.setPageContent.call(_this, _this.page_num - 1, _this.prev_page);

            _this.prev_page.css({
                position : "absolute",
                left : -_this.width,
                top : 0
            });

            _this.cur_page.css({
                position : "static",
                left : 0,
                top : 0
            });

            _this.next_page.css({
                position : "absolute",
                left : _this.width,
                top : 0
            });

            _this.pager_item.removeClass(options.pager_item_cur).eq(_this.page_num - 1).addClass(options.pager_item_cur);

            _this.is_animating = false;
        },

        resize : function(){
            var _this = this,
                options = this.options;

            _this.v_width = window.innerWidth || document.documentElement.clientWidth;
            
            if(!options.width){
                _this.width = _this.v_width;
            }

            _this.page_target.css({
                width : _this.width
            });

            _this.pages.css({
                width : _this.width
            });

            _this.prev_page.css({
                left : -_this.width
            });

            _this.next_page.css({
                left : _this.width 
            });

            _this.scrollToPager(_this.page_num);
        }
    }

    Mo.slidePager.list = [];

    var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        resize_time;

    window.addEventListener(RESIZE_EV, function(){
        clearTimeout(resize_time);
        resize_time = setTimeout(function(){
            for(var i = Mo.slidePager.list.length - 1; i >= 0; i--){
                Mo.slidePager.list[i].resize();
            }
        }, 500);
    });
})();


