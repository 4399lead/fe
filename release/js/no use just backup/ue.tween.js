/**
 * @description    : 简易动画组件 ue.tween
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-21 created by czonechan
 * @parameter      : 
 * @details        : api http://t2.s.img4399.com/base/js/plugins/ue.tween/ hostip 192.168.51.203
 */
(function($, window, undefined){
	var loop = 46;
	
	function ctor(delay, type, tx, callback){
		var _this = this;
		this.times = 0;
		this.times_count = Math.floor(delay / loop);
		this.stop = function(){
			clearInterval(_this.timer);
			tx.call(null,1);
			typeof callback === 'function' && callback();
		};
		this.timer = setInterval(function(){
			_this.times++;
			_this.percent = _this.times < _this.times_count ? _this.times / _this.times_count : 1;
			
			tx.call(null,_this[type]());
			
			if (_this.percent == 1){
				clearInterval(_this.timer);
				typeof callback === 'function' && callback();
			}
			
		}, loop);
	}
	
	ctor.prototype = {
		pause : function(){
			clearInterval(this.timer);
		},
		
		'linear' : function(){
			return this.percent;
		},
		
		'easeout' : function(){
			return Math.sin( Math.PI / 2 * this.percent);
		},
		
		'easein' : function(){
			return 1 - Math.cos( Math.PI / 2 * this.percent);
		}
	}
	
	ue = window.ue || {};
	
	ue.tween = function(delay, type, tx, callback){
		return new ctor(delay, type, tx, callback);
	}

})(jQuery, window);