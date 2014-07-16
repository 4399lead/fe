/**
 * ks.select.js
 */
define(function(require,exports,module){

    var noop = function(){return true};
    function ctor(options){
        var defaults = {
            target : $(),
            trigger : "click",
            currentClass : "cur",
            activeClass : "",
            selected : $(),
            title : $(),
            list : $(),
            items : $(),
            dividerClass : "divider",
            init : noop,
            onSelected : noop
        };
        this.options = options = $.extend(defaults, options);
        this.init();
    }
    ctor.prototype = {
        init : function(){
            var _this = this,
                options = this.options;
            if (options.trigger == "click"){
                options.title.bind("click", function(){
                    if (options.target.hasClass(options.activeClass)){
                        _this.hide();
                    } else {
                        _this.show();
                    }
                    return false;
                });

                $(document.body).bind("click.select", function(e){
                    if ($(e.target).parents(options.target.selector).length == 0){
                        _this.hide();
                    }
                })
            } else{
                options.title.add(options.list).bind("mouseover", function(){
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
            options.items.bind("click", function(){
                var index = $(this).index(),
                    value = $(this).attr("data-value");

                if ($(this).hasClass(options.dividerClass)) return false;
                value = typeof value === "undefined" ? $(this).text() : value;

                $(this).addClass(options.currentClass).siblings().removeClass(options.currentClass);
                options.selected.html(value);
                return options.onSelected.call(_this, this, index);
            })
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
            options.target.addClass(options.activeClass);
            options.list.show();
            if (!this.is_init){
                options.init.call(this);
                this.is_init = true;
            }
        },
        checkHover : function(){
            if (this.hover){
                this.show();
            } else {
                this.hide();
            }
        }
    };

    module.exports = ctor;
});
