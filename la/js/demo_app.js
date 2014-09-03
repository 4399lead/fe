/*
	首页
*/

RESOURCE_URL = "../";

La.container = "#j-container";
La.touchable = "a,.j-touchable";
La.link = "a";
La.loadingTmpl = '\
    <div class="la-page la-loading-page" style="display:none;">\
        <header class="la-header">\
            <h1 class="title">页面加载中...</h1>\
        </header>\
        <div class="la-section">\
            <img class="loading" src="' + RESOURCE_URL + 'images/loading.gif" alt="努力加载中" />\
        </div>\
    </div>\
';

La.indexPage = {
	init : function(){
	}
}

La.blankPage = {
    init : function(){
    }
}

La.videoPage = {
    init : function(){
        La.video(".j-videoplayer");
    }
}

La.togglePage = {
    init : function(){
        new La.toggle({
            target : '.j-toggle',
            btn : '.j-btn-toggle',
            line : 4
        });

        new La.toggle({
            target : '.j-toggle1',
            btn : '.j-btn-toggle1',
            line : 0,
            showText : "展开",
            hideText : "收起"
        });
    }
}

La.sharePage = {
    init : function(){
        La.share({});
    }
}

La.tabPage = {
    init : function(){
        new La.tab({
            title : ".j-tab-title li",
            view : ".j-tab-view .tab-view"
        });
    }
}

La.historyPage = {
    init : function(){
    }
}

La.fixedSummaryPage = {
    init : function(){
        new La.fixedSummary({
            top : 48
        });
    }
}

La.dialogPage = {
    init : function(){
        $(".j-btn-showdialog").bind("click", function(){
            var transition = $(this).attr("data-transition");
            new La.dialog({
                id : "j-dialog",
                theme : "la-dialog-def",
                transition : 'ctl-' + transition,
                content : '\
                    <div class="dialog-hd">\
                        <h5 class="title">弹窗标题</h5>\
                        <a href="javascript:;" class="btn-close">&times;</a>\
                    </div>\
                    <div class="dialog-bd">弹窗内容</div>\
                '
            });
        });
    }
}

La.loadmorePage = {
    init : function(){
        new La.loadMore({
            loadmoreBtn : '#j-loadmore',
            updateTarget : '#j-list',
            updateKey : 'list',
            loadmoreParam : {},
            updateTmpl : '\
                <%for(var i = 0, item; item = list[i],i < list.length; i++){%>\
                    <li>\
                        <a href="<%=item.url%>" title="<%=item.title%>">\
                            <span class="title"><%=item.title%></span>\
                            <i class="i-arrow-right i-grey"></i>\
                        </a>\
                    </li>\
                <%}%>\
            ',
            loadmoreUrl : 'ajax/index-p-@{page}.html',
        });
    }
}

La.slidePage = {
    init : function(){
        //demo 1
        if($("#j-slide-center").find('img')[0]){
            var pre_load_img = imgReady($("#j-slide-center").find('img')[0].src, function() {
                var width,ratio;

                width = 150;//this.width;
                ratio = this.width / this.height;

                $("#j-slide-center .slide-view").width(width);

                new La.slide({
                    items: "#j-slide-center .slide-view li",
                    target: "#j-slide-center .slide-view ul",
                    nav_target: "#j-slide-center .slide-nav",
                    margin: 20,
                    hasTap: false,
                    autoplay : true,
                    width: width,
                    ratio : ratio
                });
            });
        }

        //demo 2
        new La.slide({
            items: "#j-slide .slide-view li",
            target: "#j-slide .slide-view ul",
            nav_target: "#j-slide .slide-nav",
            resize : true,//设置resize 表示根据屏幕自适应
            autoplay : true,
            ratio : 4 / 3// 图片的宽高比例
        });

        //demo 3
        new La.slide({
            items: "#j-slide-fluid .slide-view li",
            target: "#j-slide-fluid .slide-view ul",
            margin: 20,
            speed : 600,
            delay : 2000,
            hasTap: false,
            autoplay : false,
            scrollNum : "auto",
            width: 100
        });
    }
}

La.slidePagerPage = {
    init : function(){
        var PageCache = {};

        PageCache["1"] = $("#j-slide_pager .slide-page").html()

        new La.slidePager({
            page_target : "#j-slide_pager .slide-view",
            page_item : "#j-slide_pager .slide-page",

            pager_target : "#j-slide_pager .slide-pager ul",
            pager_item : "#j-slide_pager .slide-pager li",
            speed : 400,

            setPageContent : function(page, $page){

                if(page == 0){
                    $page.html('已经到头了');
                } else if(page == this.page_count + 1){
                    $page.html('已经是最后一页');
                } else {
                    if(PageCache[page]){
                        $page.html(PageCache[page]);
                    } else {

                        $page.html('<div style="padding:40px 0; text-align:center;"><img class="loading" src="' + RESOURCE_URL+ 'images/loading.gif" width="24" height="24" alt="努力加载中"> 正在加载第' + page + '页数据...</div>');
                        //模拟异步请求的延迟
                        setTimeout(function(){
                            var json = {
                                list : [,,,,,,,,,]
                            }

                            var html = '<ul>';

                            for(var i = 0; i < json.list.length; i++){
                                html += '<li><img src="http://placehold.it/90x90" /></li>'
                            }

                            html += '</ul>';

                            PageCache[page] = html;
                            $page.html(html);

                        }, 600);
                    }
                    
                }
            }
        });
    }
}