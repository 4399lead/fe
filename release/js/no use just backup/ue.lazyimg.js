/**
 * @description    : 图片延时加载组件 ue.lazyimg
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-21 created by czonechan
 * @parameter      : 
 * @details        : api http://t2.s.img4399.com/base/js/plugins/ue.lazyimg/ hostip 192.168.51.203
 */
 
!(function($){
	"use strict";
	
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
		
		this.init(options);
	}
	
	
	var loadCount = 0;
	var scrollImgs = [];
	
	lazyimg.prototype = {
		init : function(options){
			var imgs = options.target.find('img[data-src]');
			var _this = this;
			
			if(options.type === 'scroll'){
				//scrollImgs = imgs;
				for( var i = 0, len = imgs.length; i < len; i++ ){
					if ($(imgs[i]).attr("data-src")){
						imgs[i]._offsetTop = $(imgs[i]).offset().top;
						scrollImgs.push(imgs[i]);
					}
            	}
				this.loadByScroll();
				$(window).unbind("scroll.lazyImg resize.lazyImg").bind("scroll.lazyImg resize.lazyImg", function(){
					_this.loadByScroll();
				})
			} else {
				this.load(imgs);
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
			for( var i = 0, len = scrollImgs.length; i < len; i++ ){
				img = $(scrollImgs[i]);
				if (windowHeight() + scrollTop() >= scrollImgs[i]._offsetTop){
					if (!!img.attr('data-src')){
						loadCount++;
						img.attr("src", img.attr('data-src')).removeAttr("data-src");
					}
					
					if (loadCount == scrollImgs.length){
						$(window).unbind("scroll.lazyImg");
					}
				}
            }
		}
	} 
	
	window.ue = window.ue || {};
	
	ue.lazyimg = function(options){
		return new lazyimg(options);
	}
})(jQuery);