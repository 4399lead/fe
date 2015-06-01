<<<<<<< HEAD
var ACTIVITY = window.ACTIVITY || {};

;(function(){
	/*
     * Turntable 抽奖转盘
     * */
	 
	function Turntable(options){
		var _this = this,
			defaults = {
				prizeLength : 0,//转盘内奖品总数
				minRunTime : 3000,//转盘至少转的时间 单位毫秒
				speed:5,//转盘初始速度
				minSpeed:2.5,//转盘最慢的速度
				maxSpeed:25,//转盘最快速度
				accelerat:100,//转盘的加速时的加速度
				decelerate:50,//转盘减速时的加速度
				direction:1,// 1 顺时针 0 逆时针
				onUpdate : function(){}
			};
		
		$.extend(_this, defaults, options);
		_this.speed = 1000 / _this.speed;
		_this.minSpeed = 1000 / _this.minSpeed;
		_this.maxSpeed = 1000 / _this.maxSpeed;
		_this.accelerat = 1000 / _this.accelerat;
		_this.decelerate = 1000 / _this.decelerate;
	}
	
	Turntable.prototype = {
		constructor : Turntable,
		
		start : function () {
            var _this = this;
			
			_this._goto = -1;
			_this._delay = _this.speed,
			_this._current = 0,
			_this._pre = -1;
			_this._startDate = new Date();
			_this._isStop = false;
            _this._timer();	
        },
		
		_timer : function(){
			var _this = this;
			
			if(_this._isStop){
				_this.onStop && _this.onStop();
				_this._goto = -1;
				return;
			}
			
			_this.onUpdate.call(_this, _this._current);
			_this._pre = _this._current;
			_this._current = _this._current + _this.direction;
			
			//顺时针
			if (_this._current >= _this.prizeLength) {
				_this._current = 0;
			}
			//逆时针
			if (_this._current < 0) {
				_this._current = _this.prizeLength - 1;
			}

			if (_this._goto >= 0) {
				_this._delay += _this.decelerate;
			} else {
				_this._delay -= _this.accelerat;
			}

			if (_this._delay < _this.maxSpeed) {
				_this._delay = _this.maxSpeed;
			}

			if (_this._delay > _this.minSpeed && _this._goto >= 0 && _this._pre == _this._goto) {
				_this.onStop && _this.onStop();
				_this._goto = -1;
			} else {
				setTimeout(function(){
					_this._timer.call(_this);
				}, _this._delay);
			}
		},
		
        stop : function (index, onstop) {
			var _this = this;
			
			//超出范围
			if (index >= _this.prizeLength) {
				throw Errow("stop 停止的参数 不能大于 奖品总个数");
				return;
			}

			//强制停止
			if(onstop === true){
				_this._stop(index);
				_this.onStop = null;
				return;
			}

			if(typeof onstop === 'function'){
				_this.onStop = onstop;
			}

			var remainRunTime = _this.minRunTime - (new Date() - _this._startDate);

			//转的时间已经够了
			if (remainRunTime <= 0) {
				_this._stop(index);
				return;
			}

			//转的时间不够
			setTimeout(function () {
				_this._stop(index);
				return;
			}, remainRunTime);
            
        },
		
		_stop : function(index){
			this._goto = index;

			if(index == -1){
				this._isStop = true;
			}
		},

        reset : function (options) {
            var _this = this
			
			Turntable.call(_this);
		}
	}
		
	ACTIVITY.Turntable = Turntable;
=======
var ACTIVITY = window.ACTIVITY || {};

;(function(){
	/*
     * Turntable 抽奖转盘
     * */
	 
	function Turntable(options){
		var _this = this,
			defaults = {
				prizeLength : 0,//转盘内奖品总数
				minRunTime : 3000,//转盘至少转的时间 单位毫秒
				speed:5,//转盘初始速度
				minSpeed:2.5,//转盘最慢的速度
				maxSpeed:25,//转盘最快速度
				accelerat:100,//转盘的加速时的加速度
				decelerate:50,//转盘减速时的加速度
				direction:1,// 1 顺时针 0 逆时针
				onUpdate : function(){}
			};
		
		$.extend(_this, defaults, options);
		_this.speed = 1000 / _this.speed;
		_this.minSpeed = 1000 / _this.minSpeed;
		_this.maxSpeed = 1000 / _this.maxSpeed;
		_this.accelerat = 1000 / _this.accelerat;
		_this.decelerate = 1000 / _this.decelerate;
	}
	
	Turntable.prototype = {
		constructor : Turntable,
		
		start : function () {
            var _this = this;
			
			_this._goto = -1;
			_this._delay = _this.speed,
			_this._current = 0,
			_this._pre = -1;
			_this._startDate = new Date();
			_this._isStop = false;
            _this._timer();	
        },
		
		_timer : function(){
			var _this = this;
			
			if(_this._isStop){
				_this.onStop && _this.onStop();
				_this._goto = -1;
				return;
			}
			
			_this.onUpdate.call(_this, _this._current);
			_this._pre = _this._current;
			_this._current = _this._current + _this.direction;
			
			//顺时针
			if (_this._current >= _this.prizeLength) {
				_this._current = 0;
			}
			//逆时针
			if (_this._current < 0) {
				_this._current = _this.prizeLength - 1;
			}

			if (_this._goto >= 0) {
				_this._delay += _this.decelerate;
			} else {
				_this._delay -= _this.accelerat;
			}

			if (_this._delay < _this.maxSpeed) {
				_this._delay = _this.maxSpeed;
			}

			if (_this._delay > _this.minSpeed && _this._goto >= 0 && _this._pre == _this._goto) {
				_this.onStop && _this.onStop();
				_this._goto = -1;
			} else {
				setTimeout(function(){
					_this._timer.call(_this);
				}, _this._delay);
			}
		},
		
        stop : function (index, onstop) {
			var _this = this;
			
			//超出范围
			if (index >= _this.prizeLength) {
				throw Errow("stop 停止的参数 不能大于 奖品总个数");
				return;
			}

			//强制停止
			if(onstop === true){
				_this._stop(index);
				_this.onStop = null;
				return;
			}

			if(typeof onstop === 'function'){
				_this.onStop = onstop;
			}

			var remainRunTime = _this.minRunTime - (new Date() - _this._startDate);

			//转的时间已经够了
			if (remainRunTime <= 0) {
				_this._stop(index);
				return;
			}

			//转的时间不够
			setTimeout(function () {
				_this._stop(index);
				return;
			}, remainRunTime);
            
        },
		
		_stop : function(index){
			this._goto = index;

			if(index == -1){
				this._isStop = true;
			}
		},

        reset : function (options) {
            var _this = this
			
			Turntable.call(_this);
		}
	}
		
	ACTIVITY.Turntable = Turntable;
>>>>>>> 5c5b2a764df1c0554f639ed3a86d8bc802d8b1c0
})();