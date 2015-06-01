/**
 * @description    : 自动完成狂组件 ue.autocomplete
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-20 created by czonechan
 * @parameter      : 
 * @details        : api http://t2.s.img4399.com/base/js/plugins/ue.autocomplete/ hostip 192.168.51.203
 */
 (function($, window, undefined){
	var noop = function(){return true},
		KEYCODE = {'37' : 'LEFT', '38' : 'UP', '39' : 'RIGHT', '40' : 'DOWN', '13' : 'ENTER', '32' : 'SPACE'};
	
	/*去除html代码*/
	function unescapeHTML(str) {
		return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	
	function ctor(options){
		var defaults = {
			input : "",
			target : "",
			list : "",
			items : "",
			currentClass : "cur",
			auto : true,
			hideonblur : true,
			hideonselect : false,
			handle : noop,
			onSelecting : noop,
			onSubmit : noop
		}
		
		this.options = options = $.extend(defaults, options);
		
		this.init();
	}
	
	ctor.prototype = {
		init : function(){
			var _this = this,
				options = this.options;
			
			this.last_key_time = new Date();
			this.current = -1;
			this.bind();
		},
		
		bind : function(){
			var _this = this,
				options = this.options;
			
			$(options.input).bind("focus keydown keyup keypress", function(evt){
				evt.keyName = KEYCODE[evt.keyCode];
				var len = $(options.items).length;
				
				if (evt.keyName === 'ENTER'){
					if (new Date() - _this.last_key_time < 300 || evt.type === "keypress"){
						return false;
					}
					_this.last_key_time = new Date();
					
					if (options.onSubmit.call(_this, $(options.items)[_this.current]) === false){
						evt.preventDefault();
						evt.stopPropagation();
					}
					
				} else if (evt.keyName === 'UP' && _this.open){
					if ((evt.type === "keypress" && new Date() - _this.last_key_time < 150) || new Date() - _this.last_key_time < 200){
						return false;
					} 
					_this.last_key_time = new Date();
					
					if (len <= 0) return false;
					
					$(options.items).removeClass(options.currentClass);
					_this.current--;
					
					if (_this.current  == -1){
						options.auto && $(options.input).val(_this._key);
					} else {
						if (_this.current  == -2){
							_this.current = len - 1;
						}
						$(options.items).eq(_this.current ).addClass(options.currentClass);
						options.auto &&  $(options.input).val($(options.items).eq(_this.current).attr("data-value"));
					}
					
					options.onSelecting.call(this, _this.current);
					
					evt.preventDefault();
					evt.stopPropagation();
					
					return false;
				} else if (evt.keyName === 'DOWN' && _this.open){
					if ((evt.type === "keypress" && new Date() - _this.last_key_time < 150) || new Date() - _this.last_key_time < 200){
						return false;
					} 
					_this.last_key_time = new Date();
					
					if (len <= 0) return false;
					
					$(options.items).removeClass(options.currentClass);
					_this.current++;
					
					if (_this.current  == len){
						options.auto && $(options.input).val(_this._key);
						_this.current = -1;
					} else {
						if (_this.current  == -2){
							_this.current = 0;
						}
						$(options.items).eq(_this.current ).addClass(options.currentClass);
						options.auto && $(options.input).val($(options.items).eq(_this.current).attr("data-value"));
					}
					
					options.onSelecting.call(this,_this.current);
					
					evt.preventDefault();
					evt.stopPropagation();
					return false;
				} else {
					_this.handleSearch();
				}
			}).bind("blur", function(){
				options.hideonblur && setTimeout(function(){
					_this.hide.call(_this)
				}, 200);
			});
		},
		
		hide : function(){
			var _this = this,
				options = this.options;
			this.open = false;
				
			$(options.target).hide();
		},
		
		show : function(html){
			var _this = this,
				options = this.options;
			
			this.open = true;	
			$(options.list).html(html);
			
			$(options.items).unbind("click").bind("click", function(){
				options.auto &&  $(options.input).val($(this).attr("data-value"));
				if (options.hideonselect){
					_this.hide();
				}
				return options.onSubmit.call(_this, this) === false ? false : true;
			});
			
			$(options.target).show();
		},
		
		handleSearch : function(){
			var _this = this,
				options = this.options,
				key = unescapeHTML($.trim($(options.input).val()));
			
			_this._key = key;
			_this.current = -1;
				
			options.handle.call(this, key);
		}
	}
	
	window.ue = window.ue || {};
	ue.autocomplete = function(options){
		return new ctor(options);
	}
})(jQuery, window);