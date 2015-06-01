<<<<<<< HEAD
//基础框架
;(function(){
	var isLoading = false;
	var guid = 1;
    var animateDuration = 600;

    var AppHelp = {
        cache : {},

        parseUrl : function(url){
            var a = document.createElement("a");
            a.href = url;
            url = a.href;

            var ajaxurl = url.split("/");
            var pagename = ajaxurl[ajaxurl.length - 1].split(".")[0] || "index";

            ajaxurl.splice(ajaxurl.length - 1, 0, "ajax");
            ajaxurl = ajaxurl.join("/");

            return {pagename : pagename, ajaxurl: ajaxurl, url : url }
        },

        get : function(url, callback, cache){
            var apphelp = this;
            cache = cache === false ? false : true;

            if(cache && this.cache[url]){
                console.log("readcache");
                callback(this.cache[url]);
                return;
            }

            console.log("get from server");
            setTimeout(function(){
                $.get(url, function(result){
                    if(cache){
                        apphelp.cache[url] = result;
                    }
                    callback(result);
                });
            }, Math.random() * 1000 + 100);
        }
    };

    var App =  {
        container : "body",
        touchable : "a",
        link : "a",
        nav : ".la-nav li",
        
        history : [],

        cache : {},

        init : function(){
            var app = this;

            try{
                guid = parseInt(window.sessionStorage["guid"] || 1);
            } catch(e){

            }

            var state = AppHelp.parseUrl(document.location.href);

            app.history.push( state );
            state.guid = guid;

            var homeState = AppHelp.parseUrl("index.html");
            homeState.guid = guid;

            window.history.replaceState(homeState, "", homeState.url);
            window.history.pushState(state, "", state.url);

            window.addEventListener("load", function(){
                setTimeout(function(){
                    console.log("bind popstate");
                    window.addEventListener("popstate", function(e){
                        var state = e.state;
                        console.log(state);
                        if(!state){
                            alert('参数错误');
                            return;
                        }

                        if(state.guid > guid){
                            console.log("forward");
                            //app.go(state.url, "forward");
                            return;
                        }

                        if(state.guid <= guid){
                            console.log("backward");
                            app.go(state.url, "backward");
                        }
                    });

                }, 50);
            });

            app.bind();
        },

        setGuid : function(_guid){
            guid = _guid;
            try{
                window.sessionStorage["guid"] = guid;
            } catch(e){

            }
        },

        bind : function(){
        	var app = this;
            var state = app.history[app.history.length - 1];

        	//绑定链接预加载页面
            $("body").delegate(app.link, "click", function(e){
                e.preventDefault();
                
                console.log("1");
                if( $(this).attr("data-async") ){
                    return;
                }

                app.go(this.href, $(this).attr("data-behavior") || "replace");
            });

           	$(app.nav).bind("click", function(){
                if(isLoading){
                    return;
                }

           		$(this).addClass("ctl-active").siblings().removeClass("ctl-active");
           	});

            //绑定 touch hover
            $("body").delegate(app.touchable, 'touchstart', function(e){
                $(this).addClass('ctl-touch');
            }).delegate(app.touchable, 'touchend', function(e){
                $(this).removeClass('ctl-touch');
            });

            app.iScroll(state.pagename);
        },

        iScroll : function(pagename){
            var app = this;

            app.myScroll = new IScroll("#" + pagename + 'Page .la-content', {
                scrollX: false,
                scrollY: true,
                probeType: 3,
                click: true
            });

            app.myScroll.on("scroll", function(){
                if(this.y - this.maxScrollY < 100){
                    app.loadmore({
                        loadmoreBtn : "#j-loadmore",
                        updateTarget : '#j-list',
                    });
                }
            });
        },

        loadmore : function(options){
            var app = this;

            var defaults = {
                loadmoreText : "点击加载更多",
                loadingText : "正在加载更多数据...",
                nodataText : "没有更多啦，去刷其他页面吧~",
                errorText : '亲,你网络不给力哦~ 重新载入'
            }

            options = $.extend(defaults, options);

            var $this = $(options.loadmoreBtn),
                page_num = parseInt( $this.attr("data-page") ) || 2;

            console.log("page_num:",page_num);
            if ( $this.hasClass("ctl-nodata") || $this.hasClass("ctl-loading") ){
                return false;
            }

            $this.removeClass("ctl-error").addClass("ctl-loading").html(options.loadingText);

            $.ajax( {
                type : "GET",
                dataType : "html",
                timeout : 20000,
                url : 'ajax/index-more.html?p=' + page_num,
                success : function(data){
                    
                    $(options.updateTarget).append(data);
                    app.myScroll.refresh();

                    if (data.split("<li>").length < 11){
                        $this.removeClass("ctl-loading").addClass("ctl-nodata").html(options.nodataText);
                    } else {
                        $this.attr("data-page", page_num + 1);
                        $this.removeClass("ctl-loading").html("点击加载更多");
                    }
                },
                error : function(err){
                    console.log(err);
                    $this.removeClass("ctl-loading ctl-nodata").addClass('ctl-error').html(options.errorText);
                },
            });
        },

        go : function(url, behavior){
            var app = this;
            var state = app.history[app.history.length - 1];
            var nextState = AppHelp.parseUrl(url);

            console.log(app.history.length);

            if(isLoading){
                return;
            }

            if(behavior == "backward" && app.history.length <= 1){
                if(!App[state.pagename + "Page"].defaultBackUrl){
                    window.history.pushState(state, "", state.url);
                    return;
                }
                
                nextState = AppHelp.parseUrl(App[state.pagename + "Page"].defaultBackUrl);
                app.history.unshift(nextState);
            }

            if(behavior == "forward"){
                app.history.push(nextState);
                app.cache[state.pagename] = $("#" + state.pagename + 'Page');
                app.forward(state, nextState);
                app.setGuid(guid + 1);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
                return;
            }

            if(behavior == "replace"){
                app.history.length = 0;
                app.history.push(nextState);
                app.replace(state, nextState);
                app.setGuid(guid + 1);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
                return;
            }

            if(behavior == "backward"){
                app.history.pop();
                nextState = app.history[app.history.length - 1];
                app.backward(state, nextState);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
            }
        },

        forward : function(state, nextState){
        	var app = this;
        	isLoading = true;

            var result = '\
                <div class="la-page next" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            $(app.container).append(result);

            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');

            setTimeout(function(){
                $pageActive.addClass("prev").removeClass("active");
                $pageToActive.addClass("active").removeClass("next");
            }, 50);
            
            setTimeout(function(){
                $pageActive.remove();
                $pageToActive.removeClass("active");
            }, animateDuration + 50);

        	AppHelp.get(nextState.ajaxurl, function(result){
                $pageToActive.html(result);

                app.iScroll(nextState.pagename);

                isLoading = false;            	
            });
        },

        backward : function(state, nextState){
        	var app = this;

        	isLoading = true;

            var result = '\
                <div class="la-page prev" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            if(app.cache[nextState.pagename]){
                result = app.cache[nextState.pagename];
                console.log("read dom cache");
                result.addClass("prev").removeClass("next");
            }

            $(app.container).append(result);
            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');

            setTimeout(function(){
                $pageActive.addClass("next").removeClass("active");
                $pageToActive.addClass("active").removeClass("prev");
            }, 50);
            
            setTimeout(function(){
                $pageActive.remove();
                $pageToActive.removeClass("active");

                if(app.cache[nextState.pagename]){
                    isLoading = false;
                }
            }, animateDuration + 50);

            //没有读到缓存
            if(!app.cache[nextState.pagename]){
            	AppHelp.get(nextState.ajaxurl, function(result){
                    $pageToActive.html(result);
                	
                    app.iScroll(nextState.pagename);

                    isLoading = false;
                });
            }
        },

        replace : function(state, nextState){
        	var app = this;

        	isLoading = true;

            var result = '\
                <div class="la-page" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            $(app.container).append(result);
            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');
            $pageActive.remove();

        	AppHelp.get(nextState.ajaxurl, function(result){
                
        		$pageToActive.html(result);

        		app.iScroll(nextState.pagename);

                isLoading = false;
            });
        }
    };

    window.App = App;
    window.AppHelp = AppHelp;
})();

App.indexPage = {
    
    init : function(){

    },

    render : function(){

    },

    bind : function(){

    }
}

App.apiPage = {
    
    init : function(){

    },

    bind : function(){

    }
}

App.demoPage = {
    
    init : function(){

    },

    bind : function(){

    }
}

App.detailPage = {
    defaultBackUrl : "index.html",

    init : function(){

    },

    bind : function(){

    }
=======
//基础框架
;(function(){
	var isLoading = false;
	var guid = 1;
    var animateDuration = 600;

    var AppHelp = {
        cache : {},

        parseUrl : function(url){
            var a = document.createElement("a");
            a.href = url;
            url = a.href;

            var ajaxurl = url.split("/");
            var pagename = ajaxurl[ajaxurl.length - 1].split(".")[0] || "index";

            ajaxurl.splice(ajaxurl.length - 1, 0, "ajax");
            ajaxurl = ajaxurl.join("/");

            return {pagename : pagename, ajaxurl: ajaxurl, url : url }
        },

        get : function(url, callback, cache){
            var apphelp = this;
            cache = cache === false ? false : true;

            if(cache && this.cache[url]){
                console.log("readcache");
                callback(this.cache[url]);
                return;
            }

            console.log("get from server");
            setTimeout(function(){
                $.get(url, function(result){
                    if(cache){
                        apphelp.cache[url] = result;
                    }
                    callback(result);
                });
            }, Math.random() * 1000 + 100);
        }
    };

    var App =  {
        container : "body",
        touchable : "a",
        link : "a",
        nav : ".la-nav li",
        
        history : [],

        cache : {},

        init : function(){
            var app = this;

            try{
                guid = parseInt(window.sessionStorage["guid"] || 1);
            } catch(e){

            }

            var state = AppHelp.parseUrl(document.location.href);

            app.history.push( state );
            state.guid = guid;

            var homeState = AppHelp.parseUrl("index.html");
            homeState.guid = guid;

            window.history.replaceState(homeState, "", homeState.url);
            window.history.pushState(state, "", state.url);

            window.addEventListener("load", function(){
                setTimeout(function(){
                    console.log("bind popstate");
                    window.addEventListener("popstate", function(e){
                        var state = e.state;
                        console.log(state);
                        if(!state){
                            alert('参数错误');
                            return;
                        }

                        if(state.guid > guid){
                            console.log("forward");
                            //app.go(state.url, "forward");
                            return;
                        }

                        if(state.guid <= guid){
                            console.log("backward");
                            app.go(state.url, "backward");
                        }
                    });

                }, 50);
            });

            app.bind();
        },

        setGuid : function(_guid){
            guid = _guid;
            try{
                window.sessionStorage["guid"] = guid;
            } catch(e){

            }
        },

        bind : function(){
        	var app = this;
            var state = app.history[app.history.length - 1];

        	//绑定链接预加载页面
            $("body").delegate(app.link, "click", function(e){
                e.preventDefault();
                
                console.log("1");
                if( $(this).attr("data-async") ){
                    return;
                }

                app.go(this.href, $(this).attr("data-behavior") || "replace");
            });

           	$(app.nav).bind("click", function(){
                if(isLoading){
                    return;
                }

           		$(this).addClass("ctl-active").siblings().removeClass("ctl-active");
           	});

            //绑定 touch hover
            $("body").delegate(app.touchable, 'touchstart', function(e){
                $(this).addClass('ctl-touch');
            }).delegate(app.touchable, 'touchend', function(e){
                $(this).removeClass('ctl-touch');
            });

            app.iScroll(state.pagename);
        },

        iScroll : function(pagename){
            var app = this;

            app.myScroll = new IScroll("#" + pagename + 'Page .la-content', {
                scrollX: false,
                scrollY: true,
                probeType: 3,
                click: true
            });

            app.myScroll.on("scroll", function(){
                if(this.y - this.maxScrollY < 100){
                    app.loadmore({
                        loadmoreBtn : "#j-loadmore",
                        updateTarget : '#j-list',
                    });
                }
            });
        },

        loadmore : function(options){
            var app = this;

            var defaults = {
                loadmoreText : "点击加载更多",
                loadingText : "正在加载更多数据...",
                nodataText : "没有更多啦，去刷其他页面吧~",
                errorText : '亲,你网络不给力哦~ 重新载入'
            }

            options = $.extend(defaults, options);

            var $this = $(options.loadmoreBtn),
                page_num = parseInt( $this.attr("data-page") ) || 2;

            console.log("page_num:",page_num);
            if ( $this.hasClass("ctl-nodata") || $this.hasClass("ctl-loading") ){
                return false;
            }

            $this.removeClass("ctl-error").addClass("ctl-loading").html(options.loadingText);

            $.ajax( {
                type : "GET",
                dataType : "html",
                timeout : 20000,
                url : 'ajax/index-more.html?p=' + page_num,
                success : function(data){
                    
                    $(options.updateTarget).append(data);
                    app.myScroll.refresh();

                    if (data.split("<li>").length < 11){
                        $this.removeClass("ctl-loading").addClass("ctl-nodata").html(options.nodataText);
                    } else {
                        $this.attr("data-page", page_num + 1);
                        $this.removeClass("ctl-loading").html("点击加载更多");
                    }
                },
                error : function(err){
                    console.log(err);
                    $this.removeClass("ctl-loading ctl-nodata").addClass('ctl-error').html(options.errorText);
                },
            });
        },

        go : function(url, behavior){
            var app = this;
            var state = app.history[app.history.length - 1];
            var nextState = AppHelp.parseUrl(url);

            console.log(app.history.length);

            if(isLoading){
                return;
            }

            if(behavior == "backward" && app.history.length <= 1){
                if(!App[state.pagename + "Page"].defaultBackUrl){
                    window.history.pushState(state, "", state.url);
                    return;
                }
                
                nextState = AppHelp.parseUrl(App[state.pagename + "Page"].defaultBackUrl);
                app.history.unshift(nextState);
            }

            if(behavior == "forward"){
                app.history.push(nextState);
                app.cache[state.pagename] = $("#" + state.pagename + 'Page');
                app.forward(state, nextState);
                app.setGuid(guid + 1);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
                return;
            }

            if(behavior == "replace"){
                app.history.length = 0;
                app.history.push(nextState);
                app.replace(state, nextState);
                app.setGuid(guid + 1);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
                return;
            }

            if(behavior == "backward"){
                app.history.pop();
                nextState = app.history[app.history.length - 1];
                app.backward(state, nextState);
                nextState.guid = guid;
                window.history.pushState(nextState, "", nextState.url);
            }
        },

        forward : function(state, nextState){
        	var app = this;
        	isLoading = true;

            var result = '\
                <div class="la-page next" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            $(app.container).append(result);

            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');

            setTimeout(function(){
                $pageActive.addClass("prev").removeClass("active");
                $pageToActive.addClass("active").removeClass("next");
            }, 50);
            
            setTimeout(function(){
                $pageActive.remove();
                $pageToActive.removeClass("active");
            }, animateDuration + 50);

        	AppHelp.get(nextState.ajaxurl, function(result){
                $pageToActive.html(result);

                app.iScroll(nextState.pagename);

                isLoading = false;            	
            });
        },

        backward : function(state, nextState){
        	var app = this;

        	isLoading = true;

            var result = '\
                <div class="la-page prev" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            if(app.cache[nextState.pagename]){
                result = app.cache[nextState.pagename];
                console.log("read dom cache");
                result.addClass("prev").removeClass("next");
            }

            $(app.container).append(result);
            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');

            setTimeout(function(){
                $pageActive.addClass("next").removeClass("active");
                $pageToActive.addClass("active").removeClass("prev");
            }, 50);
            
            setTimeout(function(){
                $pageActive.remove();
                $pageToActive.removeClass("active");

                if(app.cache[nextState.pagename]){
                    isLoading = false;
                }
            }, animateDuration + 50);

            //没有读到缓存
            if(!app.cache[nextState.pagename]){
            	AppHelp.get(nextState.ajaxurl, function(result){
                    $pageToActive.html(result);
                	
                    app.iScroll(nextState.pagename);

                    isLoading = false;
                });
            }
        },

        replace : function(state, nextState){
        	var app = this;

        	isLoading = true;

            var result = '\
                <div class="la-page" id="' + nextState.pagename + 'Page">\
                    <header class="la-header">\
                        <h1 class="title">正在加载中...</h1>\
                    </header>\
                    <div class="la-content">\
                        <div class="la-section">\
                        </div>\
                    </div>\
                </div>';

            $(app.container).append(result);
            var $pageToActive = $("#" + nextState.pagename + 'Page');
            var $pageActive = $("#" + state.pagename + 'Page');
            $pageActive.remove();

        	AppHelp.get(nextState.ajaxurl, function(result){
                
        		$pageToActive.html(result);

        		app.iScroll(nextState.pagename);

                isLoading = false;
            });
        }
    };

    window.App = App;
    window.AppHelp = AppHelp;
})();

App.indexPage = {
    
    init : function(){

    },

    render : function(){

    },

    bind : function(){

    }
}

App.apiPage = {
    
    init : function(){

    },

    bind : function(){

    }
}

App.demoPage = {
    
    init : function(){

    },

    bind : function(){

    }
}

App.detailPage = {
    defaultBackUrl : "index.html",

    init : function(){

    },

    bind : function(){

    }
>>>>>>> 5c5b2a764df1c0554f639ed3a86d8bc802d8b1c0
}