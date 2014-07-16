/**
 * @description    : 表单验证组件
 */
define(function(require,exports,module){

	var noop = function(){},
		emailRegExp = /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/;
	
	function len(str, type){
		if (type == "ch"){
			return str.replace(/[^\x00-\xff]/g,"aa").length / 2;
		} else {
			return str.length;
		}
	}
    
		
	function ctor(options){
		var defaults = {
				form : "",
				onsubmit : noop,
				elements : []
			},
			textDefaults = {
				trim : true,
				required : false,
				minLength : undefined,
				maxLength : undefined,
				email : false,
				regexp : undefined,
				relation : undefined,
				relationType : undefined,
				onvalid : noop
			},
			selectDefaults = {
				required : false,
				onvalid : noop
			},
			radioDefaults = {
				required : false,
				onvalid : noop
			},
			checkboxDefaults = {
				required : false,
				minLength : undefined,
				maxLength : undefined,
				onvalid : noop
			};
		
		this.options = options = $.extend(defaults, options);
		
		var $target,
			tagname,
			type;
				
		for (var i = 0; i < options.elements.length; i++){
			$target = $(options.elements[i].selector);
				
			if($target.length == 0) continue;
			
			tagname = $target[0].tagName.toLowerCase();
			type = ($target[0].type || "").toLowerCase();
			
			if (tagname == "input" && type == "radio"){
				options.elements[i] = $.extend({}, radioDefaults, options.elements[i]);
				options.elements[i].type = "radio";
			} else if (tagname == "input" && type == "checkbox"){
				options.elements[i] = $.extend({}, checkboxDefaults, options.elements[i]);
				options.elements[i].type = "checkbox";
			} else if (tagname == "input" && (type == "text" || type == "password") || tagname == "textarea"){
				options.elements[i] = $.extend({}, textDefaults, options.elements[i]);
				options.elements[i].type = "text";
			} else if (tagname == "select"){
				options.elements[i] = $.extend({}, selectDefaults, options.elements[i]);
				options.elements[i].type = "select";
			}
		};
		
		this.init();
	}
	
	ctor.prototype = {
		valid : {valid : true},
		_elements : [],
		
		init : function(){
			var _this = this,
				options = this.options,
				$form = $(options.form);
				
			if ($form.length !== 1){return false}
			
			$form.bind("submit", function(){
				_this.validateAll();
				var defaultBehavior = options.onsubmit.call(_this, _this.valid);
				if(_this.valid.valid){
					return defaultBehavior;
				}
				return false;
			});
			
			$(options.btn).bind("click", function(){
				$form.trigger("submit");
				return false;
			});

			$.each(options.elements, function(i, ops){
				var $target = $(ops.selector);
					
				if($target.length == 0) return true;
				
				_this.valid[ops.selector] = {valid : false, ops : ops};
				
				if (ops.type == "radio"){
					$target.bind("click",function(){
						_this.validateOne("Radio", $target, ops);
					});
				} else if (ops.type == "checkbox"){
					$target.bind("click",function(){
						_this.validateOne("Checkbox", $target, ops);
					});
				} else if (ops.type == "text"){
					$target.bind("blur",function(){
						_this.validateOne("Text", this, ops);
					});
					
				} else if (ops.type == "select"){
					$target.bind("blur change",function(){
						_this.validateOne("Select", this, ops);
					});
				}
					
			});
		},
		
		validateOne : function(type, target, ops){
			var _this = this,
				valid,
				options = this.options;
			
			if (typeof ops.before === 'function'){
				if (ops.before.call(_this,type, target, ops) !== true){
					return true;
				}
			}

			if(ops.after){
				_valid = $(ops.after).data("valid");
				if (_valid && _valid.valid === false){
					return true;
				}
			}

			valid = _this.valid[ops.selector] = _this['validate' + type](target, ops);
			
			if ($(ops.tip).length > 0){
				$(ops.tip).show().html(valid.text);
				
				if (valid.valid === true){
					$(ops.tip).removeClass(options.failureTipClass).addClass(options.successTipClass);
				} else if (valid.valid === false){
					$(ops.tip).removeClass(options.successTipClass).addClass(options.failureTipClass);	 
				} else{
					$(ops.tip).hide();
				}
			}
			
			ops.onvalid.call(_this, _this.valid[ops.selector]);
			$(target).data("valid", valid);
			return valid;
		},
		
		//按顺序逐个验证
		validateAll : function(){
			var _this = this,
				_valid,
				options = this.options;
			
			_this.valid.valid = true;
			$.each(options.elements, function(i, ops){
				var $target = $(ops.selector),
					tagname,
					type;
					
				if($target.length == 0) return true;
				
				tagname = $target[0].tagName.toLowerCase();
				type = ($target[0].type || "").toLowerCase();
				
				if (tagname == "input" && type == "radio"){
					_valid = _this.validateOne("Radio", $target, ops);
				} else if (tagname == "input" && type == "checkbox"){
					_valid = _this.validateOne("Checkbox", $target, ops);
				} else if (tagname == "input" && (type == "text" || type == "password") || tagname == "textarea"){
					_valid = _this.validateOne("Text", $target[0], ops);
				} else if (tagname == "select"){
					_valid = _this.validateOne("Select", $target[0], ops);
				}
				
				//console.log(_valid);
				if (_valid.valid === false){
					
					_this.valid.valid = false;
				}	
			});
		},
		
		validateText : function(target, ops){
			var $target = $(target),
				val = $target.val(),
				rel_val = $(ops.relation).val(),
				lengthType = ops.lengthType === "ch" ? "ch" : "en";
			
			if (ops.trim){
				val = $.trim(val);
				rel_val = $.trim(rel_val);
			}
			
			if (ops.required && val == ""){
				return {valid : false, type : "required", ops : ops, text : ops.requiredText || ops.failureText};
			}
			
			if (typeof ops.minLength === "number" && len(val, lengthType) < ops.minLength && val != ""){
				return {valid : false, type : "minLength", ops : ops, text : ops.lengthText || ops.failureText};
			}
			
			if (typeof ops.maxLength === "number" && len(val, lengthType) > ops.maxLength && val != ""){
				return {valid : false, type : "maxLength", ops : ops, text : ops.lengthText || ops.failureText};
			}
			
			if (ops.email && !emailRegExp.test(val) && val != ""){
				return {valid : false, type : "email", ops : ops, text : ops.emailText || ops.failureText};
			}
			
			if (typeof ops.regexp == "object" && typeof ops.regexp.test == "function" && ops.regexp.test(val) == false && val != ""){
				return {valid : false, type : "regexp", ops : ops, text : ops.regexpText || ops.failureText};
			}
			
			if (ops.relation && $(ops.relation).length > 0 && val != ""){
				var _relation_result = true;
				switch(ops.relationType){
					case "==" : 
						if (rel_val != val)  _relation_result = false;
					break;
					
					case ">" :
						if (parseInt(val) <= parseInt(rel_val)) _relation_result = false;
					break;
					
					case ">=" :
						if (parseInt(val) < parseInt(rel_val)) _relation_result = false;
					break;
					
					case "<" :
						if (parseInt(val) >= parseInt(rel_val)) _relation_result = false;
					break;
					
					case "<=" :
						if (parseInt(val) > parseInt(rel_val)) _relation_result = false;
					break;
					
					case "!=" :
						if (val == rel_val)_relation_result = false;
					break;
				}
				
				$(ops.relation).unbind("blur.relation").bind("blur.relation", function(){
					$target.trigger("blur");
				});

				if (!_relation_result) return {valid : false, type : "relation", ops : ops, text : ops.relationText || ops.failureText};
			}
			
			if (!ops.required && val == ""){
				return {valid : undefined, ops : ops};
			}
			
			return {valid : true, ops : ops, text : ops.successText};
		},
		
		validateSelect : function(target, ops){
			var	$target = $(target),
				selected = target.selectedIndex;
				
			if (ops.required && selected == 0){
				return {valid : false, type : "required", ops : ops, text : ops.requiredText || ops.failureText}
			}
			
			if (!ops.required && selected == 0){
				return {valid : undefined, ops : ops};
			}
			return {valid : true, ops : ops, text : ops.successText};
		},
		
		validateRadio : function(target, ops){
			var $target = $(target),
				is_checked = false;

			if (ops.required){
				$target.each(function(){
					is_checked = $(this).attr("checked");
					if (is_checked){
						return false;
					}
					return true;
				})
				if (!is_checked) return {valid : false, type : "required", ops : ops, text : ops.requiredText || ops.failureText};
			} else {
				return {valid : undefined, ops : ops};
			}
			
			return {valid : true, ops : ops, text : ops.successText};
		},
		
		validateCheckbox : function(target, ops){
			var $target = $(target),
				selected_count = 0;
			
			$target.each(function(){
				if ($(this).attr("checked")){
					selected_count++;
				}
				return true;
			});
			
			if (ops.required && selected_count == 0){
				return {valid : false, type : "required", ops : ops, text : ops.requiredText || ops.failureText}
			} 
			
			if (typeof ops.minLength === "number" && selected_count < ops.minLength && selected_count != 0){
				return {valid : false, type : "length", ops : ops, text : ops.lengthText || ops.failureText};
			}
			
			if (typeof ops.maxLength === "number" && selected_count > ops.maxLength && selected_count != 0){
				return {valid : false, type : "length", ops : ops, text : ops.lengthText || ops.failureText};
			}
			
			if (!ops.required && selected_count == 0){
				return {valid : undefined, ops : ops};
			}
			return {valid : true, ops : ops, text : ops.successText};
		}
	}

    module.exports = ctor;
});