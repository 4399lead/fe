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

				prev : "",//[string:selector] 上一页按钮
				next : "",//[string:selector] 下一页按钮
				prevDisabled : "",//[string:classname] 上一页按钮不可用状态的classname
				nextDisabled : "",//[string:classname] 下一页按钮不可用状态的classname

				delay : 3000,//[int] 切换间隔时间
				speed : 600,//[int] 切换速度
				step : 1,//[int] 滚动步长

				autoplay : true,//[bool] 自动滚动
				loop : false,//[bool] 是否循环

				beforeSlide : function(){},//[function] 切换前回调函数
				afterSlide : function(){},//[function] 切换后回调函数


				direction : ctor.LEFT//[enum:slideNew.LEFT|slideNew.RIGHT|slideNew.UP|slideNew.DOWN] 滚动方向
			}
				
			options = that.options = $.extend(defaults, options);
			that.target = $(options.target);
			that.list = $(options.list);
			that.items = $(options.items);
			that.prev = $(options.prev);
			that.next = $(options.next);

			var target_offset,
				item_offset;

			if(options.direction == ctor.LEFT || options.direction == ctor.RIGHT){
				options.mode = ctor.HORIZONTAL;
			} else {
				options.mode = ctor.VERTICAL;
			}

			if(options.direction == ctor.LEFT || options.direction == ctor.UP){
				options.direction = ctor.PREV;
			} else {
				options.direction = ctor.NEXT;
			}

			if(options.mode == ctor.HORIZONTAL){
				item_offset =  that.items.outerWidth(true);
				that.offset = that.items.length * item_offset;
				target_offset = that.target.width();
			} else {
				item_offset = that.items.outerHeight(true);
				that.offset = that.items.length * item_offset;
				target_offset = that.target.height();
			}
			
			if(that.offset <= target_offset){
				return that;
			}

			if(options.step > that.items.length){
				throw new Error('步子迈太大，容易扯到蛋，请减小step的值');
			}

			that.target_offset = target_offset;
			that.delta = item_offset;

			var clone_times = 1;

			if(options.loop){
				var prevCloneItems = that.items.clone(true);
				var nextCloneItems = that.items.clone(true);

				that.list.append(prevCloneItems).append(nextCloneItems);
				that.items = that.list.find(options.items);

				clone_times = 3;
			}
			
			//水平方向
			if(options.mode == ctor.HORIZONTAL){
				that.list.css({
					"width" : that.offset * clone_times
				});
			}

			that.position = 0;

			!options.loop && that.checkBtn();
			that.bind();
			that.start();
		}
		
		ctor.prototype = {
			constructor : ctor,

			bind : function(){
				var options = this.options,
					that = this;
				
				that.target.add(that.prev).add(that.next).bind("mouseover mouseout", function(evt){
					that.handleHover(evt);	
				});

				that.prev.bind("click", function(e){
					e.preventDefault();

					if(!options.loop && !that.available.prev){
						return;
					}

					that.scroll(ctor.PREV, options.step);
				});

				that.next.bind("click", function(e){
					e.preventDefault();

					if(!options.loop && !that.available.next){
						return;
					}

					that.scroll(ctor.NEXT, options.step);
				});
			},
			
			scroll : function(direction, step){
				var that = this,
					options = this.options,
					delta = that.delta * step,
					prev,
					next,
					available,
					move_key,
					animate_style;

				prev = that.position;

				if(options.mode == ctor.HORIZONTAL){
					move_key = "margin-left";
				} else {
					move_key = "margin-top";
				}

				if (direction == ctor.PREV){

					if(options.loop){
						next = prev + delta;

						if(next > 0){
							next -= that.offset;
							that.list.css(move_key, prev - that.offset);
						}
					} else {
						available = Math.floor(-prev / that.delta);

						if(available < step){
							next = prev + available * that.delta;
						} else {
							next = prev + delta;
						}
					}

					!options.loop && that.checkBtn(options.step, -options.step);

					animate_style = {};
					animate_style[move_key] = next;
					that.position = next;
					options.beforeSlide.call(that);
					that.list.stop({gotoEnd : true}).animate(animate_style, options.speed, function(){
						options.afterSlide.call(that);
					});
					
				} else if(direction == ctor.NEXT){
					if(options.loop){
						if(prev < -that.offset){
							prev += that.offset;

							that.list.css(move_key, prev);
						}

						next = prev - delta;
					} else {
						available = Math.floor((that.offset - that.target_offset + prev) / that.delta);
						
						if(available < step){
							next = prev - available * that.delta;
						} else {
							next = prev - delta;
						}
					}

					!options.loop && that.checkBtn(-options.step, options.step);

					animate_style = {};
					animate_style[move_key] = next;
					that.position = next;
					options.beforeSlide.call(that);
					that.list.stop({gotoEnd : true}).animate(animate_style, options.speed, function(){
						options.afterSlide.call(that);
					})
				}
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
						that.scroll(options.direction, options.step);
					}, options.delay + options.speed);
				}
			},
			
			handleHover : function(evt){
				var that = this;
				
				if (evt.type == "mouseover"){
					that.stop();
				} else if (evt.type == "mouseout"){
					that.start();
				}
			},

			getAvailable : function(p_available, n_available){
				var options = this.options,
					that = this,
					prev_available,
					next_available,
					prev;

				p_available = p_available || 0;
				n_available = n_available || 0;

				prev = that.position;

				prev_available = Math.floor(-prev / that.delta);
				next_available = Math.floor((that.offset - that.target_offset + prev) / that.delta);

				var result = {};

				if(prev_available > p_available){
					result.prev = true;
				} else{
					result.prev = false;
				}

				if(next_available > n_available){
					result.next = true;
				} else{
					result.next = false;
				}

				return result;
			},

			checkBtn : function(p_available, n_available){
				var that = this,
					options = that.options;

				var available = that.getAvailable(p_available, n_available)

				if(available.prev){
					that.prev.removeClass(options.prev_disabled);
				} else{
					that.prev.addClass(options.prev_disabled);
				}

				if(available.next){
					that.next.removeClass(options.next_disabled);
				} else{
					that.next.addClass(options.next_disabled);
				}

				that.available = available;
			}
		}
		
		ctor.P = ctor.PREV = -1;
		ctor.N = ctor.NEXT = 1;

		ctor.U = ctor.UP = 1;
		ctor.R = ctor.RIGHT = 2;
		ctor.D = ctor.DOWN = 3;
		ctor.L = ctor.LEFT = 4;

		//1表示竖直方向滚动 0表示水平方向滚动
		ctor.H = ctor.HORIZONTAL = 0;
		ctor.V = ctor.VERTICAL = 1;

		if( {}.toString.call(module) == '[object Object]' ){
	    	module.exports = ctor;
		}else{
			exports.slideNew = ctor;
		}
		
}));