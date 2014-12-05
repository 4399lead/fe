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

		function ctor(options){
			var that = this;

			if(that.constructor !== ctor){
				return new ctor(options);
			}

			var defaults = {
				target : "",//[string:selector] 外层容器
				list : "",//[string:selector] 滚动对象,一般为ul
				items : "", //[string:selector] 滚动的项
				itemActive: "active",//[string:classname] 当前滚动项的classname

				prev : "",//[string:selector] 上一页按钮
				next : "",//[string:selector] 下一页按钮
				prevDisabled : "",//[string:classname] 上一页按钮不可用状态的classname
				nextDisabled : "",//[string:classname] 下一页按钮不可用状态的classname

				thumbnails : "",//[string:selector] 缩略图
				thumbnailActive : "active",//[string:classname] 缩略图当前项的classname
            	trigger : "click",//[string:click|mouseover] 缩略图触发切换的事件类型

				delay : 3000,//[int] 切换间隔时间
				speed : 600,//[int] 切换速度

				autoplay : true,//[bool] 自动滚动
				loop : false,//[bool] 是否循环

				beforeSlide : function(){},//[function] 切换前回调函数
				afterSlide : function(){},//[function] 切换后回调函数

				mode : ctor.HORIZONTAL//[enum:slideCarousel.HORIZONTAL|slideCarousel.VERTICAL] 水平或者垂直
			}
				
			options = that.options = $.extend(defaults, options);
			that.target = $(options.target);
			that.list = $(options.list);
			that.items = $(options.items);
			that.thumbnails = $(options.thumbnails);
			that.prev = $(options.prev);
			that.next = $(options.next);

			if(options.mode == ctor.HORIZONTAL){
				that.delta =  that.items.outerWidth(true);
				that.offset = that.items.length * that.delta;

				that.list.css({
					"width" : that.offset
				});

			} else {
				that.delta = that.items.outerHeight(true);
				that.offset = that.items.length * that.delta;
			}

			that.active = 0;

			checkBtn.call(that);

			bind.call(that);
			that.start();
		}
		
		function bind(){
			var options = this.options,
				that = this;
			
			that.target.add(that.prev).add(that.next).add(that.thumbnails).bind("mouseover mouseout", function(evt){
				handleHover.call(that, evt);	
			});

			that.prev.bind("click", function(e){
				e.preventDefault();

				that.scroll(that.active - 1);
			});

			that.next.bind("click", function(e){
				e.preventDefault();

				that.scroll(that.active + 1);
			});

			that.thumbnails.bind(options.trigger, function(e){
				var index = $(this).index();

				that.scroll(index);

				if(options.trigger == "click"){
					e.preventDefault();
				}
			});
		}

		function checkBtn(){
			var that = this,
				options = that.options;

			if(options.loop){
				return;
			}

			if(that.active == 0){
				that.prev.addClass(options.prevDisabled);
			} else{
				that.prev.removeClass(options.prevDisabled);
			}

			if(that.active == that.items.length - 1){
				that.next.addClass(options.nextDisabled);
			} else{
				that.next.removeClass(options.nextDisabled);
			}
		}

		function handleHover(evt){
			var that = this;
			
			if (evt.type == "mouseover"){
				that.stop();
			} else if (evt.type == "mouseout"){
				that.start();
			}
		}

		ctor.prototype = {
			constructor : ctor,

			scroll : function(next){
				var that = this,
					options = this.options,
					move_key,
					animate_style;

				if(next >= that.items.length){
					if(options.loop){
						next = 0;
					} else {
						next = that.items.length - 1;
					}
				}

				if(next < 0){
					if(options.loop){
						next = that.items.length - 1;
					} else {
						next = 0;
					}
				}

				if(next == that.active){
					return;
				}

				if(options.mode == ctor.HORIZONTAL){
					move_key = "margin-left";
				} else {
					move_key = "margin-top";
				}

				animate_style = {};
				animate_style[move_key] = -that.delta * next;

				options.beforeSlide.call(that);
				that.active = next;

				that.items.eq(next).siblings().removeClass(options.itemActive);  
				that.thumbnails.eq(next).addClass(options.thumbnailActive).siblings().removeClass(options.thumbnailActive);
				checkBtn.call(that);
				that.list.stop({gotoEnd : true}).animate(animate_style, options.speed, function(){
					that.items.eq(next).addClass(options.itemActive);
					checkBtn.call(that);
					options.afterSlide.call(that);
				});
			},

			stop : function(){
				clearInterval(this.timer);
			},
			
			start : function(){
				var options = this.options,
					that = this;

				that.stop();

				if( options.autoplay ){
					that.timer = setInterval(function(){
						that.scroll(that.active + 1);
					}, options.delay + options.speed);
				}
			}
		}

		//1表示竖直方向滚动 0表示水平方向滚动
		ctor.H = ctor.HORIZONTAL = 0;
		ctor.V = ctor.VERTICAL = 1;

		if( {}.toString.call(module) == '[object Object]' ){
	    	module.exports = ctor;
		}else{
			exports.slideCarousel = ctor;
		}
		
}));