//分享

window.La = window.La || {};

La.share = (function(){

    var baidu = 'http://openapi.baidu.com/social/widget/share?method=share&media_type=@{type}&client_id=NMEkI4hIaNLmSfGvrQ8jn6QK&url=@{url}&pic_url=@{pic}&content=@{content}&u=@{url}',
        qqzone = 'http://openmobile.qq.com/oauth2.0/m_jump?page=qzshare.html&loginpage=loginindex.html&logintype=qzone&site=%E7%99%BE%E5%BA%A6&appName=%E7%99%BE%E5%BA%A6&imageUrl=@{pic}&summary=@{content}&title=@{content}&appId=100312028&action=shareToQQ&targetUrl=@{url}&t=1406791103509';

    function init(options){
        var defaults = {
            btn : "#j-btn_share",
            content : document.title,
            url : document.location.href,
            pic : "",
            container : "#j-container"
        }

        options = $.extend(defaults, options);
        options.content = encodeURIComponent(options.content);
        options.url = encodeURIComponent(options.url);
        options.pic = encodeURIComponent(options.pic);
        var $share_pop = render(options);

        $(options.btn).bind('click',function(){
            $share_pop.addClass("ctl-show");
        });

        $share_pop.find(".btn-close").bind('click',function(){
            $share_pop.removeClass("ctl-show");
        });
    }

    function render(options){
        var $share_pop;

        var tmpl = '\
            <div class="la-dialog la-mask">\
                <div class="dialog la-share">\
                    <h5 class="title">分享给好友</h5>\
                    <ul class="links clearfix">\
                        <li><a class="sinaweibo"><i></i>新浪微博</a></li>\
                        <li><a class="qqzone"><i></i>QQ空间</a></li>\
                        <li><a class="qqweibo"><i></i>腾讯微博</a></li>\
                        <li><a class="renren"><i></i>人人网</a></li>\
                    </ul>\
                    <a href="javascript:;" class="btn-close">&times;</a>\
                </div>\
            </div>\
        ';

        $share_pop = $(tmpl).appendTo(options.container);

         var urls = {};

        //qq空间
        urls.qqzone = Tools.template(qqzone, options);
        //新浪微博
        options.type = "sinaweibo";
        urls.sinaweibo = Tools.template(baidu, options);
        //qq微博
        options.type = "qqweibo";
        urls.qqweibo = Tools.template(baidu, options);
        //人人网
        options.type = "renren";
        urls.renren = Tools.template(baidu, options);

        // 赋值给相关分享
        $share_pop.find("li a").each(function(i, v){
            $(v).attr("href",urls[v.className]);
        });

        return $share_pop;
    }

    return init;
})();

