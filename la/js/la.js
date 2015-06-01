//开启模拟网络延迟，后端套页面的时候可以删掉这段js
var SIMULATION_NETWORK = true,
    SIMULATION_NETWORK_DELAY = 1000;

if(!window.RESOURCE_URL){
    window.RESOURCE_URL = ""; 
}

//基础框架
;(function(){
    var La =  {
        container : "#j-container",
        touchable : ".j-touchable",
        link : "a",
        loadingTmpl : '',

        init : function(pagename, options){
            var light_app = this,
                pagename = pagename || 'index',
                light_page = light_app[pagename + 'Page'];

            //用iframe 预加载的时候不执行页面初始化
            if (window.parent.location.href == window.location.href){
                light_page.options = options || {};
                light_page.init();

                //绑定链接预加载页面
                $("body").delegate(light_app.link, "click", function(e){
                    var href = this.href;
                    
                    e.preventDefault();

                    if(href.indexOf('javascript:history.back()') >= 0){
                        history.back();
                        return;
                    }

                    /*
                        data-async 设置链接加载模式
                        0 ：页面跳转
                        1 ：异步加载数据
                    */

                    if(!parseInt($(this).attr("data-async")) && href.indexOf("javascript:") < 0 && href !== "" && href !== "#"){
                        light_app.gotoPage(this.href);
                    }
                });

                //绑定 touch hover
                $("body").delegate(light_app.touchable, 'touchstart', function(e){
                    $(this).addClass('ctl-touch');
                }).delegate(light_app.touchable, 'touchend', function(e){
                    $(this).removeClass('ctl-touch');
                });

                light_app.loadingPage = $(light_app.loadingTmpl).appendTo("body");
                light_app.loadingTimer = setInterval(function(){
                    if(light_app.loaded){
                        $(light_app.container).show();
                        light_app.loadingPage.hide();
                    }
                }, 1000);
            }
        },

        gotoPage : function(url){
            var light_app = this,
                preload_iframe;

            //要跳转的页面url不是当前页面
            if(url !== document.location.href){
                preload_iframe = document.getElementById("j-preload_iframe");

                //已经有存在这个iframe，表示当前有页面正在加载中
                if(preload_iframe){
                    preload_iframe.onload = null;//取消原来的onload事件
                } else{
                    preload_iframe = document.createElement("iframe");
                    preload_iframe.height = 0;
                    preload_iframe.width = 0;
                    preload_iframe.frameBorder = 0;
                    preload_iframe.id = 'j-preload_iframe';
                    
                    document.body.appendChild(preload_iframe);
                    light_app.loading();
                }
                
                preload_iframe.onload = function(){
                    light_app.loaded = true;
                    document.location.href = url;
                };
                
                if(window.SIMULATION_NETWORK === true){
                    setTimeout(function(){
                        preload_iframe.src = url;
                    }, window.SIMULATION_NETWORK_DELAY);
                } else {
                    preload_iframe.src = url;
                }

            }
        },

        ajax : function(options){
            var noop = function(){},
                defaults = {
                type : "GET",
                dataType : "json",
                timeout : 20000,
                success : noop,
                error : noop,
            },

            _options = $.extend(defaults, options);

            _options.success = function(json){
                //模拟异步请求的延迟
                if(window.SIMULATION_NETWORK === true){
                    setTimeout(function(){
                        options.success(json);
                    }, window.SIMULATION_NETWORK_DELAY);
                } else {
                    options.success(json);
                }
            };

            $.ajax(_options);
        },

        loading : function(){
            var light_app = this;

            $(light_app.container).hide();
            light_app.loadingPage.show();
        }
    };

    if(window.La){
        for(var p in La){
            window.La[p] = La[p];
        }
    } else {
        window.La = La;
    }
})();
   
