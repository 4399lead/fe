//tab切换

window.LightApp = window.LightApp || {};
LightApp.tab = function(options){
	var defaults = {
		title : ".j-tab-title li",
		view : ".j-tab-view",
		active : 0,
		onShow : function(){}
	};

	options =  $.extend(defaults, options);

    $(options.title).bind("click.tab", function(){
        var index = $(this).index();
        $(this).addClass("ctl-active").siblings().removeClass("ctl-active");
        $(options.view).eq(index).show().siblings(options.view).hide();

        options.onShow(index);
    });

    $(options.title).eq(options.active).trigger("click");
}