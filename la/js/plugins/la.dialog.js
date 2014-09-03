
;(function(){
	function dialog(options){
		var defaults = {
			id : "",
			theme : "",
			transition : "ctl-popup",
			content : "",
			afterRender : function(){},
			afterClose : function(){}
		};

		this.options = $.extend(defaults, options);
		this.init();
	}

	dialog.prototype = {
		init : function(){
			var _this = this,
				options = this.options,
				$dialog,
				$dialog_content;

			var tmpl = '\
				<div class="la-dialog la-mask" id="' + options.id + '">\
	                <div class="dialog ' + options.theme + '">' + options.content + '</div>\
	            </div>\
	        ';

			if ($("#" + _this.options.id).length > 0){
				$("#" + _this.options.id).html('<div class="dialog ' + options.theme + '">' + options.content + '</div>');
			} else {
				$("body").append(tmpl);
			}

			_this.obj = $dialog = $("#" + _this.options.id);
			$dialog_content = $dialog.find(".dialog");

			$dialog_content.css({
				"top" : "50%",
				"margin-top" : -$dialog_content.height() / 2
			})

			setTimeout(function(){
				$dialog_content.addClass(options.transition);
				setTimeout(function(){
					$dialog.addClass("ctl-show");
					
					options.afterRender.call(_this);
				}, 50);
			}, 0);

						$dialog.find(".btn-close").bind("click", function(){
				_this.close();
				return false;
			});
		},

		close : function(){
			var _this = this,
				options = this.options;

			_this.obj.removeClass("ctl-show");
			options.afterClose.call(_this);
		}
	}

	window.La = window.La || {};
	La.dialog = dialog;
})();