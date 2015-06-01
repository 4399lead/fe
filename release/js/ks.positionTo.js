<<<<<<< HEAD:release/js/ks.positionTo.js
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

=======
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

>>>>>>> 5c5b2a764df1c0554f639ed3a86d8bc802d8b1c0:release/js/ks.positionTo.js
}));