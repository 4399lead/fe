seajs.config({
    paths:{

    },
    
    alias : {
        'jquery': 'jquery/jquery-1.4.4.min.js',
        'ks.autocomplete' : "release/js/ks.autocomplete.js",
        'ks.copy' : "release/js/ks.copy.js",
        'ks.dialog' : "release/js/ks.dialog.js",
        'ks.fancybox' : "release/js/ks.fancybox.js",
        'ks.favorites' : "release/js/ks.favorites.js",
        'ks.featureCarousel' : "release/js/ks.featureCarousel.js",
        'ks.fixed' : "release/js/ks.fixed.js",
        'ks.gototop' : "release/js/ks.gototop.js",
        'ks.imgloader' : "release/js/ks.imgloader.js",
        'ks.imgReady' : "release/js/ks.imgReady.js",
        'ks.lazyimg' : "release/js/ks.lazyimg.js",
        'ks.lazyLoad' : "release/js/ks.lazyLoad.js",
        'ks.loopSlide' : "release/js/ks.loopSlide.js",
        'ks.marquee' : "release/js/ks.marquee.js",
        'ks.png24' : "release/js/ks.png24.js",
        'ks.scrollFixed' : "release/js/ks.scrollFixed.js",
        'ks.select' : "release/js/ks.select.js",
        'ks.slide' : "release/js/ks.slide.js",
        'ks.sliding' : "release/js/ks.sliding.js",
        'ks.swfobject' : "release/js/ks.swfobject.js",
        'ks.tab' : "release/js/ks.tab.js",
        'ks.validform' : "release/js/ks.validform.js",
        'ks.easydrag' : "release/js/ks.easydrag.js",
        'ks.ZeroClipboard' : "release/js/ks.ZeroClipboard.js",
        'ks.scrollbar' : "release/js/ks.scrollbar.js"
    },

    map: [
        [ /^(.*\.(?:js))(?:.*)$/i, '$1' +  ((window._4399PhoneConfig ? '?' + _4399PhoneConfig.version : ''))]
    ],

    base: '',

    preload : 'jquery'
});