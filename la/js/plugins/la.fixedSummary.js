//滚动固定标题
;(function(){
    function fixedSummary(options){
        var defaults = {
            fixed : ".j-fixed_summary",
            summary : ".j-summary",
            top : 44
        }

        this.options = $.extend(defaults, options);
        this.init();
        fixedSummary.list.push(this);
    };

    fixedSummary.prototype = {
        init : function(){
            var _this = this;

            _this.getSummary();
            _this.bind();
        },

        bind : function(){
            var _this = this,
                options = this.options,
                $fix_summary = $(options.fixed),
                scroll_y,
                first_summary;

            $(window).bind("scroll.fixedSummary", function() {
                scroll_y = window.scrollY;
                first_summary = _this.summarys[0];

                if(scroll_y < first_summary.top - options.top) {
                    $fix_summary.hide();
                    return;
                }

                for(var i = _this.summarys.length - 1; i >= 0; i--) {
                    if(scroll_y >= _this.summarys[i].top - options.top) {
                        $fix_summary.html(_this.summarys[i].obj.html()).show();
                        break;
                    }
                }
            });

            var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
                resize_time;

            window.addEventListener(RESIZE_EV, function(){
                clearTimeout(resize_time);
                resize_time = setTimeout(function(){
                    for(var i = 0; i < fixedSummary.list.length; i++){
                        fixedSummary.list[i].getSummary();
                    }
                }, 500);
            });
        },

        getSummary: function() {
            var _this = this,
                options = this.options,
                $summarys = $(options.summary);

            _this.summarys = [];
            $summarys.each(function() {
                _this.summarys.push({obj: $(this), top: $(this).offset().top});
            });
        }
    }

    fixedSummary.list = [];

    window.La = window.La || {};
    La.fixedSummary = fixedSummary;
})();