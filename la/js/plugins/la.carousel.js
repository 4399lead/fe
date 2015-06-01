!function () {
    function t(t, e) {
        this.element = $(t), this.options = e, this._container = this.element.children("ul"), this._originalPanes =
            this._container.children("li"), this._currentPaneIndex = 0, this._paneWidth = 0, this._autoScrollTimer = 0,
            this._autoScrolling = !1;

		this._init();
    }
    t.prototype = {
        _init: function () {
            this._insertPanes(), this._insertIndicator(), this._adjustContainerOffset(!0), this._panes.show(), this._updateIndicator(),
                this._setPaneDimensions(), this._bindEvent()
        },
        enableAutoScroll: function () {
            var t = this;
            this._autoScrolling || (this.disableAutoScroll(), this._autoScrollTimer = setInterval(function () {
                t.next()
            }, 3e3), this._autoScrolling = !0)
        },
        disableAutoScroll: function () {
            this._autoScrolling && (clearInterval(this._autoScrollTimer), this._autoScrolling = !1)
        },
        _insertPanes: function () {
            var t = this._originalPanes,
                e = t[0].cloneNode(!0),
                n = t[t.length - 1].cloneNode(!0);
            this._container.append(e).prepend(n), this._panes = this._container.children("li"), this._paneCount = this._panes
                .length
        },
        _insertIndicator: function () {
            for (var t = $("<span></span>").addClass("indicator"), e = 0, n = this._originalPanes.length; n >
                e; e++) t.append("<a></a>");
            this._indicators = t.children("a"), this.element.append(t)
        },
        _adjustContainerOffset: function (t) {
            t && this._showPane(1), this._currentPaneIndex === this._panes.length - 1 && this._showPane(1), 0 === this._currentPaneIndex &&
                this._showPane(this._panes.length - 2)
        },
        _updateIndicator: function () {
            var t = this._indicators,
                e = this._currentPaneIndex - 1;
            t.removeClass("ctl-active"), $(t[e]).addClass("ctl-active")
        },
        _setPaneDimensions: function () {
            var t = window.innerWidth || document.documentElement.clientWidth,
                e = this._panes;

            this._paneWidth = t, e.width(t + "px"), this._container.width(e.length * t)
            
        },
        _bindEvent: function () {
            var t, e = this,
                n = "onorientationchange" in window ? "orientationchange" : "resize";
            $(window).on("load " + n, function () {
                e.disableAutoScroll(), clearTimeout(t), t = setTimeout(function () {
                    e._setPaneDimensions(), e.enableAutoScroll()
                }, 1000)
            }), new Hammer(this.element[0], {
                swipe: !1,
                drag_block_vertical: !1,
                drag_lock_to_axis: !0
            }).on("release dragleft dragright", function (t) {
                e._handleHammer(t)
            }), this._container.on("webkitTransitionEnd", function () {
                e._adjustContainerOffset(), e._updateIndicator()
            })
        },
        _setContainerOffset: function (t, e) {
            var n = this._container,
                i = "translate3d(" + t + "%,0,0) scale3d(1,1,1)";
            n.removeClass("ctl-animate"), e && n.addClass("ctl-animate"), n.css("-webkit-transform", i)
        },
        _showPane: function (t, e) {
            t = Math.max(0, Math.min(t, this._paneCount - 1)), this._currentPaneIndex = t;
            var n = -(100 / this._paneCount * this._currentPaneIndex);
            this._setContainerOffset(n, e)
        },
        next: function () {
            this.disableAutoScroll(), this._showPane(this._currentPaneIndex + 1, !0), this.enableAutoScroll()
        },
        prev: function () {
            this.disableAutoScroll(), this._showPane(this._currentPaneIndex - 1, !0), this.enableAutoScroll()
        },
        _handleHammer: function (t) {
            switch (this.disableAutoScroll(), t.type) {
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
                    this._showPane(this._currentPaneIndex, !0), this.enableAutoScroll()
            }
        }
    };

	window.La = window.La || {};
    La.carousel = t;
}();