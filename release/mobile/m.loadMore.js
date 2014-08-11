var Mo = Mo || {};
(function(){
	var Tools = {
        template : function(tmpl, json){
            if (typeof tmpl !== "string" || typeof json !== "object") return "";
            return tmpl.replace(/\@{([a-zA-Z_0-9\-]*)\}/g, function (all, key) {
                return typeof json[key] !== "undefined" ? json[key] : ""
            });
        }
    };


	Mo.loadMore = function(options){
		var _this = this,
	        defaults = {
	        	auto : false,
	        	container : "#container",
	            loadmoreBtn : '#j-loadmore',
	            updateTarget : '#j-list',
	            updateKey : 'list',
	            loadmoreParam : {},
	            updateTmpl : '\
	                <%for(var i = 0, item; item = list[i],i < list.length; i++){%>\
	                    <li>\
	                        <a href="<%=iteurl%>">\
	                            <img class="img" src="<%=item.avatar%>" alt="<%=item.title%>">\
	                            <span class="tit"><%=item.title%></span>\
	                        </a>\
	                    </li>\
	                <%}%>\
	            ',
	            loadmoreUrl : 'ajax/songlist-t-@{type}-p-@{page}.html',
	            afterLoadmore : function(){} 
	        };

	    this.options = options = $.extend({}, defaults, options);

	    var $load_more = $(options.loadmoreBtn),
	        $main = $(options.container);

	    var v_height = window.innerHeight || document.documentElement.clientHeight; 
	 	var v_width = window.innerWidth || document.documentElement.clientWidth; 

	    $(options.loadmoreBtn).bind("click", function(e){
	        var $this = $(this),
	            page_num = parseInt( $(this).attr("data-page") );

	        e.preventDefault();

	        if ( $this.hasClass("nodata") || $this.hasClass("loading") ){
	            return false;
	        }

	        $this.removeClass("error").addClass("loading").html("正在加载更多数据...");

	        options.loadmoreParam.page = page_num;

	        $.ajax({
                type : "GET",
                dataType : "json",
                timeout : 20000,
                url : Tools.template(options.loadmoreUrl, options.loadmoreParam),
                success : function(json){
                    var $updateTarget = $(options.updateTarget),
	                    list = json.result[options.updateKey];

	                if (list.length > 0){
	                    $updateTarget.append( baidu.template( options.updateTmpl , json.result) );
	                    if(typeof options.afterLoadmore === "function"){
	                        options.afterLoadmore(json);
	                    }
	                }

	                if (json.result.page >= json.result.pagecount){
	                    $this.removeClass("loading").addClass("nodata").html("没有更多啦，去刷其他页面吧~");
	                    $(window).unbind("scroll.load_more");
	                    if(json.result.pagecount <= 1){
	                        $this.hide();
	                    }
	                } else {
	                    $this.attr("data-page", json.result.page + 1);
	                    $this.removeClass("loading").html("点击加载更多");
	                }
                },
                error : function(text){
	                $this.removeClass("loading nodata").addClass('error').html('亲,你网络不给力哦~ 重新载入');
	            }
            });

	    });
	
		if(options.auto === true){
			if ($main.height() - v_height - window.scrollY <= 220){
		        $load_more.trigger("click");
		    }

		    $(window).bind("scroll.load_more", function(){
		        if($load_more.hasClass('error')){
		            return;
		        }
		        if ($main.height() - v_height - window.scrollY <= 220){
		            $load_more.trigger("click");
		        }
		    });
	    }
	}

})();