/*
	首页
*/
RESOURCE_URL = "../";

LightApp.container = "#j-container";
LightApp.touchable = "a";
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

LightApp.apiPage = {
	init : function(){
	}
}