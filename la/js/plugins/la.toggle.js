window.La = window.La || {};

La.toggle = function(options){
    var defaults = {
        target : '.j-toggle',
        btn : '.j-btn-toggle',
        showText : "显示详细信息&gt;&gt;",
        hideText : "隐藏详细信息&gt;&gt;",
        line : 8,
        animate : true,
        speed : 300,
        easing : "ease-out"
    };

    this.options = $.extend(defaults, options);
    this.init();
}

La.toggle.prototype = {
    init : function(){
        var _this = this,
        	options = this.options,
            $togbtn = $(options.btn),
            $target = $(options.target);

        $togbtn.each(function(i, v){
            var $text = $target.eq(i),
                $btn = $(this),
                $text_in = $("<div>").html($text.html()),
                height;

            $text.html('');
            $text_in.appendTo($text);
            console.log($text_in);
            height = parseInt($text_in.css("line-height")) * options.line;

            $btn.data("height", height);
            $btn.data("is_show", false);
            $btn.data("index", i);

            if ($text_in.height() > height){
                $btn.show().html(options.showText);
                $text.css({
                    "height" : height,
                    "min-height" : height,
                    "max-height" : 10000,
                    "overflow" : "hidden"
                });
            } else {
                $btn.hide();
            }
        });

        $togbtn.unbind("singleTap").bind("singleTap", function(){
            var $text, $text_in, $btn, height;

            $btn = $(this);
            index = $btn.data("index");
            height = $btn.data("height"),
            is_show = $btn.data("show");

            $text = $target.eq(index);
            $text_in = $text.children().eq(0);

            if (is_show){
                $btn.html(options.showText);
                $text.animate({
                    "height" : height
                }, options.speed, options.easing);
            } else{
                $btn.html(options.hideText);
                $text.animate({
                    "height" : $text_in.height()
                }, options.speed, options.easing);
            }

            $btn.data("show", !is_show);
            
            return false;
        });
    }
}
