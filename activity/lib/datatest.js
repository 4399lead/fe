function DataTest(options){
    var defaults = {
        data  : {},
        iframe : "",
        maxDelay : 2000,
        minDelay : 100
    };

    this.options = $.extend(defaults, options);
    this.init();
}

DataTest.prototype = {
    constructor : DataTest,

    init : function(){
        var _this = this;

        for(var key in _this.options.data){
            for(var i = 0, option; i < _this.options.data[key].length; i++){
                option = document.createElement("option");
                option.value = i;
                option.innerHTML = _this.options.data[key][i].title;
                $("#" + key).append(option);
            }

            $("#" + key).bind("change", (function(key){
                return function(){
                    var status_select = parseInt($("#" + key).find("option:selected")[0].value);
                    if(typeof _this.options.data[key][status_select].onchange === "function"){
                        _this.options.data[key][status_select].onchange();
                    }
                }
            })(key));

            $("#" + key).trigger("change");
        }

        //劫持iframe 里面的jquery get方法，重写用来模拟数据
        var iframe_jquery = window[_this.options.iframe].$;
        var pre_get = iframe_jquery.get;
        var pre_post = iframe_jquery.post;
        var pre_ajax = iframe_jquery.ajax;
        var pre_getJSON = iframe_jquery.getJSON;

        iframe_jquery.get = function(url, data, callback){
            _this.handleRequest(url, data, callback) && pre_get.apply(iframe_jquery, arguments);
        }

        iframe_jquery.post = function(url, data, callback){
            _this.handleRequest(url, data, callback) && pre_post.apply(iframe_jquery, arguments);
        }

        iframe_jquery.getJSON = function(url, data, callback){
            _this.handleRequest(url, data, callback) && pre_getJSON.apply(iframe_jquery, arguments);
        }

        iframe_jquery.ajax = function(options){
            _this.handleRequest(options.url, options.data, options.success) && pre_ajax.apply(iframe_jquery, arguments);
        }
    },

    handleRequest : function(url, data, callback){
        var _this = this;
        var r_key = "";

        for(var key in _this.options.data){
            if(url.indexOf(key) >= 0){
                r_key = key;
            }
        }

        if(r_key){
            setTimeout(function(){
                callback(_this.getData(r_key));
            }, _this.options.maxDelay * Math.random() + _this.options.minDelay);
            return false;
        }

        return true;
    },

    getData : function(key){
        var _this = this;

        var status_select = parseInt($("#" + key).find("option:selected")[0].value);


        return _this.options.data[key][status_select].data;
    }
}