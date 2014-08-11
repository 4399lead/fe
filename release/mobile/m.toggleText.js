var Mo = Mo || {};

Mo.toggleText = function(options){
	var defaults = {
		target : '.m_introtext',
		btn : 'togbtn',
		text : ".text",
		text_in : ".text_in",
		showText : "显示详细信息&gt;&gt;",
		hideText : "隐藏详细信息&gt;&gt;",
		line : 8,

	};

	this.options = $.extend(defaults, options);
	this.init();
}

Mo.toggleText.prototype = {
	init : function(){
		var options = this.options,
			$togbtn = $(options.btn);

		$togbtn.each(function(){
		    var $text = $(this).parents(options.target).find(options.text),
		        $text_in = $(this).parents(options.target).find(options.text_in),
		        height = parseInt($text_in.css("line-height")) * options.line;

		    $text.data("height", height);

		    if ($text_in.height() > height){
		        $(this).show().html(options.showText);
		        $text.css({
		            "height" : height,
		            "min-height" : height,
		            "max-height" : 10000,
		            "overflow" : "hidden"
		        });
		    } else {
		    	$(this).hide();
		    }
		});

		$togbtn.unbind("singleTap").bind("singleTap", function(){
		    var $text = $(this).parents(options.target).find(options.text),
		        $text_in = $(this).parents(options.target).find(options.text_in),
		        height = $text.data("height");

		    if ($(this).hasClass("show")){
		        $(this).html(options.showText);
		        $text.css("height", height);
		    } else{
		        $(this).html(options.hideText);
		        $text.css("height", $text_in.height());
		    }

		    $(this).toggleClass("show");
		    
		    return false;
		});
	}
}
