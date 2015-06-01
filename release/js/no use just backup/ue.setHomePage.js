/*
* setHomePage 设为首页
* @url 设为首页的地址
* @obj 设为首页节点对象
* @情封
* */
(function($, win, undefined){
    function setHomePage(obj,url){
        if(!url){
            url = document.location;
        }
        try{
            obj.style.behavior = 'url(#default#homepage)';
            obj.setHomePage(url);
        }catch(e){
            if(window.netscape){
                try{
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }catch(e){
                    alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
                }
            }else{
                alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
            }
        }
    }
    win.ue = win.ue || {};
    ue.setHomePage = setHomePage;
})(jQuery,window);