var Mo = Mo || {};

Mo.share = function(options){
    var defaults = {
        btn : "#j-btn_share",
        content : document.title,
        url : document.location.href,
        container : "#container",
        pic_url : ""
    }

    this.options = options = $.extend(defaults, options);
    options.content = encodeURIComponent(options.title);
    options.url = encodeURIComponent(options.url);
    this.init();
}

Mo.share.prototype = {
    init : function(){
        this.render();
        this.bind();
    },

    render : function(){
        var options = this.options,
            $share_pop = $("#j-pop_share");

        var tmpl = '\
            <div id="j-pop_share" style="display:none;">\
                <div class="pop_share">\
                    <span class="i_closey"></span>\
                    <p class="tip">分享给好友</p>\
                    <ul class="list clearfix">\
                        <li><a class="sinaweibo"><i></i>新浪微博</a></li>\
                        <li><a class="qqzone"><i></i>QQ空间</a></li>\
                        <li><a class="qqweibo"><i></i>腾讯微博</a></li>\
                        <li><a class="renren"><i></i>人人网</a></li>\
                    </ul>\
                </div>\
                <div class="mask"></div>\
            </div>\
        ';

        $(options.container).append(tmpl);

        var urls = {
            //q空间
            qqzone : 'http://openmobile.qq.com/oauth2.0/m_jump?page=qzshare.html&loginpage=loginindex.html&logintype=qzone&site=%E7%99%BE%E5%BA%A6&appName=%E7%99%BE%E5%BA%A6&summary=' + options.content + '&title=' + options.content + '&appId=100312028&action=shareToQQ&targetUrl=' + options.url + '&t=1406791103509',
            //新浪微博
            sinaweibo : 'http://openapi.baidu.com/social/widget/share?method=share&media_type=sinaweibo&client_id=NMEkI4hIaNLmSfGvrQ8jn6QK&url='+options.url+'&pic_url=&content='+options.content+'&u='+options.url+'&enabled_medias=qqdenglu%2Csinaweibo%2Cqqweibo%2Crenren%2Ckaixin%2Cmail',
            //q微博
            qqweibo : 'http://openapi.baidu.com/social/widget/share?method=share&media_type=qqweibo&client_id=NMEkI4hIaNLmSfGvrQ8jn6QK&url='+options.url+'&pic_url='+options.pic_url+'&content='+options.content+'&u='+options.url+'&enabled_medias=qqdenglu%2Csinaweibo%2Cqqweibo%2Crenren%2Ckaixin%2Cmail',
            //人人网
            renren : 'http://openapi.baidu.com/social/widget/share?method=share&media_type=renren&client_id=NMEkI4hIaNLmSfGvrQ8jn6QK&url='+options.url+'&pic_url='+options.pic_url+'&content='+options.content+'&u='+options.url+'&enabled_medias=qqdenglu%2Csinaweibo%2Cqqweibo%2Crenren%2Ckaixin%2Cmail'
        }

        // 赋值给相关分享

        $share_pop.find("li a").each(function(i, v){
            console.log(v);
            $(v).attr("href",urls[v.className]);
        });
    },

    bind : function(){
        var options = this.options,
            $share_pop = $("#j-pop_share");

        $(options.btn).bind('click',function(){
            $share_pop.show();
        });

        $share_pop.find(".i_closey").bind('click',function(){
            $share_pop.hide();
        });
    }
}