/*
	首页
*/

RESOURCE_URL = "../";

LightApp.container = "#j-container";
LightApp.touchable = "a,.j-touchable";
LightApp.link = "a";
LightApp.loadingTmpl = '\
    <div class="la-page la-loading-page" style="display:none;">\
        <header class="la-header">\
            <h1 class="title">页面加载中...</h1>\
        </header>\
        <div class="la-section">\
            <img class="loading" src="' + RESOURCE_URL + 'images/loading.gif" alt="努力加载中" />\
        </div>\
    </div>\
';

LightApp.indexPage = {
	init : function(){
	}
}

LightApp.blankPage = {
    init : function(){
    }
}

LightApp.videoPage = {
    init : function(){
        LightApp.video(".j-videoplayer");
    }
}

LightApp.togglePage = {
    init : function(){
        new LightApp.toggle({
            target : '.j-toggle',
            btn : '.j-btn-toggle',
            line : 4
        });

        new LightApp.toggle({
            target : '.j-toggle1',
            btn : '.j-btn-toggle1',
            line : 0,
            showText : "展开",
            hideText : "收起"
        });
    }
}

LightApp.sharePage = {
    init : function(){
        LightApp.share({});
    }
}

LightApp.tabPage = {
    init : function(){
        new LightApp.tab({
            title : ".j-tab-title li",
            view : ".j-tab-view .tab-view"
        });
    }
}

LightApp.historyPage = {
    init : function(){
    }
}

LightApp.fixedSummaryPage = {
    init : function(){
        new LightApp.fixedSummary({
            top : 48
        });
    }
}

LightApp.dialogPage = {
    init : function(){
        $(".j-btn-showdialog").bind("click", function(){
            var transition = $(this).attr("data-transition");
            new LightApp.dialog({
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

LightApp.loadmorePage = {
    init : function(){
        new LightApp.loadMore({
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

LightApp.slidePage = {
    init : function(){
        //demo 1
        if($("#j-slide-center").find('img')[0]){
            var pre_load_img = imgReady($("#j-slide-center").find('img')[0].src, function() {
                var width,ratio;

                width = 150;//this.width;
                ratio = this.width / this.height;

                $("#j-slide-center .slide-view").width(width);

                new LightApp.slide({
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
        new LightApp.slide({
            items: "#j-slide .slide-view li",
            target: "#j-slide .slide-view ul",
            nav_target: "#j-slide .slide-nav",
            resize : true,//设置resize 表示根据屏幕自适应
            autoplay : true,
            ratio : 4 / 3// 图片的宽高比例
        });

        //demo 3
        new LightApp.slide({
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

LightApp.slidePagerPage = {
    init : function(){
        var PageCache = {};

        PageCache["1"] = $("#j-slide_pager .slide-page").html()

        new LightApp.slidePager({
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