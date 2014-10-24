;(function(window){
	window.Tools = function(){
		return T;
	}
	
	var T = {};
	
	/*String*/
	T.times = function(str, count){
		return count < 1 ? '' : new Array(count + 1).join(str);
	}
	
	T.template = function(tmpl, json){
		if (typeof tmpl !== "string" || typeof json !== "object") return "";
		return tmpl.replace(/\@{([a-zA-Z_0-9\-]*)\}/g, function (all, key) {
			return typeof json[key] !== "undefined" ? json[key] : '';
		});
	}
	
	T.splitSpace = function(str){
		return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ');
	}
	
	T.cnlen = function(str, type){
		return str.replace(/[^\x00-\xff]/g,"aa").length;
	}
	
	/*中文截断*/
	T.cnslice = function(str,maxlen){
		var count = 0,maxlen = maxlen || 280,str1 = str.split("");
		
		if(cnlen(str) <= maxlen){
			return str;
		}

		for(var i = 0,l = str1.length; i < l;i++){
			count += cnlen(str1[i]);
			if(count >= maxlen - 2){
				break;
			}
		}

		return str.substr(0,i + 1) + "…";
	}

	/*Number*/
	T.randomInt = function(start, end){
		return Math.floor(Math.random() * (end - start + 1)) + start;
	}
	/*Array*/
	
	//返回数组随机几个值
	T.randomArray = function(arr, num){
		var oldarr = [],
			newarr = [];
		
		num = num > arr.length ? arr.length : num;
		num = num < 1 ? 1 : num;
		oldarr.push.apply(oldarr,arr);
		
		for (var i = 0; i < num; i++){
			newarr.push(oldarr.splice(Math.floor(Math.random() * oldarr.length),1)[0]);
		}
		
		return newarr;
	}
	
	/*Type*/
	T.isType = function(val, type){
		return {}.toString.call(val).toLowerCase() === '[object ' + type.toLowerCase() + ']';
	}
		
	/*Object*/
	
	/*Class*/
	
	/*Function*/
	T.before = function(_this, func){
		_this = typeof _this === "function" ? _this : function(){};
		func = typeof func === "function" ? func : function(){};
		
		return function(){
			
			if (func.apply(this, arguments) === false){
				return false;
			}
			
			return _this.apply(this, arguments);
		}
	}
	
	T.after = function(_this, func){
		_this = typeof _this === "function" ? _this : function(){};
		func = typeof func === "function" ? func : function(){};
		
		return function(){
			var ret = _this.apply(this, arguments);
			
			if (ret === false){
				return false;
			}
			
			func.apply(this, arguments);
			return ret;
		}
	}
})(window, undefined);