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
				target : "",//[string:selector] 滚动对象,一般为ul
				items : "", //[string:selector] 滚动的项
				speed : 1,//[int:px] 滚动速度
				direction : ctor.LEFT//[enum:marqueeNew.LEFT|marqueeNew.RIGHT|marqueeNew.UP|marqueeNew.DOWN] 滚动方向
			}
				
			options = that.options = $.extend(defaults, options);
			that.target = $(options.target);
			that.items = $(options.items);

			if(options.mode == ctor.HORIZONTAL){
				that.offset = that.items.length * that.items.outerWidth(true);
			} else {
				that.offset = that.items.length * that.items.outerHeight(true);
			}

			if(that.offset <= that.target.width()){
				return that;
			}

			that.items.clone(true).appendTo(that.target);
			that.items = $(options.items);

			if(options.direction == ctor.LEFT || options.direction == ctor.RIGHT){
				options.mode = ctor.HORIZONTAL;
			} else {
				options.mode = ctor.VERTICAL;
			}
			//水平方向
			if(options.mode == ctor.HORIZONTAL){
				that.target.css({
					"width" : that.offset * 2
				});
			} else {

				//解决ie67 设置marqueetop 无效的bug
				that.target.css({
					"overflow" : "hidden",
					"zoom" : 1
				});
			}

			if(options.direction == ctor.RIGHT){
				that.target.css("margin-left", -that.offset);
			} else if(options.direction == ctor.DOWN){
				that.target.css("margin-top", -that.offset);
			}

			that.bind();
			that.start();
		}
		
		ctor.prototype = {
			constructor : ctor,

			bind : function(){
				var options = this.options,
					that = this;
				
				that.target.bind("mouseover mouseout", function(evt){
					that.handleHover(evt);	
				});
			},
			
			scroll : function(){
				var that = this,
					options = this.options,
					direction = options.direction,
					prev,
					next;
				
				if (direction == ctor.RIGHT){//往后面滚动
					prev = parseInt( that.target.css("margin-left") );
					next = prev + options.speed;

					if(next > 0){
						next -= that.offset;
					}

					that.target.css({
						"margin-left" : next
					})

				} else if(direction == ctor.LEFT){//向前面滚动
					prev = parseInt( that.target.css("margin-left") );
					next = prev - options.speed;

					if(next < -that.offset){
						next += that.offset;
					}

					that.target.css({
						"margin-left" : next
					})
				} else if(direction == ctor.UP){
					prev = parseInt( that.target.css("margin-top") );
					next = prev - options.speed;

					if(next < -that.offset){
						next += that.offset;
					}


					that.target.css({
						"margin-top" : next
					})
				} else if(direction == ctor.DOWN){
					prev = parseInt( that.target.css("margin-top") );
					next = prev + options.speed;

					if(next > 0){
						next -= that.offset;
					}

					that.target.css({
						"margin-top" : next
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

				that.timer = setInterval(function(){
					that.scroll();
				}, 1000 / 24);
			},
			
			handleHover : function(evt){
				var that = this;
				
				if (evt.type == "mouseover"){
					that.stop();
				} else if (evt.type == "mouseout"){
					that.start();
				}
			}
		}
		
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
			exports.marqueeNew = ctor;
		}
		
}));