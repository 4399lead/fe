var Emt = (function(){ 
	var env = {}, 
		userAgent = navigator.userAgent, 
		ios = userAgent.match(/(iPad|iPhone|iPod);.+OS\s([\d_\.]+)/), 
		android = userAgent.match(/(Android)\s([\d\.]+)/); 

	env.isAndroid = (/android/gi).test(navigator.appVersion); 
	env.isIDevice = (/iphone|ipad|ipod/gi).test(navigator.appVersion); 
	env.isWebkit = /WebKit\/[\d.]+/i.test(userAgent); 
	env.isSafari = ios ? (navigator.standalone ? isWebkit : (/Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/MQQBrowser/i.test(userAgent))) : false; 

	if (ios) { 
		env.device = ios[1]; 
		env.version = ios[2].replace(/_/g, '.'); 
	} else if(android){ 
		env.version = android[2]; 
	} 

	env.standalone = navigator.standalone; 
	env.wechat = navigator.userAgent.indexOf("MicroMessenger") >= 0; 

	return env; 
 })(); 
