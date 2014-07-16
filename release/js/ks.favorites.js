/**
 * @description    : 收藏组件
 * @author         : zhengguobao@4399.com
 * @change details : 2012-12-18 created by f2er
 * @parameter      : addBookmark : 添加收藏组件
 * @parameter      : name : 标题
 * @parameter      : href : 收藏地址
 */
;(function(factory) {
    // CMD/SeaJS
    if(typeof define === "function") {
        define(factory);
    }
    // No module loader
    else {
        factory('', window['ue']={}, '');
    }

}(function(require, exports, module) {

    function favorites(name,href){
        var title = name || document.title,
            url = href || document.location.href;
        try{
            if(window.sidebar){
                window.sidebar.addPanel(title,url,'');
            }else{
                window.external.AddFavorite(url,title);
            }
        }catch(e){
            alert("您的浏览器不支持该功能,请使用Ctrl+D收藏本页");
        }

    }

    if( {}.toString.call(module) == '[object Object]' ){
        module.exports = favorites;
    }else{
        exports.favorites = favorites;
    }

}));
