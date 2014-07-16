/**
 * @description    : 自适应高度和统计字数输入框组件 ue.textarea
 */

define(function(require,exports,module){
    /*中文字数*/
    function cnlen(str, type){
        return str.replace(/[^\x00-\xff]/g,"aa").length;
    }

    /*去除html代码*/
    function unescapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /*中文截断*/
    function cnslice(str,start,maxlen){
        var count = 0,maxlen = maxlen || 280,str1 = str.split("");
        for(var i=0,l=str1.length;i<l;i++){
            count += cnlen(str1[i]);
            if(count == maxlen){
                break;
            }else if(count >maxlen){
                i--;
                break;
            }
        }
        return str.substr(0,i+1);
    }

    /*简易模版函数*/
    function template(tmpl,json){
        if (typeof tmpl !== "string" || typeof json !== "object") return "";
        return tmpl.replace(/\@{([a-zA-Z_0-9\-]*)\}/g, function (all, key) {
            return typeof json[key] !== "undefined" ? json[key] : ""
        });
    }

    function ctor(options){
        var defaults = {
            target : "",
            maxLengthTarget : "",
            maxLengthText : '@{count}/@{maxLength}',
            maxLength : 40,
            maxHeight : 60,
            focusClass : "",
            overMode : 1,
            callback : function(){}
        };

        this.options = options = $.extend(defaults, options);
        this.init();
    }

    ctor.prototype = {
        init : function(){
            var _this = this,
                is_animate = false,
                options = this.options,
                $target = $(options.target),
                $textarea = $target.find("textarea"),
                $maxlength = $(options.maxLengthTarget),
                defaultValue = options.defaultValue,
                fontSize = $textarea.css("font-size"),
                height = $textarea.css("height"),
                width = $textarea.css("width"),
                lineHeight = $textarea.css("line-height"),
                padding = $textarea.css("padding"),
                fontFamily = $textarea.css("font-family"),
                maxLength = options.maxLength,
                preHeight = parseInt(height),
                id = 'ue_autoHeight' + (new Date() - 0) + Math.round(Math.random() * 1000),
                autoHeight = '<div id="@{id}" style="opacity:0; filter:alpha(opacity = 0);word-break:break-all !important; word-wrap:break-word !important; resize:none;overflow:hidden;  font-size:@{fontSize}; height:auto;line-height:@{lineHeight};width:@{width};padding:@{padding}; font-family:@{fontFamily}">@{defaultValue}</div>',
                $autoHeight;


            /*$(document.body).append(template(autoHeight, {
             defaultValue : defaultValue,
             fontSize : fontSize,
             height : height,
             width : width,
             lineHeight : lineHeight,
             padding : padding,
             fontFamily : fontFamily,
             id : id
             }))	;*/

            $autoHeight = $("#" + id);

            $textarea.bind("focus", function(){
                var val = $.trim($textarea.val());
                $textarea.addClass(options.focusClass);
                if (val === defaultValue){
                    $textarea.val('');
                    if(options.overMode){
                        $maxlength.html(template(options.maxLengthText,{overnum :  maxLength}));
                    }else{
                        $maxlength.html(template(options.maxLengthText,{count : 0, maxLength : maxLength}));
                    }
                }
                /*focus触发函数*/
                options.callback();
            })
                .bind("blur",function(e){
                    var val = $.trim($textarea.val());
                    $textarea.removeClass(options.focusClass);
                    if (val === ''){
                        if(options.overMode){
                            $maxlength.html(template(options.maxLengthText,{overnum :  maxLength}));
                        }else{
                            $maxlength.html(template(options.maxLengthText,{count : 0, maxLength : maxLength}));
                        }
                        if (!is_animate){
                            is_animate = true;
                            $textarea.animate({"height" : height}, 200, "linear", function(){
                                $textarea.val(defaultValue);
                                is_animate = false;
                            });
                        }
                    }
                })
                .bind("keydown keypress keyup mousedown", function(e){

                    var pre_val = $textarea.val(),
                        val = $.trim(pre_val),
                        len = cnlen(val),
                        num = Math.ceil((len > maxLength * 2 ? maxLength * 2: len) / 2 );

                    if (val === defaultValue){len = 0}
                    if (len > maxLength){
                        $textarea.val(cnslice(val, 0, maxLength * 2));
                    }

                    //$maxlength.html(template(options.maxLengthText,{count : num, maxLength : maxLength}));
                    if(options.overMode){
                        var overNum = maxLength - num;
                        $maxlength.html(template(options.maxLengthText,{overnum :  overNum}));
                    }else{
                        $maxlength.html(template(options.maxLengthText,{count : 0, maxLength : maxLength}));
                    }

                    var rows = pre_val.split(/\n/g);
                    pre_val = rows.join("<br/>");
                    pre_val = pre_val.replace(/\s/g,"&nbsp;");

                    $autoHeight.html(unescapeHTML(pre_val) + "|");
                    height = $autoHeight.height() || 0;
                    if (height < preHeight){
                        height = preHeight;
                    }

                    if (!is_animate && height != $textarea.height()){
                        is_animate = true;
                        $textarea.animate({"height" : height}, 200, "linear", function(){
                            is_animate = false;
                        });
                    }

                }).css({
                    "word-break " :"break-all",
                    "word-wrap" : "break-word"
                }).val(defaultValue);
        }
    }
    module.exports = ctor;
});
