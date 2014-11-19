/*
 * 检查页面相关功能
*/
(function(){
	var FEPage = FEPage || {};
    FEPage = {
    	data : {},
    	getMeta : function(){
    		var that = this;
    		var _title = document.getElementsByTagName('title')[0].innerHTML;
    		that.data.title = _title;


			var _meta = document.getElementsByTagName('meta');
			['keywords','description'].forEach(getKeyContent);
			function getKeyContent(i,v){
				for( var m=0;m<_meta.length;m++){
					if( _meta[m].name == i ){
						that.data[i] = _meta[m].content;
					}
				}
			}
    	},
    	getImgAlt : function(){
    		var that = this;
    		var _imgAlt = document.getElementsByTagName('img');
			var _altArray = [];
			for( var n = 0;n<=_imgAlt.length-1;n++){
				if( _imgAlt[n].getAttribute('alt')){
					_altArray.push(_imgAlt[n]);
				}else{
					_imgAlt[n].className = "j-outline"
				}
			}	
			that.data['totalImage'] = _imgAlt.length;
			that.data['imageAlt'] = _altArray.length;
    	},
    	getPerformanceTime : function(){
    		var _perTime = performance.timing;

			var _connectTime = _perTime.connectEnd - _perTime.connectStart;
			console.log(_connectTime);

			var _requestTime = _perTime.requestEnd - _perTime.requestStart;
			console.log(_requestTime);

			var _responseTime = _perTime.responseEnd - _perTime.responseStart;
			console.log(_responseTime);

			var _memory = performance.memory;
			console.log(_memory.jsHeapSizeLimit);
			console.log(_memory.usedJSHeapSize);
			console.log(_memory.totalJSHeapSize);
		},
		getShortIcon : function(){
			var that = this;
			var _link = document.getElementsByTagName('link');
			for( var i=0;i<_link.length;i++){
				if( _link[i].getAttribute('rel') == 'shortcut icon'){
					that.data.shortcutIcon = _link[i].getAttribute('href');
				}
			}
		},
		getResult : function(data){
			if( document.getElementById('j-checkResult')){
				return;
			}
			var _location = window.location.href;

			var _title = data.title ? data.title : "暂无",
				_keywords = data.keywords ? data.keywords : "暂无",
				_description = data.description ? data.description : "暂无",
				_imgTotalNum = data.totalImage ? data.totalImage : "暂无",
				_imgTotalAlt = data.imageAlt ? data.imageAlt : "暂无",
				_shortCutIcon = data.shortcutIcon ? data.shortcutIcon : "暂无";

			var _element = document.createElement('div');
			_element.id = "j-checkResult";
			_element.className = "m_fecheck";
			_element.innerHTML = '<p class="m_fecheck_title">'+_location+'的基本信息：</p>\
								  <ul>\
								    <li><span class="m_fec_title">title：</span>'+ _title +'</li>\
									<li><span class="m_fec_title">keyword：</span>'+ _keywords +'</li>\
									<li><span class="m_fec_title">description：</span>'+ _description +'</li>\
									<li>总共有图片：'+ _imgTotalNum +'，其中有alt属性的有：'+ _imgTotalAlt +'<span class="m_fecheck_tip">其中无alt的会标示出来</span></li>\
									<li><span class="m_fec_title">shortcut icon图标：</span>'+ _shortCutIcon +'</li>\
								</ul>\
								<span class="m-feclose" id="j-fecheck-close">关闭</span>\
								<span class="m_fb" id="j-fabu"></span>';

			var _body = document.body;
			_body.insertBefore(_element,null);

			if( _title && _keywords && _description && _shortCutIcon ){
				document.getElementById('j-fabu').innerHTML = "恭喜你，可以发布了";
			}else{
				
			}

			var _closeBtn = document.getElementById('j-fecheck-close'),
				_checkPop = document.getElementById('j-checkResult');
			_closeBtn.addEventListener('click',function(){
				_body.removeChild(_checkPop);
				this.click = null;
			})
		},
		doDynamicStyle : function( href ){
			if( document.getElementById('j-dynamic-style')){
				return;
			}
			var _link = document.createElement('link');
				_link.id = "j-dynamic-style",
				_link.rel = "stylesheet",
				_link.type= "text/css";
				_link.href = href;
			var _head = document.getElementsByTagName('head')[0];
			_head.insertBefore(_link,null);
		},
		init : function(){
			var that = this;
			that.doDynamicStyle('http://fe.4399ued.com/tools/pagecheck/fecheck.css');
			that.getMeta();
			that.getImgAlt();
			that.getPerformanceTime();
			that.getShortIcon();	
			that.getResult( that.data )
		}
    }
    FEPage.init();
})()

