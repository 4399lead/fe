var Effect = (function(){
	
	var isSupport = true;
	var isAnimating = false;
	var pageActive = 1;
	var pageCount = 5;
	var pageActived;
	var $pagenav;
	var $pageview;
	var loop;

	function support(){
		isSupport = true; 
	}

	function unsupport(){
		isSupport = false; 
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

	support();

	return {
		isSupport : isSupport,

		init : function(options){
			$pagenav = $(options.pagenav);
			$pageview = $(options.pageview);
			loop = options.loop === true ? true : false;

			if(isSupport){

				//$("body").removeClass("unsupport").addClass("support");

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

				document.addEventListener("touchmove", function(e){
					e.preventDefault();
				});

				$pageview.eq(0).addClass("active");
			} else {
				$("body").removeClass("support").addClass("unsupport");
			}
		}
	}
})();

var Resource = {
	sounds: {},
	silent : false,
	//Sounds
	addSound: function(name, src, maxChannels, volume) {
		this.sounds[name] = [];
		this.sounds[name].index = 0;
		if (!maxChannels) {
			maxChannels = 3;
		}
		for (var i = 0; i < maxChannels; i++) {
			this.sounds[name][i] = new Audio(src);
			this.sounds[name][i].volume = volume || 1;
		}
		return this;
	},
	
	clearSounds: function() {
		delete this.sounds;
		this.sounds = {};
		return this;
	},
	
	removeSound: function(name) {
		delete this.sounds[name];
		return this;
	},
	
	playSound: function(name, loop) {
		if (this.silent) return;
		if (this.sounds[name].index >= this.sounds[name].length) {
			this.sounds[name].index = 0;	
		}
		if (loop) {
			this.sounds[name][this.sounds[name].index].addEventListener("ended", this.loopCallback, false);
		}
		this.sounds[name][this.sounds[name].index++].play();
		return this.sounds[name].index;
	},
	
	pauseChannel: function(name, index) {
		if (!this.sounds[name][index].paused) {
			this.sounds[name][index].pause();
		}
		return this;
	},
	
	pauseSound: function(name) {
		for (var i = 0; i < this.sounds[name].length; i++) {
			if (!this.sounds[name][i].paused) {
				this.sounds[name][i].pause();
			}
		}
		return this;
	},
	
	resetChannel: function(name, index) {
		this.sounds[name][index].currentTime = 0;
		this.stopLoop(name, index);
		return this;
	},
	
	resetSound: function(name) {
		for (var i = 0; i < this.sounds[name].length; i++) {
			this.sounds[name].currentTime = 0;
			this.stopLoop(name, i);
		}
		return this;
	},
	
	stopLoop: function(name, index) {
		this.sounds[name][index].removeEventListener("ended", this.loopCallback, false);	
	},
	
	loopCallback: function() {
		this.currentTime = -1;
		this.play();
	}
}

$(function(){
	Effect.init({
		pageview : ".pageview",
		pagenav : ".pagenav"
	});

	/*Resource.addSound("Sugar", "images/Sugar.mp3",1, .5);

	var is_music_play = false;

	$(".music").bind("click", function(){
		if(is_music_play){
			is_music_play = false;
			$(this).removeClass("on").addClass("off");
			Resource.pauseSound("Sugar");
		} else {
			is_music_play = true;
			$(this).removeClass("off").addClass("on");
			Resource.playSound("Sugar", 1);
		}
	});

	var is_music_init = false;

	$(".music").trigger("click");

	$(document).bind("touchstart.music mousedown.music", function(){
		if(is_music_init){return}
		is_music_init = true;
		is_music_play = true;
		$(".music").removeClass("off").addClass("on");
		Resource.playSound("Sugar", 1);
		$(document).unbind("touchstart.music mousedown.music");
	});*/
})