!function() {    
    function slide(element, options) {
        if(this.constructor != slide){
            return new slide(element, options);
        }

        this.options = options;

        this.element = $(element);
        this._container = this.element.find("ul");
        this._panes = this._container.children("li");
        this._paneCount = this._panes.length;
        this._currentPaneIndex = 0;
        this._paneWidth = 0;
        this._step = 0;
        this._init();    
    }
    
    slide.prototype = {
        constructor : slide,
                
        _init: function() {            
            this._panes.show();
            this._setPaneDimensions();
            this._bindEvent();     
        },

        _setPaneDimensions: function() {            
            var v_width = window.innerWidth || document.documentElement.clientWidth,
                panes = this._panes, 
                options = this.options;

            this._step = Math.floor(v_width / (options.width + options.margin));
            this._maxScrollNum = this._paneCount - this._step;
            this._fullWidth = this._paneCount * (options.width + options.margin);
            this._paneWidth = v_width;
            this._container.width(this._fullWidth);
            this._maxLeft = (this._fullWidth - v_width + 2 * options.padding - options.margin) / this._fullWidth * 100;
            this.slideTo(this._currentPaneIndex, true);      
        },
        
        _bindEvent: function() {            
            var that = this,
                resize_timer,
                resize_event = "onorientationchange" in window ? "orientationchange": "resize";

            $(window).on("load " + resize_event, function() {                
                clearTimeout(resize_timer),
                resize_timer = setTimeout(function() {                    
                    that._setPaneDimensions()                
                },
                500)
            });

            new Hammer(this.element[0], {                
                swipe: false,
                drag_block_vertical: false,
                drag_lock_to_axis: true     
            }).on("release dragleft dragright", function(t) {                
                that._handleHammer(t)            
            });    
        },
        
        slideTo: function(index, animate) {
            var container = this._container,
                style,
                translate;
                     
            index = Math.max(0, Math.min(index, this._maxScrollNum));
            this._currentPaneIndex = index;            
            translate = -(100 / this._paneCount * this._currentPaneIndex);
            translate = Math.max(-this._maxLeft, Math.min(translate, 0));

            style = "translate3d(" + translate + "%,0,0) scale3d(1,1,1)"            
            
            container.removeClass("ctl-animate");

            setTimeout(function(){
                animate && container.addClass("ctl-animate");
                container.css("-webkit-transform", style); 
            }, 0);  
        },
        
        next: function() {
            this.slideTo(this._currentPaneIndex + this._step, true);   
        },
        
        prev: function() {          
            this.slideTo(this._currentPaneIndex - this._step, true);     
        },
        
        _handleHammer: function(evt) {
            var container = this._container;
            var style;
                        
            switch (evt.type) {            
            case "dragright":       
            case "dragleft":
                evt.gesture.preventDefault();                
                var e = -this._currentPaneIndex / this._paneCount * 100 ,
                    n =  evt.gesture.deltaX / this._paneWidth / this._paneCount * 100 ;                
                
                style = "translate3d(" + (n + e) + "%,0,0) scale3d(1,1,1)";
                
                container.removeClass("ctl-animate");
                container.css("-webkit-transform", style);
                            
                break;            
            case "release":
                if( evt.timeStamp - evt.gesture.startEvent.timeStamp < 400 && Math.abs(evt.gesture.deltaX) > 20 || Math.abs(evt.gesture.deltaX) > this._paneWidth / 2 ){
                    
                    evt.gesture.preventDefault();

                    if( "right" == evt.gesture.direction ){
                        this.prev();
                    } else if( "left" == evt.gesture.direction ){
                        this.next();
                    } else {
                        this.slideTo(this._currentPaneIndex, true);
                    }
                } else {
                    this.slideTo(this._currentPaneIndex, true)
                }           
            }
                    
        }  
    };

    window.La = window.La || {};
    La.slide = slide;
} ();