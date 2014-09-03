//视频播放

window.LightApp = window.LightApp || {};

LightApp.video = function(target){
    target = target || ".j-videoplayer";

    //播放按钮
    $(target).bind('click',function(){
        var $video = $(this);
            url = $video.attr("data-url"),
            poster = $video.find("img").attr("src");

        $video.html('<video autoplay="autoplay" poster="' + poster + '" preload="none" controls="controls" src="'+ url +'"您的浏览器不支持视频播放</video>');

        setTimeout(function(){
            var video = $video.find("video")[0];
            video.play();
        }, 50);
    });
}