!function () {
    function t(t, e) {
        this.element = $(t), this.options = e, this._container = this.element.find("ul"), this._originalPanes =
            this._container.children("li"), this._currentPaneIndex = 0, this._paneWidth = 0,this._scrollNum = 0;
    }
    t.prototype = {
        _init: function () {
            this._insertPanes(), this._panes.show(),
                this._setPaneDimensions(), this._bindEvent()
        },
        
        _insertPanes: function () {
            var t = this._originalPanes;
            this._panes = this._container.children("li"), this._paneCount = this._panes
                .length
        },
       
        _setPaneDimensions: function () {
            var t = window.innerWidth || document.documentElement.clientWidth,
                e = this._panes,
				options = this.options;

			this._scrollNum = Math.floor(t / (options.width + options.margin));
			this._maxScrollNum =  this._originalPanes.length - this._scrollNum;
			this.fullWidth = e.length * (options.width + options.margin);
            this._paneWidth = t,  this._container.width(this.fullWidth)
            
			this._maxLeft = (this.fullWidth - t + 2 * options.margin) / this.fullWidth * 100;

			if(this._currentPaneIndex > this._maxScrollNum){
				this._showPane(this._maxScrollNum, false);
			}
        },

 _adjustContainerOffset: function (t) {
	
        },
        _bindEvent: function () {
            var t, e = this,
                n = "onorientationchange" in window ? "orientationchange" : "resize";
            $(window).on("load " + n, function () {
                clearTimeout(t), t = setTimeout(function () {
                    e._setPaneDimensions()
                }, 1000)
            }), new Hammer(this.element[0], {
                swipe: !1,
                drag_block_vertical: !1,
                drag_lock_to_axis: !0
            }).on("release dragleft dragright", function (t) {
                e._handleHammer(t)
            }), this._container.on("webkitTransitionEnd transitionend", function () {
                e._adjustContainerOffset()
            })
        },
        _setContainerOffset: function (t, e) {

			if(t < -this._maxLeft){
				t = -this._maxLeft;
			}

			if(t>0){
				t = 0;
			}

            var n = this._container,
                i = "translate3d(" + t + "%,0,0) scale3d(1,1,1)";
            n.removeClass("animate"), e && n.addClass("animate"), n.css("-webkit-transform", i), n.css("transform", i)
        },
        _showPane: function (t, e) {
            t = Math.max(0, Math.min(t, this._paneCount - 1)), this._currentPaneIndex = t;
            var n = -(100 / this._paneCount * this._currentPaneIndex);
            this._setContainerOffset(n, e)
        },
        next: function () {
			var scrollNum = this._currentPaneIndex + this._scrollNum;
			if(scrollNum > this._maxScrollNum){
				scrollNum = this._maxScrollNum;
			}
            this._showPane(scrollNum, !0)
        },
        prev: function () {
			var scrollNum = this._currentPaneIndex - this._scrollNum;

            this._showPane(scrollNum, !0)
        },
        _handleHammer: function (t) {
            switch (t.type) {
            case "dragright":
            case "dragleft":
                t.gesture.preventDefault();
                var e = -(100 / this._paneCount) * this._currentPaneIndex,
                    n = 100 / this._paneWidth * t.gesture.deltaX / this._paneCount;
                this._setContainerOffset(n + e);
                break;
            case "release":
                t.timeStamp - t.gesture.startEvent.timeStamp < 400 && Math.abs(t.gesture.deltaX) > 20 || Math.abs(t.gesture
                    .deltaX) > this._paneWidth / 2 ? (t.gesture.preventDefault(), "right" == t.gesture.direction ? this
                    .prev() : "left" == t.gesture.direction ? this.next() : this._showPane(this._currentPaneIndex, !0)) :
                    this._showPane(this._currentPaneIndex, !0)
            }
        }
    }, $.slide = function (e, n) {
        $(e).each(function (e, i) {
            var a = new t(i, n);
            a._init()
        })
    }
}();