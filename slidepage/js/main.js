var Effect = (function(){
	
	var isSupport = true;
	var isAnimating = false;
	var pageActive = 1;
	var pageCount = 5;
	var pageActived;
	var $pagenav;
	var $pageview;
	var $container;
	var loop;
	var minHeight = 500;

	function support(){
		isSupport = true; 
	}

	function unsupport(){
		isSupport = false; 
	}


	var ua, ver; 
	var ua = navigator.userAgent.toUpperCase();

	if(/iphone|ipad|ipod|android/i.test(ua)){
		support();
	} else {
		if (ua.indexOf("SAFARI") != -1 && ua.indexOf("CHROME/") <= -1) { 
			support(); 
		} else if (ua.indexOf('CHROME/') != -1) { 
			
			if (ua.indexOf('LBBROWSER') != -1) {
				unsupport(); 
			} 
			
			if ((ua.indexOf('QQBROWSER') != -1) && (ua.indexOf('WINDOW') != -1)) { 
				unsupport(); 
			} 

			ver = parseInt(ua.split('CHROME/')[1].split(' ')[0], 10); 
			
			if (ver > 28) { 
				support(); 
			} else { 
				unsupport(); 
			} 
		} else if(ua.indexOf('FIREFOX') != -1){
			support(); 
		} else { 
			unsupport(); 
		} 
	} 

	function fixMousewheel(e){
		if(e.originalEvent){
			e = e.originalEvent;
		}

		var delta = 0, deltaX = 0, deltaY = 0; 
		// Old school scrollwheel delta 
		if ( e.wheelDelta ) { delta = e.wheelDelta/120; } 
		if ( e.detail ) { delta = -e.detail/3; } 

		// New school multidimensional scroll (touchpads) deltas 
		deltaY = delta; 

		// Gecko 
		if ( e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS ) { 
			deltaY = 0; 
			deltaX = -1*delta; 
		} 

		// Webkit 
		if ( e.wheelDeltaY !== undefined ) { deltaY = e.wheelDeltaY/120; } 
		if ( e.wheelDeltaX !== undefined ) { deltaX = -1*e.wheelDeltaX/120; } 

		return {delta : delta, deltaX : deltaX, deltaY : deltaY} 
	} 

	function checkPager(){
		if(pageActive >= pageCount && !loop){
			$pagenav.find(".next").hide();
		} else {
			$pagenav.find(".next").show();
		}

		if(pageActive <= 1 && !loop){
			$pagenav.find(".prev").hide();
		} else {
			$pagenav.find(".prev").show();
		}
	}

	function pageChange(){
		if(pageActive == pageActived){
			isAnimating = false;
			return;
		}

		checkPager();

		$pagenav.find(".active").removeClass("active");
		$pagenav.find("li").eq(pageActive - 1).addClass("active");

		var actived_el = $pageview.eq(pageActived - 1);
		var active_el = $pageview.eq(pageActive - 1);

		$pageview.removeClass("slient").each(function(i, v){
			if( i + 1 != pageActive && i + 1 !== pageActived){
				$(v).addClass("slient");
			}

			if(i + 1 < pageActive){
				$(v).addClass("prev").removeClass("next");
			} else if(i + 1 > pageActive){
				$(v).addClass("next").removeClass("prev");
			}
		});

		if(pageActived < pageActive){
			setTimeout(function(){
				actived_el.addClass("prev").removeClass("active");
				active_el.addClass("active").removeClass("next");
			}, 50);
		} else if(pageActived > pageActive){
			setTimeout(function(){
				actived_el.addClass("next").removeClass("active");
				active_el.addClass("active").removeClass("prev");
			}, 50);
		}
		
		setTimeout(function(){
			isAnimating = false;
		}, 2000);
	}

	var isResizing = false;
	var winHeight;

	function onresize(){
		if(isResizing) return;
		isResizing = true;

		winHeight = $(window).height();

		$container.height(winHeight);
		$pageview.height(winHeight);

		isResizing = false;
	}

	return {
		isSupport : isSupport,

		init : function(options){
			$pagenav = $(options.pagenav);
			$pageview = $(options.pageview);
			$container = $(options.container);

			loop = options.loop === true ? true : false;

			if(isSupport){

				$(document.body).bind("swipeUp swipeLeft", function(e){
					if(isSupport){
						e.preventDefault(); 
						e.stopPropagation(); 
					}

					if(isAnimating === true){ 
						return; 
					} 

					isAnimating = true;
					pageActived = pageActive;
	                pageActive++;

					if(pageActive > pageCount){
						if(loop){
							pageActive = 1;
						} else {
							pageActive = pageCount;
						}
					}

					pageChange();

	            }).bind("swipeDown swipeRight", function(e){
	                if(isSupport){
						e.preventDefault(); 
						e.stopPropagation(); 
					}

					if(isAnimating === true){ 
						return; 
					} 

					isAnimating = true;
					pageActived = pageActive;
					pageActive--;

					if(pageActive < 1){
						if(loop){
							pageActive = pageCount;
						} else {
							pageActive = 1;
						}
					}

					pageChange();
	            });

				document.addEventListener("touchmove", function(e){
					e.preventDefault();
				});

				
			} else {
				$("body").removeClass("support").addClass("unsupport");

				onresize();

				$(window).bind("resize", function(){
					onresize();
				});
			}

			$(document.body).bind("mousewheel DOMMouseScroll", function(e){

				if(isSupport){
					e.preventDefault(); 
					e.stopPropagation(); 
				}

				if(isAnimating === true){ 
					return; 
				} 

				isAnimating = true;

				var evt = fixMousewheel(e);

				pageActived = pageActive;

				if(evt.delta >= 0){
					pageActive--;
				} else {
					pageActive++;
				}

				if(pageActive > pageCount){
					if(loop){
						pageActive = 1;
					} else {
						pageActive = pageCount;
					}
				}

				if(pageActive < 1){
					if(loop){
						pageActive = pageCount;
					} else {
						pageActive = 1;
					}
				}

				pageChange();
			});

			$pagenav.find("li").bind("click", function(){

				if(isAnimating === true){ 
					return; 
				} 

				isAnimating = true;

				pageActive = $(this).index() + 1;
				pageActived = $pagenav.find(".active").index() + 1;

				pageChange();
			});

			$pagenav.find(".prev").bind("click", function(){

				if(isAnimating === true){ 
					return; 
				} 

				isAnimating = true;

				pageActived = pageActive
				pageActive --;

				pageChange();
			});

			$pagenav.find(".next").bind("click", function(){

				if(isAnimating === true){ 
					return; 
				} 

				isAnimating = true;

				pageActived = pageActive
				pageActive ++;

				pageChange();
			});

			checkPager();

			$pageview.eq(0).addClass("active");
		}
	}
})();

$(function(){
	Effect.init({
		pageview : ".pageview",
		pagenav : ".pagenav",
		container : ".container"
	});
})