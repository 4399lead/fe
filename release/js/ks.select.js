/**
 * ks.select.js
 */
;(function(factory) {
    // CMD/SeaJS
    if(typeof define === "function") {
        define(['ks.scrollbar'], factory);
    }
    // No module loader
    else {
        factory('', window['ue'] = window['ue'] || {}, '');
    }

}(function(require, exports, module) {

	var scrollbar;

    if(typeof require === 'function'){
        scrollbar = require("ks.scrollbar");
    } else {
        scrollbar = ue.scrollbar;
    }

    var noop = function(){return true};

    function ctor(options){

        if(this.constructor !== ctor){
            return new ctor(options);
        }

        var defaults = {
            target : $(),
            trigger : "click",
            currentClass : "cur",
			defaultClass : "ue-select",
            activeClass : "",
            selected : $(),
            title : $(),
            list : $(),
            items : $(),
			content : $(),
			scrollbar : null,
            dividerClass : "divider",
			onSelected : noop,
            init : noop,
			onChanged : noop,
			onFirstShow : noop,//第一次显示时回调函数
			onShow : noop//每次显示时回调函数，第一次显示在onFirstShow回调后面执行
		}
		
		this.options = options = $.extend(defaults, options);
		$(options.target).data("data-select",this);
        this.init();
    }

    ctor.prototype = {
        constructor : ctor,

        init : function(){
            var _this = this,
                options = this.options;
            if (options.trigger == "click"){
				options.title.unbind("click.select").bind("click.select", function(){
                    if (options.target.hasClass(options.activeClass)){
                        _this.hide();
                    } else {
                        _this.show();
                    }
                    return false;
                });

				$(document.body).unbind("click.select").bind("click.select", function(e){
					if ($(e.target).parents(options.defaultSelector).length == 0){
						$(options.defaultSelector).each(function(){
							var data = $(this).data("data-select");
							if(data){
								 data.hide();
							}
						});
					}
				})
            } else{
				options.title.add(options.list).unbind("mouseover").bind("mouseover", function(){
                    _this.hover = true;

                    setTimeout(function(){
                        _this.checkHover();
                    },150);

                }).bind("mouseout", function(){
                        _this.hover = false;

                        setTimeout(function(){
                            _this.checkHover();
                        },150);
                    });
            }

            options.target.addClass(options.defaultClass);
            options.defaultSelector = '.' + options.defaultClass;
			_this.bindList();
			options.init.call(this);
		},
		
		bindList : function(){
			var _this = this,
				options = this.options;

			$(options.items.selector).unbind("click.select").bind("click.select", function(){
				var index = $(this).index(),
					value = $(this).attr("data-value");

				if ($(this).hasClass(options.dividerClass)) return false;
				value = typeof value === "undefined" ? $(this).text() : value;
				
				$(this).addClass(options.currentClass).siblings().removeClass(options.currentClass);

				options.selected.html(value);

				if(_this.selected != this){
					options.onChanged.call(_this, this, index);
				}

				_this.selected = this;
				return options.onSelected.call(_this, this, index);
			});
		},

		hide : function(){
			var _this = this,
				options = this.options;
				
			options.target.removeClass(options.activeClass);
			options.list.hide();
		},
		
		show : function(){
			var _this = this,
				options = this.options;
			
			$(options.defaultSelector).each(function(){
				var data = $(this).data("data-select");
				if(data){
					 data.hide();
				}
			});

			options.target.addClass(options.activeClass);
			options.list.show();

			var content_height = options.content.outerHeight();
			if(content_height > options.maxHeight){
				options.list.height(options.maxHeight);
			} else {
				options.list.height(content_height);
			}

			
			if(!_this._isfirstshow){
				options.onFirstShow.call(this);
				_this._isfirstshow = true;

				if(options.scrollbar){
					if(typeof scrollbar === "function"){
						_this.scrollbar = new scrollbar({
							height : options.maxHeight,
							scroll_per : options.scrollbar.scroll_per,//每次滚动滑轮，滚动条移动10像素
							scrollbarbg : options.scrollbar.scrollbarbg,
							target : options.list,
							box : options.content,
							scrollbar : options.scrollbar.scrollbar,
							btn : options.scrollbar.btn
						});
					} else {
						throw new Error('please loaded the ue.scrollbar first');
					}
				}
				
			} else {
				_this.scrollbar && _this.scrollbar.reset();
			}
			
			options.onShow.call(this);
			_this.bindList();
		},
		
		checkHover : function(){
			if (this.hover){
				this.show();
			} else {
				this.hide();
			}
		},

		reset : function(){
			var _this = this,
				options = this.options;

			_this.selected = null;
			//console.log("reset");
			_this.scrollbar && _this.scrollbar.scrollTo(0, false);
			options.selected.html("请选择");
		}
    };

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = ctor;
    }else{
        exports.select = ctor;
    }
    
}));
