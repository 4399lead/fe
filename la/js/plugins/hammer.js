! function (e, t) {
    "use strict";
 
    function n() {
        i.READY || (f.determineEventTypes(), d.each(i.gestures, function (e) {
            T.register(e)
        }), f.onTouch(i.DOCUMENT, p, T.detect), f.onTouch(i.DOCUMENT, g, T.detect), i.READY = !0)
    }
    var i = function (e, t) {
        return new i.Instance(e, t || {})
    };
    i.VERSION = "1.0.9", i.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    }, i.HAS_POINTEREVENTS = e.navigator.pointerEnabled || e.navigator.msPointerEnabled, i.HAS_TOUCHEVENTS =
        "ontouchstart" in e, i.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i, i.NO_MOUSEEVENTS = i.HAS_TOUCHEVENTS &&
        e.navigator.userAgent.match(i.MOBILE_REGEX), i.EVENT_TYPES = {}, i.UPDATE_VELOCITY_INTERVAL = 16, i.DOCUMENT =
        e.document;
    var r = i.DIRECTION_DOWN = "down",
        a = i.DIRECTION_LEFT = "left",
        s = i.DIRECTION_UP = "up",
        o = i.DIRECTION_RIGHT = "right",
        c = i.POINTER_MOUSE = "mouse",
        u = i.POINTER_TOUCH = "touch",
        h = i.POINTER_PEN = "pen",
        l = i.EVENT_START = "start",
        p = i.EVENT_MOVE = "move",
        g = i.EVENT_END = "end";
    i.plugins = i.plugins || {}, i.gestures = i.gestures || {}, i.READY = !1;
    var d = i.utils = {
        extend: function (e, n, i) {
            for (var r in n) e[r] !== t && i || (e[r] = n[r]);
            return e
        },
        each: function (e, n, i) {
            var r, a;
            if ("forEach" in e) e.forEach(n, i);
            else if (e.length !== t) {
                for (r = -1; a = e[++r];) if (n.call(i, a, r, e) === !1) return
            } else for (r in e) if (e.hasOwnProperty(r) && n.call(i, e[r], r, e) === !1) return
        },
        hasParent: function (e, t) {
            for (; e;) {
                if (e == t) return !0;
                e = e.parentNode
            }
            return !1
        },
        getCenter: function (e) {
            var t = [],
                n = [];
            return d.each(e, function (e) {
                t.push("undefined" != typeof e.clientX ? e.clientX : e.pageX), n.push("undefined" != typeof e.clientY ?
                    e.clientY : e.pageY)
            }), {
                pageX: (Math.min.apply(Math, t) + Math.max.apply(Math, t)) / 2,
                pageY: (Math.min.apply(Math, n) + Math.max.apply(Math, n)) / 2
            }
        },
        getVelocity: function (e, t, n) {
            return {
                x: Math.abs(t / e) || 0,
                y: Math.abs(n / e) || 0
            }
        },
        getAngle: function (e, t) {
            var n = t.pageY - e.pageY,
                i = t.pageX - e.pageX;
            return 180 * Math.atan2(n, i) / Math.PI
        },
        getDirection: function (e, t) {
            var n = Math.abs(e.pageX - t.pageX),
                i = Math.abs(e.pageY - t.pageY);
            return n >= i ? e.pageX - t.pageX > 0 ? a : o : e.pageY - t.pageY > 0 ? s : r
        },
        getDistance: function (e, t) {
            var n = t.pageX - e.pageX,
                i = t.pageY - e.pageY;
            return Math.sqrt(n * n + i * i)
        },
        getScale: function (e, t) {
            return e.length >= 2 && t.length >= 2 ? this.getDistance(t[0], t[1]) / this.getDistance(e[0], e[1]) : 1
        },
        getRotation: function (e, t) {
            return e.length >= 2 && t.length >= 2 ? this.getAngle(t[1], t[0]) - this.getAngle(e[1], e[0]) : 0
        },
        isVertical: function (e) {
            return e == s || e == r
        },
        toggleDefaultBehavior: function (e, t, n) {
            if (t && e && e.style) {
                d.each(["webkit", "moz", "Moz", "ms", "o", ""], function (i) {
                    d.each(t, function (t, r) {
                        i && (r = i + r.substring(0, 1).toUpperCase() + r.substring(1)), r in e.style && (e.style[r] = !
                            n && t)
                    })
                });
                var i = function () {
                    return !1
                };
                "none" == t.userSelect && (e.onselectstart = !n && i), "none" == t.userDrag && (e.ondragstart = !n && i)
            }
        }
    };
    i.Instance = function (e, t) {
        var r = this;
        return n(), this.element = e, this.enabled = !0, this.options = d.extend(d.extend({}, i.defaults), t || {}),
            this.options.stop_browser_behavior && d.toggleDefaultBehavior(this.element, this.options.stop_browser_behavior, !
            1), this.eventStartHandler = f.onTouch(e, l, function (e) {
            r.enabled && T.startDetect(r, e)
        }), this.eventHandlers = [], this
    }, i.Instance.prototype = {
        on: function (e, t) {
            var n = e.split(" ");
            return d.each(n, function (e) {
                this.element.addEventListener(e, t, !1), this.eventHandlers.push({
                    gesture: e,
                    handler: t
                })
            }, this), this
        },
        off: function (e, t) {
            var n, i, r = e.split(" ");
            return d.each(r, function (e) {
                for (this.element.removeEventListener(e, t, !1), n = -1; i = this.eventHandlers[++n];) i.gesture === e &&
                        i.handler === t && this.eventHandlers.splice(n, 1)
            }, this), this
        },
        trigger: function (e, t) {
            t || (t = {});
            var n = i.DOCUMENT.createEvent("Event");
            n.initEvent(e, !0, !0), n.gesture = t;
            var r = this.element;
            return d.hasParent(t.target, r) && (r = t.target), r.dispatchEvent(n), this
        },
        enable: function (e) {
            return this.enabled = e, this
        },
        dispose: function () {
            var e, t;
            for (this.options.stop_browser_behavior && d.toggleDefaultBehavior(this.element, this.options.stop_browser_behavior, !
                0), e = -1; t = this.eventHandlers[++e];) this.element.removeEventListener(t.gesture, t.handler, !1);
            return this.eventHandlers = [], f.unbindDom(this.element, i.EVENT_TYPES[l], this.eventStartHandler), null
        }
    };
    var m = null,
        v = !1,
        _ = !1,
        f = i.event = {
            bindDom: function (e, t, n) {
                var i = t.split(" ");
                d.each(i, function (t) {
                    e.addEventListener(t, n, !1)
                })
            },
            unbindDom: function (e, t, n) {
                var i = t.split(" ");
                d.each(i, function (t) {
                    e.removeEventListener(t, n, !1)
                })
            },
            onTouch: function (e, t, n) {
                var r = this,
                    a = function (a) {
                        var s = a.type.toLowerCase();
                        if (!s.match(/mouse/) || !_) {
                            s.match(/touch/) || s.match(/pointerdown/) || s.match(/mouse/) && 1 === a.which ? v = !0 :
                                s.match(/mouse/) && !a.which && (v = !1), s.match(/touch|pointer/) && (_ = !0);
                            var o = 0;
                            v && (i.HAS_POINTEREVENTS && t != g ? o = E.updatePointer(t, a) : s.match(/touch/) ? o = a.touches
                                .length : _ || (o = s.match(/up/) ? 0 : 1), o > 0 && t == g ? t = p : o || (t = g), (o ||
                                null === m) && (m = a), n.call(T, r.collectEventData(e, t, r.getTouchList(m, t), a)), i
                                .HAS_POINTEREVENTS && t == g && (o = E.updatePointer(t, a))), o || (m = null, v = !1, _ = !
                                1, E.reset())
                        }
                    };
                return this.bindDom(e, i.EVENT_TYPES[t], a), a
            },
            determineEventTypes: function () {
                var e;
                e = i.HAS_POINTEREVENTS ? E.getEvents() : i.NO_MOUSEEVENTS ? ["touchstart", "touchmove",
                        "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove",
                        "touchend touchcancel mouseup"], i.EVENT_TYPES[l] = e[0], i.EVENT_TYPES[p] = e[1], i.EVENT_TYPES[
                    g] = e[2]
            },
            getTouchList: function (e) {
                return i.HAS_POINTEREVENTS ? E.getTouchList() : e.touches ? e.touches : (e.identifier = 1, [e])
            },
            collectEventData: function (e, t, n, i) {
                var r = u;
                return (i.type.match(/mouse/) || E.matchType(c, i)) && (r = c), {
                    center: d.getCenter(n),
                    timeStamp: (new Date).getTime(),
                    target: i.target,
                    touches: n,
                    eventType: t,
                    pointerType: r,
                    srcEvent: i,
                    preventDefault: function () {
                        this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault &&
                            this.srcEvent.preventDefault()
                    },
                    stopPropagation: function () {
                        this.srcEvent.stopPropagation()
                    },
                    stopDetect: function () {
                        return T.stopDetect()
                    }
                }
            }
        }, E = i.PointerEvent = {
            pointers: {},
            getTouchList: function () {
                var e = [];
                return d.each(this.pointers, function (t) {
                    e.push(t)
                }), e
            },
            updatePointer: function (e, t) {
                return e == g ? delete this.pointers[t.pointerId] : (t.identifier = t.pointerId, this.pointers[t.pointerId] =
                    t), Object.keys(this.pointers).length
            },
            matchType: function (e, t) {
                if (!t.pointerType) return !1;
                var n = t.pointerType,
                    i = {};
                return i[c] = n === c, i[u] = n === u, i[h] = n === h, i[e]
            },
            getEvents: function () {
                return ["pointerdown MSPointerDown", "pointermove MSPointerMove",
                    "pointerup pointercancel MSPointerUp MSPointerCancel"]
            },
            reset: function () {
                this.pointers = {}
            }
        }, T = i.detection = {
            gestures: [],
            current: null,
            previous: null,
            stopped: !1,
            startDetect: function (e, t) {
                this.current || (this.stopped = !1, this.current = {
                    inst: e,
                    startEvent: d.extend({}, t),
                    lastEvent: !1,
                    lastVelocityEvent: !1,
                    velocity: !1,
                    name: ""
                }, this.detect(t))
            },
            detect: function (e) {
                if (this.current && !this.stopped) {
                    e = this.extendEventData(e);
                    var t = this.current.inst.options;
                    return d.each(this.gestures, function (n) {
                        return this.stopped || t[n.name] === !1 || n.handler.call(n, e, this.current.inst) !== !1 ?
                            void 0 : (this.stopDetect(), !1)
                    }, this), this.current && (this.current.lastEvent = e), e.eventType == g && !e.touches.length - 1 &&
                        this.stopDetect(), e
                }
            },
            stopDetect: function () {
                this.previous = d.extend({}, this.current), this.current = null, this.stopped = !0
            },
            extendEventData: function (e) {
                var t = this.current,
                    n = t.startEvent;
                (e.touches.length != n.touches.length || e.touches === n.touches) && (n.touches = [], d.each(e.touches, function (
                    e) {
                    n.touches.push(d.extend({}, e))
                }));
                var r, a, s = e.timeStamp - n.timeStamp,
                    o = e.center.pageX - n.center.pageX,
                    c = e.center.pageY - n.center.pageY,
                    u = t.lastVelocityEvent,
                    h = t.velocity;
                return u && e.timeStamp - u.timeStamp > i.UPDATE_VELOCITY_INTERVAL ? (h = d.getVelocity(e.timeStamp - u
                    .timeStamp, e.center.pageX - u.center.pageX, e.center.pageY - u.center.pageY), t.lastVelocityEvent =
                    e, t.velocity = h) : t.velocity || (h = d.getVelocity(s, o, c), t.lastVelocityEvent = e, t.velocity =
                    h), e.eventType == g ? (r = t.lastEvent && t.lastEvent.interimAngle, a = t.lastEvent && t.lastEvent
                    .interimDirection) : (r = t.lastEvent && d.getAngle(t.lastEvent.center, e.center), a = t.lastEvent &&
                    d.getDirection(t.lastEvent.center, e.center)), d.extend(e, {
                    deltaTime: s,
                    deltaX: o,
                    deltaY: c,
                    velocityX: h.x,
                    velocityY: h.y,
                    distance: d.getDistance(n.center, e.center),
                    angle: d.getAngle(n.center, e.center),
                    interimAngle: r,
                    direction: d.getDirection(n.center, e.center),
                    interimDirection: a,
                    scale: d.getScale(n.touches, e.touches),
                    rotation: d.getRotation(n.touches, e.touches),
                    startEvent: n
                }), e
            },
            register: function (e) {
                var n = e.defaults || {};
                return n[e.name] === t && (n[e.name] = !0), d.extend(i.defaults, n, !0), e.index = e.index || 1e3, this
                    .gestures.push(e), this.gestures.sort(function (e, t) {
                    return e.index < t.index ? -1 : e.index > t.index ? 1 : 0
                }), this.gestures
            }
        };
    i.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            correct_for_drag_min_distance: !0,
            drag_max_touches: 1,
            drag_block_horizontal: !1,
            drag_block_vertical: !1,
            drag_lock_to_axis: !1,
            drag_lock_min_distance: 25
        },
        triggered: !1,
        handler: function (e, t) {
            if (T.current.name != this.name && this.triggered) return t.trigger(this.name + "end", e), void(this.triggered = !
                    1);
            if (!(t.options.drag_max_touches > 0 && e.touches.length > t.options.drag_max_touches)) switch (e.eventType) {
                case l:
                    this.triggered = !1;
                    break;
                case p:
                    if (e.distance < t.options.drag_min_distance && T.current.name != this.name) return;
                    if (T.current.name != this.name && (T.current.name = this.name, t.options.correct_for_drag_min_distance &&
                        e.distance > 0)) {
                        var n = Math.abs(t.options.drag_min_distance / e.distance);
                        T.current.startEvent.center.pageX += e.deltaX * n, T.current.startEvent.center.pageY += e.deltaY *
                            n, e = T.extendEventData(e)
                    }(T.current.lastEvent.drag_locked_to_axis || t.options.drag_lock_to_axis && t.options.drag_lock_min_distance <=
                        e.distance) && (e.drag_locked_to_axis = !0);
                    var i = T.current.lastEvent.direction;
                    e.drag_locked_to_axis && i !== e.direction && (e.direction = d.isVertical(i) ? e.deltaY < 0 ? s : r :
                        e.deltaX < 0 ? a : o), this.triggered || (t.trigger(this.name + "start", e), this.triggered = !
                        0), t.trigger(this.name, e), t.trigger(this.name + e.direction, e);
                    var c = d.isVertical(e.direction);
                    (t.options.drag_block_vertical && c || t.options.drag_block_horizontal && !c) && e.preventDefault();
                    break;
                case g:
                    this.triggered && t.trigger(this.name + "end", e), this.triggered = !1
            }
        }
    }, i.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {
            hold_timeout: 500,
            hold_threshold: 1
        },
        timer: null,
        handler: function (e, t) {
            switch (e.eventType) {
            case l:
                clearTimeout(this.timer), T.current.name = this.name, this.timer = setTimeout(function () {
                    "hold" == T.current.name && t.trigger("hold", e)
                }, t.options.hold_timeout);
                break;
            case p:
                e.distance > t.options.hold_threshold && clearTimeout(this.timer);
                break;
            case g:
                clearTimeout(this.timer)
            }
        }
    }, i.gestures.Release = {
        name: "release",
        index: 1 / 0,
        handler: function (e, t) {
            e.eventType == g && t.trigger(this.name, e)
        }
    }, i.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {
            swipe_min_touches: 1,
            swipe_max_touches: 1,
            swipe_velocity: .7
        },
        handler: function (e, t) {
            if (e.eventType == g) {
                if (e.touches.length < t.options.swipe_min_touches || e.touches.length > t.options.swipe_max_touches)
                    return;
                (e.velocityX > t.options.swipe_velocity || e.velocityY > t.options.swipe_velocity) && (t.trigger(this.name,
                    e), t.trigger(this.name + e.direction, e))
            }
        }
    }, i.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: !0,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        has_moved: !1,
        handler: function (e, t) {
            var n, i, r;
            e.eventType == l ? this.has_moved = !1 : e.eventType != p || this.moved ? e.eventType == g && "touchcancel" !=
                e.srcEvent.type && e.deltaTime < t.options.tap_max_touchtime && !this.has_moved && (n = T.previous, i =
                n && n.lastEvent && e.timeStamp - n.lastEvent.timeStamp, r = !1, n && "tap" == n.name && i && i < t.options
                .doubletap_interval && e.distance < t.options.doubletap_distance && (t.trigger("doubletap", e), r = !0), (!
                r || t.options.tap_always) && (T.current.name = "tap", t.trigger(T.current.name, e))) : this.has_moved =
                e.distance > t.options.tap_max_distance
        }
    }, i.gestures.Touch = {
        name: "touch",
        index: -1 / 0,
        defaults: {
            prevent_default: !1,
            prevent_mouseevents: !1
        },
        handler: function (e, t) {
            return t.options.prevent_mouseevents && e.pointerType == c ? void e.stopDetect() : (t.options.prevent_default &&
                e.preventDefault(), void(e.eventType == l && t.trigger(this.name, e)))
        }
    }, i.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {
            transform_min_scale: .01,
            transform_min_rotation: 1,
            transform_always_block: !1,
            transform_within_instance: !1
        },
        triggered: !1,
        handler: function (e, t) {
            if (T.current.name != this.name && this.triggered) return t.trigger(this.name + "end", e), void(this.triggered = !
                    1);
            if (!(e.touches.length < 2)) {
                if (t.options.transform_always_block && e.preventDefault(), t.options.transform_within_instance) for (
                        var n = -1; e.touches[++n];) if (!d.hasParent(e.touches[n].target, t.element)) return;
                switch (e.eventType) {
                case l:
                    this.triggered = !1;
                    break;
                case p:
                    var i = Math.abs(1 - e.scale),
                        r = Math.abs(e.rotation);
                    if (i < t.options.transform_min_scale && r < t.options.transform_min_rotation) return;
                    T.current.name = this.name, this.triggered || (t.trigger(this.name + "start", e), this.triggered = !
                        0), t.trigger(this.name, e), r > t.options.transform_min_rotation && t.trigger("rotate", e), i >
                        t.options.transform_min_scale && (t.trigger("pinch", e), t.trigger("pinch" + (e.scale < 1 ?
                        "in" : "out"), e));
                    break;
                case g:
                    this.triggered && t.trigger(this.name + "end", e), this.triggered = !1
                }
            }
        }
    }, e.Hammer = i
}(window);