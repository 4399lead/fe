/**
 * ks.scrollTo.js
 */
;(function(factory) {
    // CMD/SeaJS 
    if(typeof define === "function") {
        define(factory);
    }
    // No module loader
    else {
        factory('', {}, '');
    }

}(function(require, exports, module) {

	jQuery.fn.positionTo=function(animate){
        $.each($(this),function(index,item){
            var target = $(this).attr("data-target");
            $(item).bind("click",function(){
                var targetPos = $(target).offset().top;
                if(animate){
                    $("html,body").animate({scrollTop:targetPos});
                }else{
                    $("html,body").scrollTop(targetPos);
                }
                return false;
            });
        })
	};

}));