/**
 * @description    : 分享组件 ue.share
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-17 created by czonechan
 * @parameter      : 
 * @details        : api http://t2.s.img4399.com/base/js/plugins/ue.share/ hostip 192.168.51.203
 */
 
(function(){
	var en = encodeURIComponent,
		options;
	
	function ctor(ops){
		var defaults = {
			target : $(),
			pop : $(),
			qzone : $(),
			tqq : $(),
			tsina : $(),
			copy : $(),
			input : $(),
			success : $(),
			success : $(),
			title : document.title,
			url : document.location.href,
			pic : ""
		}
		
		options = $.extend(defaults, ops);
		init();
	}
	
	window.ue = window.ue || {};
	
	var clip;
	var is_click = false;
	
	function init(){
		
		options.target.bind("click", function(){
			is_click = !is_click;
			if(is_click){
				show();
			} else {
				hide();
			}
			return false;
		});
		
		options.qzone.bind("click", function(){
			shareTo('qzone');
			return false;
		});
		
		options.tqq.bind("click", function(){
			shareTo('tqq');
			return false;
		});
		
		options.tsina.bind("click", function(){
			shareTo('tsina');
			return false;
		});
		
		options.input.val(options.url);
		
	}
	
	function show(){
		is_click = true;
		
		options.success.hide();
		$(document).unbind("click.share").bind("click.share", function(evt){
			
			var target = evt.target;
			
			if (target.id =='ZeroClipboardMovie_' + clip.id) return false;
			var $parent = $(target).parents(options.pop.selector);

			if ($parent.length == 0){
				is_click = false;
				checkHover();
			}

			return true;
		});
		
		options.pop.show();
		clip = new ZeroClipboard.Client(); 
		clip.setText(options.url); 
		clip.glue(options.copy[0]); 
		clip.addEventListener("complete", function(){
			options.success.show();
			setTimeout(function(){
				options.success.hide();
			},2000);
			return false;
		});
	}
		
	function hide(){	
		is_click = false;
		options.pop.hide();
		$("#ZeroClipboard_hold" + clip.id).remove();
	}
		
	function checkHover(){
		if(!is_click){
			is_click = false;
			hide();
		}
	}
		
	function shareTo(type){
		var w , h, left, top, share_url;
		
		if (type == 'qzone'){
			share_url = [
				'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + en(options.url),
				'&title=' + en(options.title),
				'&pics=' + en(options.pic),
				'&summary=' + en(options.title)
			].join('');
			
			w = 850;
			h = 650;
			
		} else if (type == 'tsina'){
			share_url = [
				'http://v.t.sina.com.cn/share/share.php?c=&url=' + en(options.url),
				'&title=' + en(options.title),
				'&content=utf8&pic=' + en(options.pic)
			].join('');
			
			w = 610;
			h = 570;
			
		} else if (type == 'tqq'){
			share_url=[
				'http://v.t.qq.com/share/share.php?site=' + en('www.4399.com'),
				'&url=' + en(options.url),
				'&title=' + en(options.title),
				'&pic=' + en(options.pic)
			].join('');
			
			w = 700;
			h = 470;
			
		}
			
		function shareCallback(){
			left = (screen.width - w) / 2;
			top = (screen.height - h) / 2;
			
			if(!window.open(share_url, type, [
					'toolbar=0,resizable=1,status=0,width=' + w,
					',height=' + h,
					',left=' + left ,
					',top=' + top
				].join(''))){
				location.href = share_url;
			}
		}
	
		if(/Firefox/.test(navigator.userAgent)){
			setTimeout(shareCallback,0);
		}else{
			shareCallback();
		}
	}
	
	ue.share = function(options){
		return ctor(options);//只有一个实例
	}	
})();