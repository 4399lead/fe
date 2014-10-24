/**
* EasyDrag 1.4 - Drag & Drop jQuery Plug-in
*
* Thanks for the community that is helping the improvement
* of this little piece of code.
*
* For usage instructions please visit http://fromvega.com
*/

(function($){
	var isMouseDown    = false;
	var currentElement = null;

	var dropCallbacks = {};
	var dragCallbacks = {};
	var dragOnCallbacks = {};

	var lastMouseX;
	var lastMouseY;
	var lastElemTop;
	var lastElemLeft;
	
	var zindex = 1000;
	var dragStatus = {};	


	function getMousePosition(e){
		var posx = 0;
		var posy = 0;

		if (!e) var e = window.event;

		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
		}

		return { 'x': posx, 'y': posy };
	};

	function updatePosition(e) {
		var options = $(currentElement).data("drag_options");
				
		if ($(currentElement).css("position") == "fixed"){
			options.boundary = $(window);	
		}
		var margin_left = parseInt($(currentElement).css("margin-left"));
		var margin_top = parseInt($(currentElement).css("margin-top"));
		var pos = getMousePosition(e);
		var $boundary = options.boundary;
		var spanX = (pos.x - lastMouseX);
		var spanY = (pos.y - lastMouseY);
		var width = $(currentElement).width();
		var height = $(currentElement).height();
		var v_width = $boundary.width();
		var v_height = $boundary.height();
		var left = lastElemLeft + spanX;
		var top = lastElemTop + spanY;
        
		if (left < 0){
			left = 0;
		}
		
		if (left + width > v_width){
			left = v_width - width;
		}
		
		if (top < 0){
			top = 0;
		}
		
		if (top + height > v_height){
			top = v_height - height;
		}
		
		left -= margin_left;
		top -= margin_top;
		
		//$(currentElement).css({"margin-left":0,"margin-top":0});
		
		if (/[\d.]+%/.test($(currentElement).css("top"))){
			$(currentElement).css("top",  top / v_height * 100 + "%");
		} else {
			$(currentElement).css("top",  top);
		}
		if (/[\d.]+%/.test($(currentElement).css("left"))){
			$(currentElement).css("left", left / v_width * 100 + "%");
		} else {
			$(currentElement).css("left", left);
		}
	};

	$(document).mousemove(function(e){
		if(isMouseDown && dragStatus[currentElement.id] == 'on'){
			updatePosition(e);
			if(dragCallbacks[currentElement.id] != undefined){
				dragCallbacks[currentElement.id](e, currentElement);
			}

			return false;
		}
	});

	$(document).mouseup(function(e){
		if(isMouseDown && dragStatus[currentElement.id] == 'on'){
			isMouseDown = false;
			$(currentElement).attr("status","");
			if(dropCallbacks[currentElement.id] != undefined){
				dropCallbacks[currentElement.id](e, currentElement);
			}

			return false;
		}
	});

	function easydrag(options){
		var defaults = {
			boundary : $(document.body),
			target : $(),
			bubble : false,
			hock : $(),
			ondrag : function(){},
			ondrop : function(){},
			dragOn : function(){}
		};
		
		this.options = options = $.extend(defaults, options);
		if (options.hock.length == 0){
			options.hock = options.target;
		}	
		this.init();
	}
	
	easydrag.prototype = {
		init : function(){
			var _this = this,
				options = this.options,
				$target = options.target.eq(0),
				$hock = options.hock.eq(0),
				$boundary = options.boundary,
				target = options.target[0],
				bubble = options.bubble;
			
			
			if(undefined == target.id || !target.id.length) target.id = "easydrag"+(new Date().getTime() + Math.random());
			dragStatus[target.id] = "on";
			dragCallbacks[target.id] = options.ondrag;
			dropCallbacks[target.id] = options.ondrop;
			dragOnCallbacks[target.id] = options.dragOn;
			$target.data("drag_options", options);
			$hock.css("cursor", "move");
			
			$hock.mousedown(function(e){
				if (e.button == 2) return bubble ? true : false;
				
				if($target.css("position") == "static"){
					$target.css("position", "absolute");
					//$target.css("z-index", ++zindex);
				}
				
				isMouseDown    = true;
				currentElement = target;
				
				$(currentElement).attr('status','on');
				dragOnCallbacks[target.id](e, currentElement);
	
				var pos    = getMousePosition(e);
				lastMouseX = pos.x ;
				lastMouseY = pos.y ; 
	
				lastElemTop  = target.offsetTop ;
				lastElemLeft = target.offsetLeft ;
	
				updatePosition(e);
	
				return bubble ? true : false;
			});
		}
	}
	
	window.ue = window.ue || {};
	
	ue.easydrag = function(options){
		return new easydrag(options);
	}
})(jQuery);