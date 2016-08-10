(function ($) {
	var urlfix = 
	{
		baseurl:'http://localhost/your_app',
		ajaxurl:null,
		fileloc:'libraries',
		urlfix: '',
		client : '',
		cookie : '_app',
		device : '_device',
		onlineid : null,
		api: function (caller,appname,urlstring,authenticate,client)
		{
			if(!client){
				//var isMoblie = jQuery.browser.mobile;			
				this.client  = !this.client ? ( (!isMoblie) ? 'web' : 'mobile' ) : this.client;	
			}else{
				this.client  = client; 
			}
			if(!caller || !appname){
				//alert('Caller and application required');				
				if (console && console.log) {
					console.log('Caller and application required');
				}
				return '';
			}if(!urlstring) urlstring = "";
			return this.apiurl(caller,appname,urlstring,authenticate);		
		},
		serverurl :function (){
			var ajaxurl = !this.ajaxurl ? this.baseurl : this.ajaxurl;
			var url = ajaxurl + "/api.php";
			return url;
		},
		appData :function (caller,appname,urlstring,authenticate){
			if(typeof authenticate != 'undefined' && authenticate == false) authenticate =  "&lcheck=1";
			else authenticate = "";
			var debug = urlfix.get_param('debug') ? 1 : 0;
			var showdebug = "";
			if(debug == 1){
				showdebug = "&debub=1";
			}
			var url = "ajax=true&app="+appname+"&caller="+caller+"&client="+this.client+"&"+urlstring+authenticate+'&usercookie='+$.cookie(this.cookie)+'&device='+$.cookie(this.device)+showdebug;
			var obj = {}; 
			url.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
			    obj[decodeURIComponent(key)] = decodeURIComponent(value);
			}); 
			return obj;
		},
		apiurl :function (caller,appname,urlstring,authenticate){
			if(typeof authenticate != 'undefined' && authenticate == false) authenticate =  "&lcheck=1";
			else authenticate = "";
			var debug = urlfix.get_param('debug') ? 1 : 0;
			var showdebug = "";
			if(debug == 1){
				showdebug = "&debub=1";
			}
			var ajaxurl = !this.ajaxurl ? this.baseurl : this.ajaxurl;
			var url = ajaxurl + "/api.php?ajax=true&app="+appname+"&caller="+caller+"&client="+this.client+"&" + urlstring + authenticate+'&usercookie='+$.cookie(this.cookie)+'&device='+$.cookie(this.device)+showdebug;
			return url;
		},
		get_param :function ( name ){
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
			var regexS = "[\\?&]"+name+"=([^&#]*)", 
			regex = new RegExp( regexS ),
			results = regex.exec( window.location.href ); 
			if( results == null )    return "";  
			else    return results[1];
		},
		init: function (loc,serverpage,fileloc){
			this.client  = (!isMoblie) ? 'web' : 'mobile';
			if(!serverpage){				
				if (console && console.log) {
					console.log('location and page required');
				}return;
			}
			if(fileloc == false)	this.fileloc = "";
			else if(fileloc)		this.fileloc = fileloc;
			if(loc != '')	this.urlfix = loc;	
			else this.urlfix = '';	
			return this.seturl(serverpage);		
		},
		seturl :function (serverpage)
		{
			if(this.fileloc != ''){
				if(this.urlfix != '')	var url = this.baseurl + '/' + this.urlfix + '/'+ this.fileloc + '/' + serverpage;
				else 					var url = this.baseurl + '/' + this.fileloc + '/' + serverpage;
			}else{
				if(this.urlfix != '')	var url = this.baseurl + '/' + this.urlfix + '/' + serverpage;
				else 					var url = this.baseurl + '/' + serverpage;
			}
			this.urlfix = '';	
			this.fileloc = 'libraries';
			return url;
		},
		debugparam : function (param){			
			var r = param.header.redirecturl;
			if(param.header.redirecturl != ""){
				jAlert(param.body.response,'Error',function(){redirect_to(r)});
			}
			var d = param.header.debugtime;
			if(param.header.debugtime != ""){
				if($("#load_time").length <= 0){
					$("BODY").append('<div id="load_time"></div>');
				}
				$("#load_time").fadeOut('slow',function(){$("#load_time").prepend(d).fadeIn('slow',function(){ try {$("#load_time").draggable({ handle: $("#load_time  table thead tr") }).resizable();} catch(e) { };})})
			}delete(param['header']['debugtime']);
			if(typeof param.header.sandbox_error != 'undefined' && ( param.header.undefined != "0" || param.header.sandbox_error != "0" ) ){
				var sandbox = urlfix.get_param('sandbox');
				if( sandbox == 'true' ){
					jAlert(param.header.error,'Application return fatal error');	
				}
			}return param;
		},
		jsonparser :function (param,settings){
			var debugstr = param;
			if (typeof settings != 'undefined' && settings.debug == true) {
				alert(settings.url);
				jAlert(debugstr);
			}			
			try {
				param = jQuery.parseJSON(param);
				param = this.debugparam(param);
			} catch(e) { 
				var sandbox = urlfix.get_param('sandbox');
				var $mBlock = strpos(param, "{\"header\"");
				if($mBlock == false) {
					param = {"header":{"status":0},"body":"unknown error : " + debugstr}
					if (console && console.log &&  sandbox == 'true' ) {
						console.log(debugstr);
					}else if( sandbox == 'true' || (typeof settings != 'undefined' && settings.debug == true) ){
						alert(debugstr);
					}else  param = {"header":{"status":0},"body":"Something went wrong"}
					return param;
				}					
				param  = substr(param, $mBlock); 				
				try {
					param = jQuery.parseJSON(param);
					param = this.debugparam(param);
					if (sandbox == 'true'  ) jAlert(substr(debugstr ,0, $mBlock),'Unknown Error debuged');
				} catch(e) {
					param = {"header":{"status":0},"body":"unknown error : " + debugstr}
					if (console && console.log &&  sandbox == 'true'  ) {
						console.log(debugstr); 
					}else if( sandbox == 'true' || (typeof settings != 'undefined' && settings.debug == true) ){
						alert(debugstr);
					}else param = {"header":{"status":0},"body":"Something went wrong"}
				}
			}	
			return param;
		}
	}
	$.shypesjax = function (options) {
		$.shypesjax.ajax;
		var	defaults = {
			caller: '',
			client: '',
			application: '',			
			params:'',	
			url:'',
			data:{},
			authenticate: true,
			traditional: true,
			apiurl: true,
			serverpage:'',
			debug:false,
			type: 'POST',
			ajaxhandle:null,
			errorhandle:null,
			tabhandle:null,
			applicationtype:'normal',
			//contentType: 'application/json; charset=utf-8',
			dataType: 'shypesjson',			
		},
		deferred = $.Deferred(function (d) {
		var settings = $.extend({}, defaults, options);
			if(settings.url == '' && settings.apiurl == true)	{
				if(settings.type.toLowerCase() == 'get'){
					settings.url = urlfix.api(settings.caller,settings.application,settings.params,settings.authenticate);
				}else{
					data = urlfix.appData(settings.caller,settings.application,settings.params,settings.authenticate);
					settings.data = $.extend({}, settings.data, data);
					settings.url = urlfix.serverurl();
					//settings.dataType = 'json';
				}
			}else if(settings.url == '' && settings.serverpage != '')	{
				settings.url = urlfix.init('',settings.serverpage,'') + "?" + settings.params;
			}
			if(settings.url == '') return;
			if(settings.dataType == 'shypesjson')	settings.dataType = 'text';
			else settings.traditional = false;
			d.done(settings.success);
			d.fail(settings.error);
			d.done(settings.complete);
			var jqXHRSettings = $.extend({}, settings, {	
				success: function (response, textStatus, jqXHR) {	
					if (settings.traditional === true) {
						response = urlfix.jsonparser(response,settings);//	alert(msg)
						d.resolve(response); 
					} else {	
						d.resolve(response);                 
					};
				},
				error: function (jqXHR, textStatus, errorThrown) {		
					if (console && console.log) {
						//console.log(jqXHR);
					}	
					d.reject(jqXHR);
					var sandbox = urlfix.get_param('sandbox');
					if(sandbox == 'true')	{
						//alert('ajax error, url logged');	
						if (console && console.log) {
							console.log(settings.url);	
						}					
					}
				},				
				complete: d.resolve,				
			});
			$.shypesjax.ajax   = $.ajax(jqXHRSettings);
		}); 
		return $.shypesjax.ajax;
	};
	$.shypesjax.setajaxurl = function(ajaxurl){
		return urlfix.ajaxurl  = ajaxurl;
	}
	$.shypesjax.setbaseurl = function(baseurl){
		return urlfix.baseurl  = baseurl;
	}
	$.shypesjax.setclient = function(client){
		return urlfix.client  = client;
	}
	$.shypesjax.fixurl = function(loc,serverpage,fileloc){
		return urlfix.init(loc,serverpage,fileloc);
	}
	$.shypesjax.apiurl = function(caller,appname,urlstring,authenticate){
		return urlfix.api(caller,appname,urlstring,authenticate);
	}
	$.shypesjax.frameurl = function(caller,appname,urlstring,authenticate){
		return urlfix.frame(caller,appname,urlstring,authenticate);
	}
	$.shypesjax.jsonparser = function(response,settings){		
		return urlfix.jsonparser(response,settings);
	}
})(jQuery);
