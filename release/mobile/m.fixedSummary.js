var Mo = Mo || {};

//滚动固定标题
Mo.fixedSummary = function (options){
        var defaults = {
            fixed_summary : ".j-titfixed",
            summary : ".j-titg",
            top : 44
        }

        this.options = $.extend(defaults, options);
        this.init();
    };

Mo.fixedSummary.prototype = {
    init : function(){
        var _this = this,
            options = this.options,
            $fix_summary = $(options.fixed_summary),
            scroll_y,
            first_summary;

        _this.getSummary();

        $(window).bind("scroll", function() {
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
