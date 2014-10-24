/**
 * @description    : 图片预加载管理组件 ue.imgloader
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-21 created by czonechan
 * @parameter      : 
 * @details        : api http://t2.s.img4399.com/base/js/plugins/ue.imgloader/ hostip 192.168.51.203
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
	var noop = function(){};
	
	function ctor(options){
		if(this.constructor !== ctor){
			return new ctor(options);
		}

		var defaults = {
				list : [],
				start : 0,
				end : 0,
				timeout : 20000,
				onloaded : noop,
				onperloaded : noop,
				ontimeout : noop
			}
		
		if (options.length <= options.end) options.end = options.length - 1;
		this.options = options = $.extend(defaults, options);
		this.init();
	}
	
	ctor.prototype = {
		constructor : ctor,

		init : function(){
			var _this = this,
				loaded_count = 0
				options = this.options;
			
			for (var i = options.start; i <= options.end; i++){

				if (options.list[i].status == "loading"){
					if (new Date() - options.list[i].starttime < options.timeout){
						continue;
					} else {
						options.list[i].status = "ready";
					}
				}
				
				if (options.list[i].status == "loaded"){
					options.onperloaded.call(_this, i );
					continue;
				}
				
				options.list[i].status = "loading";
				options.list[i].starttime = new Date();
				
				imgReady(options.list[i].src, noop, (function(i){
					return function(){
						options.list[i].status = "loaded";
						options.onperloaded.call(_this, i );
					}
				})(i));
			}	
			
			this.timeout_timer = setTimeout(function(){
				options.ontimeout.call(_this);
			}, options.timeout);
			
			this.loaded_timer = setInterval(function(){
				loaded_count = 0;
				for (var i = options.start; i <= options.end; i++){
					if (options.list[i].status == "loaded"){
						loaded_count++;	
					}
				}
				
				//图片全部加在完成
				if (loaded_count === options.end - options.start + 1){
					clearTimeout(_this.loaded_timer);
					clearTimeout(_this.timeout_timer);
					options.onloaded.call(_this);
				}
			},200);
		}
	}
		
	/**
	 * 图片头数据加载就绪事件 - 更快获取图片尺寸
	 * @version	2011.05.27
	 * @author	TangBin
	 * @see		http://www.planeart.cn/?p=1121
	 * @param	{String}	图片路径
	 * @param	{Function}	尺寸就绪
	 * @param	{Function}	加载完毕 (可选)
	 * @param	{Function}	加载错误 (可选)
	 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 */
	
	var imgReady = (function () {
		var list = [], intervalId = null,
	
		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
	
		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
	
		return function (url, ready, load, error) {
			var onready, width, height, newWidth, newHeight,
				img = new Image();
			
			img.src = url;
			
			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
			
			width = img.width;
			height = img.height;
			
			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
			
			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// 如果图片已经在其他地方加载可使用面积检测
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready();
			
			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();
			
				load && load.call(img);
				
				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};
	
			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})();

	if( {}.toString.call(module) == '[object Object]' ){
    	module.exports = ctor;
	}else{
		exports.imgloader =  ctor;
	}
		
}));