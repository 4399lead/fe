
;(function(){
	function dialog(options){
		var defaults = {
			closable : true,
			id : "",
			classname : "",
			title : "",
			content : "",
			afterRender : function(){},
			afterClose : function(){}
		};

		this.options = $.extend(defaults, options);
		this.init();
	}

	dialog.prototype = {
		init : function(){
			var _this = this;

			var height = document.body.offsetHeight,
				v_height = window.innerHeight || document.documentElement.clientHeight;

			height = height > v_height ? height : v_height;

			var tmpl = '\
				<div class="dialog ' + _this.options.classname + '" id="' + _this.options.id + '">\
					<div class="dialog-mask" style="height:' + height + 'px"></div>\
					<div class="dialog-content">\
						<div class="dialog-hd clearfix">\
							<h3 class="dialog-title">' + _this.options.title + '</h3>\
							<a class="dialog-close" href="#" style="display:' + (_this.options.closable ? 'block' : 'none') + ';"></a>\
						</div>\
						<div class="dialog-bd">' + _this.options.content + '</div>\
					</div>\
				</div>';

			if ($("#" + _this.options.id).length > 0){
				_this.obj = $("#" + _this.options.id);
				this.close();
			}

			$("body").append(tmpl);
			
			var $target = $("#" + _this.options.id);
			_this.obj = $target;

			var $content = _this.obj.find(".dialog-content");
			$content.css({
				"top" : window.scrollY + ($(window).height() -  $content.height()) / 2,
				"margin-top" : 0
			});

			_this.options.afterRender.call(_this);

			$target.find(".dialog-close").bind("click", function(){
				_this.close();
				return false;
			});

			$(window).unbind("resize").bind("resize", function(){
				setTimeout(function(){
					var height = document.body.offsetHeight,
						v_height = window.innerHeight || document.documentElement.clientHeight;

					height = height > v_height ? height : v_height;
			
					$('.dialog-mask').height(height);
				}, 100);
			});
		},

		reset : function(){
			var _this = this,
				$target = _this.obj;

			$target.find(".dialog-title").html(_this.options.title);
			$target.find(".dialog-close").css("display", _this.options.closable ? "block" : "none");
			$target.find(".dialog-bd").html(_this.options.content);

			var $content = $target.find(".dialog-content");
			
			$content.css({
				"top" : window.scrollY + ($(window).height() -  $content.height()) / 2,
				"margin-top" : 0
			});

			_this.options.afterRender.call(_this);
		},

		close : function(){
			var _this = this,
				$target = _this.obj;

			$target.remove();
			_this.options.afterClose.call(_this);
		}
	}

	window.La = window.La || {};
	La.dialog = dialog;
})();