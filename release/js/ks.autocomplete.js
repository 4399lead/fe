/**
 * 自动完成组件
 * @class    ks.autoComplete
 * @requires   jQuery.1.6.1.js、SeaJs
 * @param    options {Object}
 *
 */
define(function (require, exports, module) {
    var noop = function () {
            return true
        },
        KEYCODE = {'37': 'LEFT', '38': 'UP', '39': 'RIGHT', '40': 'DOWN', '13': 'ENTER', '32': 'SPACE'};

    /*
     * 去除html代码
     * @method unescapeHTML
     * @param str {String}
     * @return {String}
     * */
    function unescapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /*
    * @param input  输入框
    * @param target 下拉框
    * @param items  下拉项中选项
    * @param currentClass 下拉框选项选中样式
    * @param handle 控制下拉框显示的回调函数，用于执行匹配与搜索
    * @param onSubmit 点击下拉框或按回车键时的回调函数，第一个参数为当前点击或触发回车键的选项
    * @param errorMode 错误回调函数
    * */
    function AutoComplete(options) {
        var defaults = {
            form : "",
            input: "",
            target: "",
            items: "",
            currentClass: "cur",
            auto: true,
            hideonblur: true,
            hideonselect: false,
            placeHolderWord : "搜索游戏",
            blankWord : "请输入关键字",
            handle: noop,
            onSelecting: noop,
            onSubmit: noop,
            errorMode : noop
        };
        this.options = options = $.extend(defaults, options);
        this.init();
    }

    AutoComplete.prototype = {
        /*
         * @method init
         * */
        init: function () {
            var that = this;
            that.last_key_time = new Date();
            that.current = -1;
            that.bind();
        },
        /*
         * @method bind
         * */
        bind: function () {
            var that = this,
                options = that.options;
            $(options.form).bind('submit',function(e){
                that.checkSearch(e);
            });
            $(options.input).bind("focus keydown keypress",function (evt) {
                evt.keyName = KEYCODE[evt.keyCode];
                var len = $(options.items).length;
               if (evt.keyName === 'ENTER') {
                    if (new Date() - that.last_key_time < 300 || evt.type === "keypress") {
                        return false;
                    }
                   that.last_key_time = new Date();
                    if (options.onSubmit.call(that, $(options.items)[that.current]) === false ) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                } else if (evt.keyName === 'UP' && that.open) {
                   if ((evt.type === "keypress" && new Date() - that.last_key_time < 150) || new Date() - that.last_key_time < 200) {
                        return false;
                    }
                   that.last_key_time = new Date();
                    if (len <= 0){
                        return false;
                    }
                    $(options.items).removeClass(options.currentClass);
                   that.current--;
                    if (that.current == -1) {
                        options.auto && $(options.input).val(that._key);
                    } else {
                        if (that.current == -2) {
                            that.current = len - 1;
                        }
                        $(options.items).eq(that.current).addClass(options.currentClass);
                        options.auto && $(options.input).val($(options.items).eq(that.current).attr("data-value"));
                    }
                    options.onSelecting.call(this, that.current);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.keyName === 'DOWN' && that.open) {
                    if ((evt.type === "keypress" && new Date() - that.last_key_time < 150) || new Date() - that.last_key_time < 200) {
                        return false;
                    }
                   that.last_key_time = new Date();
                    if (len <= 0) {
                        return false;
                    }
                    $(options.items).removeClass(options.currentClass);
                   that.current++;
                    if (that.current == len) {
                        options.auto && $(options.input).val(that._key);
                        that.current = -1;
                    } else {
                        if (that.current == -2) {
                            that.current = 0;
                        }
                        $(options.items).eq(that.current).addClass(options.currentClass);
                        options.auto && $(options.input).val($(options.items).eq(that.current).attr("data-value"));
                    }
                    options.onSelecting.call(this, that.current);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                }else if ( evt.type === "focus") {
                    if ($.trim($(this).val()) == options.blankWord || $.trim($(this).val()) == options.placeHolderWord) {
                        $(this).val("");
                        return false;
                    }
                   that.handleSearch();
                }
            }).bind("blur", function () {
                    options.hideonblur && setTimeout(function () {
                        that.hide.call(that)
                    }, 200);
                    if ($.trim($(this).val()) == '') {
                        $(this).val(options.blankWord);
                    }
                });
            //todo:解决中文输入法不触发keyup事件
            var fixChineseInput = "input";
            if( $.browser.msie && $.browser.version < 9.0 ){
                fixChineseInput = "propertychange"
            }
            $(options.input).bind( fixChineseInput,function(){
                that.handleSearch();
            });
        },
        /*
         * @method hide
         * */
        hide: function () {
            var that = this,
                options = that.options;
            that.open = false;
            $(options.target).hide();
        },
        /*
         * @method show
         * @param html {String}
         * */
        show: function (html) {
            var that = this,
                options = that.options;
            that.open = true;
            $(options.target).html(html);
            $(options.items).unbind("click").bind("click", function () {
                options.auto && $(options.input).val($(this).attr("data-value"));
                if (options.hideonselect) {
                    that.hide();
                }
                return options.onSubmit.call(that, this) === false ? false : true;
            });
            $(options.target).show();
        },
        checkSearch : function(e){
            var that = this,
                options = this.options;
            var  v = $.trim($(options.input).val());
            if (v == "" || options.placeHolderWord == v || v == options.blankWord) {
                $(options.input).val(options.blankWord);
                options.errorMode.call(that);
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            return true;
        },
        /*
         * @method handleSearch
         * */
        handleSearch: function () {
            var that = this,
                options = that.options,
                key = unescapeHTML($.trim($(options.input).val()));
            that._key = key;
            that.current = -1;
            options.handle.call(that, key);
        }
    };
    module.exports = AutoComplete;
});
