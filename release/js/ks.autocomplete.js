/**
 * 自动完成组件
 * @class    ks.autoComplete
 * @requires   jQuery.1.6.1.js、SeaJs
 * @param    options {Object}
 *
 */
;(function(factory) {
    // CMD/SeaJS
    if(typeof define === "function") {
        define(factory);
    }
    // No module loader
    else {
        factory('', window['ue'] = window['ue'] || {}, '');
    }

}(function(require, exports, module) {
    var noop = function () {
        return true;
    },
        KEYCODE = {
            '37': 'LEFT',
            '38': 'UP',
            '39': 'RIGHT',
            '40': 'DOWN',
            '13': 'ENTER',
            '32': 'SPACE'
        };
 
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
     * @param onSelected 点击下拉项，或者回车下拉项的回调， 参数为 当前选择的节点
     * @param onSelecting 键盘选择下拉项，或者鼠标移动hover 下拉项的回调，参数为 当前选择的节点
     * @param onSubmit 监听表单提交的事件回调
     * @param onError 错误回调函数
     * */
    function AutoComplete(options) {
        if(this.constructor !== AutoComplete){
            return new AutoComplete(options);
        }
        
        var defaults = {
            form : "",
            input: "",
            target: "",
            items: "",
            currentClass: "cur",
            auto: true,
            hideonblur: true,
            hideonselect: false,

            placeholder: "搜索游戏",
            defaultvalue: "请输入关键字",
            
            handle: noop,
            onSelecting: noop,
            onSelected: function(){},
            onSubmit: noop,
            onError : noop
        };
        this.options = options = $.extend(defaults, options);
        this.init();
    }

    AutoComplete.prototype = {
        constructor : AutoComplete,
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
 
            if ($.trim( $(options.input).val() ) !== ""){
                options.defaultvalue = "";
            } else {
                if (options.defaultvalue) {
                    $(options.input).val(options.defaultvalue);
                } else {
                    $(options.input).val(options.placeholder);
                }
            }
 
            $(options.form).bind('submit', function (e) {
                var v = $.trim( $(options.input).val() );
                
                if (v == "" || options.placeholder == v) {

                    $(options.input)[0].focus();

                    if ( options.onError.call(that, "blankError") === false){

                        return false;
                    }

                    $(options.input).val(options.defaultvalue || options.placeholder);
                }

                return (options.onSubmit.call(that, e) === false ? false : true);
            });
            $(options.input).bind("focus keydown keypress",function (evt) {
                evt.keyName = KEYCODE[evt.keyCode];
                var len = $(options.items).length;
                
                if (evt.keyName === 'ENTER') {
                    //选择后直接回车
                    if(that.current !== -1){

                        //阻止多次提交
                        if (new Date() - that.last_key_time < 300 || evt.type === "keypress") {
                            return false;
                        }

                        that.last_key_time = new Date();

                        if($(options.items).eq(that.current).find("a").length == 0){
                            $(options.items).eq(that.current).trigger("click");
                        } else {
                            $(options.items).eq(that.current).find("a")[0].click();//jquery 无法触发a标签的的默认行为
                        }
                        
                        $(options.input).trigger("blur");
                    }
                } else if (evt.keyName === 'UP' && that.open) {
                    
                    if ((evt.type === "keypress" && new Date() - that.last_key_time < 150) || new Date() - that.last_key_time <
                        200) {
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
                    options.onSelecting.call(that, $(options.items).eq(that.current));
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.keyName === 'DOWN' && that.open) {
                    
                    if ((evt.type === "keypress" && new Date() - that.last_key_time < 150) || new Date() - that.last_key_time <
                        200) {
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
                    
                    options.onSelecting.call(that, $(options.items).eq(that.current));

                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;

                } else if (evt.type === "focus") {
                    var val = $(this).val();

                    if ($.trim( val ) == options.defaultvalue || $.trim( val ) == options.placeholder) {
                        $(this).val("");
                        return false;
                    }
                   that.handleSearch();
                }
            }).bind("blur", function () {
 
                options.hideonblur && setTimeout(function () {
                    that.hide.call(that);
                }, 200);
 
                if ($.trim( $(this).val() ) == '') {
                    $(this).val(options.defaultvalue || options.placeholder);
                }
            });
 
            //todo:解决中文输入法不触发keyup事件
            var fixChineseInput = "input";
            if( $.browser.msie && $.browser.version < 9.0 ){
                fixChineseInput = "propertychange"
            }
 
            $(options.input).bind(fixChineseInput, function () {
                var val = $(this).val();

                if ($.trim( val ) != options.defaultvalue && $.trim( val ) != options.placeholder) {
                    that.handleSearch();
                }
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
            
                if (options.hideonselect) {
                    that.hide();
                }
                
                if (options.onSelected.call(that, $(this)) === false){
                    return false;
                } else if(options.onSelected.call(that, $(this)) === true){
                    $(options.input).val( $(this).attr("data-value") );
                    return true;
                }

                $(options.input).val( $(this).attr("data-value") );
                $(options.form).trigger('submit');
            });

            $(options.items).unbind('mouseenter mouseleave').bind('mouseenter', function() {
                $(options.items).removeClass(options.currentClass);
                $(this).addClass(options.currentClass);

            }).bind("mouseleave", function() {
                $(options.items).removeClass(options.currentClass);
            });

            $(options.target).show();
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

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = AutoComplete;
    }else{
        exports.autocomplete = AutoComplete;
    }
    
}));
