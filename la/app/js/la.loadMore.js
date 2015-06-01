//点击加载更多

;(function(){

    function loadMore(options){
        var _this = this,
            defaults = {
                loadmoreBtn : '#j-loadmore',
                updateTarget : '#j-list',
                updateKey : 'list',
                loadmoreParam : {},
                updateTmpl : '',
                loadmoreUrl : 'ajax/p-@{page}.html',
                afterLoadmore : function(json, target){},
                loadmoreText : "点击加载更多",
                loadingText : "正在加载更多数据...",
                nodataText : "没有更多啦，去刷其他页面吧~",
                errorText : '亲,你网络不给力哦~ 重新载入',
                autoload : false,
                autoloadOffset : 100
            };

        this.options = options = $.extend({}, defaults, options);
        this.bind();
    };

    loadMore.prototype = {
        bind : function(){
            var _this = this,
                options = this.options,
                $load_more = $(options.loadmoreBtn);

            $("body").delegate(options.loadmoreBtn, "click", function(e){
                var $this = $(this),
                    page_num = parseInt( $(this).attr("data-page") ) || 2;

                e.preventDefault();

                if ( $this.hasClass("ctl-nodata") || $this.hasClass("ctl-loading") ){
                    return false;
                }

                $this.removeClass("ctl-error").addClass("ctl-loading").html(options.loadingText);

                if(options.autoload === true){
                    $this.show();
                }

                options.loadmoreParam.page = page_num;

                $.ajax( {
                    type : "GET",
                    dataType : "json",
                    timeout : 20000,
                    url : Tools.template(options.loadmoreUrl, options.loadmoreParam),
                    success : function(json){
                        var $updateTarget = $(options.updateTarget),
                            list = json.result[options.updateKey];

                        if (list.length > 0){
                            $updateTarget.append( baidu.template( options.updateTmpl , json.result) );
                        }

                        if (json.result.page >= json.result.pagecount){
                            $this.removeClass("ctl-loading").addClass("ctl-nodata").html(options.nodataText);
                            if(options.autoload === true){
                                $(window).unbind("scroll.loadMore");
                            } 
                        } else {
                            $this.attr("data-page", json.result.page + 1);
                            $this.removeClass("ctl-loading").html(options.loadmoreText);
                            if(options.autoload === true){
                                $this.hide();
                            }
                        }

                        if(typeof options.afterLoadmore === "function"){
                            options.afterLoadmore(json, $this);
                        }
                    },
                    error : function(err){
                        console.log(err);
                        $this.removeClass("ctl-loading ctl-nodata").addClass('ctl-error').html(options.errorText);
                    },
                });
            });

            if(options.autoload === true){
                $load_more.hide();

                if ($("body").height() - $(window).height() - window.scrollY <= options.autoloadOffset){
                    $load_more.trigger("click");
                }

                $(window).bind("scroll.loadMore", function(){
                    if($load_more.hasClass('ctl-error')){
                        return;
                    }
                    if ($("body").height() - $(window).height() - window.scrollY <= options.autoloadOffset){
                        $load_more.trigger("click");
                    }
                });
            }
        }
    }

    window.La = window.La || {};
    La.loadMore = loadMore;
})();