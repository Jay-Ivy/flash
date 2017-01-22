/**
 * Created by jie.ding on 2015/11/26.
 */

var USERAGENT = navigator.userAgent.toLowerCase();
var CSSLOADED = [];/* css动态载入标识数组 */
var JSLOADED = [];/*javascript动态载入标识数组*/
var evalscripts = [];/*js相关*/
var VERHASH = typeof VERHASH == 'undefined' ? '1.0' : VERHASH;
var CSSPATH = typeof CSSPATH == 'undefined' ? 'static/c/' : CSSPATH;
var BROWSER = {};

browserVersion({'ie':'msie','firefox':'','chrome':'','opera':'','safari':'','mozilla':'','webkit':'','maxthon':'','qq':'qqbrowser'});
if(BROWSER.safari) {
	BROWSER.firefox = true;
}
BROWSER.opera = BROWSER.opera ? opera.version() : 0;
HTMLNODE = document.getElementsByTagName('head')[0].parentNode;
if(BROWSER.ie) {
	BROWSER.iemode = parseInt(typeof document.documentMode != 'undefined' ? document.documentMode : BROWSER.ie);
	HTMLNODE.className = 'ie_all ie' + BROWSER.iemode;
}
if(BROWSER.firefox && window.HTMLElement) {
	HTMLElement.prototype.__defineSetter__('outerHTML', function(sHTML) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var df = r.createContextualFragment(sHTML);
		this.parentNode.replaceChild(df,this);
		return sHTML;
	});

	HTMLElement.prototype.__defineGetter__('outerHTML', function() {
		var attr;
		var attrs = this.attributes;
		var str = '<' + this.tagName.toLowerCase();
		for(var i = 0;i < attrs.length;i++){
			attr = attrs[i];
			if(attr.specified)
				str += ' ' + attr.name + '="' + attr.value + '"';
		}
		if(!this.canHaveChildren) {
			return str + '>';
		}
		return str + '>' + this.innerHTML + '</' + this.tagName.toLowerCase() + '>';
	});

	HTMLElement.prototype.__defineGetter__('canHaveChildren', function() {
		switch(this.tagName.toLowerCase()) {
			case 'area':case 'base':case 'basefont':case 'col':case 'frame':case 'hr':case 'img':case 'br':case 'input':case 'isindex':case 'link':case 'meta':case 'param':
			return false;
		}
		return true;
	});
}
function $id(id) {
	return document.getElementById(id) ? document.getElementById(id) : null;
}

function $C(classname, ele, tag) {
	var returns = [];
	var ele = isUndefined(ele) ? '' : ele;
	ele = typeof ele == 'object' ? ele : (ele !== '' ? ($id(ele) ? $id(ele) : null) : document);
	if(!ele)
		return returns;
	tag = tag || '*';
	if(ele.getElementsByClassName) {
		var eles = ele.getElementsByClassName(classname);
		if(tag != '*') {
			for (var i = 0, L = eles.length; i < L; i++) {
				if (eles[i].tagName.toLowerCase() == tag.toLowerCase()) {
					returns.push(eles[i]);
				}
			}
		} else {
			returns = eles;
		}
	} else {
		eles = ele.getElementsByTagName(tag);
		var pattern = new RegExp("(^|\\s)"+classname+"(\\s|$)");
		for (i = 0, L = eles.length; i < L; i++) {
			if (pattern.test(eles[i].className)) {
				returns.push(eles[i]);
			}
		}
	}
	return returns;
}

function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if(eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}

function _detachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if(eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
}

function browserVersion(types) {
	var other = 1;
	for(i in types) {
		var v = types[i] ? types[i] : i;
		if(USERAGENT.indexOf(v) != -1) {
			var re = new RegExp(v + '(\\/|\\s)([\\d\\.]+)', 'ig');
			var matches = re.exec(USERAGENT);
			var ver = matches != null ? matches[2] : 0;
			other = ver !== 0 && v != 'mozilla' ? 0 : other;
		}else {
			var ver = 0;
		}
		eval('BROWSER.' + i + '= ver');
	}
	BROWSER.other = other;
}

function isUndefined(val) {
	return typeof val == 'undefined' ? true : false;
}

/**	功能 获取url参数值
 *	@param arg String 要获取的参数名
 *	@param url String url地址 可选,缺省为当前页面的地址
 *	@return String 要获取的参数值 参数不存在则为""
 */
function getUrlArg(arg, url) {
	var arg = isUndefined(arg) ? '' : arg;
	var url = isUndefined(url) || url === '' ? document.location.href : url;
	if(url.indexOf('?') == -1 || arg == '')
		return '';
	url = url.substr(url.indexOf('?')+1);
	var expr = new RegExp('(\\w+)=(\\w+)','ig');
	var args = [];
	while((tmp = expr.exec(url)) != null) {
		args[tmp[1]] = tmp[2];
	}
	return isUndefined(args[arg]) ? '' : args[arg];
}

function in_array(needle, haystack) {
	if(typeof haystack == 'undefined')return false;
	if(typeof needle == 'string' || typeof needle == 'number') {
		for(var i in haystack) {
			if(haystack[i] == needle) {
				return true;
			}
		}
	}
	return false;
}

function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function preg_replace(search, replace, str, regswitch) {
	var regswitch = !regswitch ? 'ig' : regswitch;
	var len = search.length;
	for(var i = 0; i < len; i++) {
		re = new RegExp(search[i], regswitch);
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}

function isLoaded(callback) {
	var callback = typeof callback == 'undefined' ? '' : callback;
	if(window.document.readyState == 'complete') {
		try{eval('callback()')} catch(e) {}
		return true;
	}
	setTimeout('isLoaded('+callback+')', 700);
}

function isWeiXin(){
	if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	}
	return false;
}

function isQQ() {
	return /qq\s*\//i.test(window.navigator.userAgent);
}

function isIOS() {
	return (/(iphone|ipad|ios)/i).test(window.navigator.userAgent);
}

function isAndroid() {
	return /android[\/\s]+([\d\.]+)/i.test(window.navigator.userAgent)
}

function getEvent() {
	if(document.all) return window.event;
	func = getEvent.caller;
	while(func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func=func.caller;
	}
	return null;
}

function doane(event, preventDefault, stopPropagation) {
	var preventDefault = isUndefined(preventDefault) ? 1 : preventDefault;
	var stopPropagation = isUndefined(stopPropagation) ? 1 : stopPropagation;
	e = event ? event : window.event;
	if(!e) {
		e = getEvent();
	}
	if(!e) {
		return null;
	}
	if(preventDefault) {
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
	if(stopPropagation) {
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}
	return e;
}

function hash(string, length) {
	var length = length ? length : 32;
	var start = 0;
	var i = 0;
	var result = '';
	filllen = length - string.length % length;
	for(i = 0; i < filllen; i++){
		string += "0";
	}
	while(start < string.length) {
		result = stringxor(result, string.substr(start, length));
		start += length;
	}
	return result;
}

function stringxor(s1, s2) {
	var s = '';
	var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var max = Math.max(s1.length, s2.length);
	for(var i=0; i<max; i++) {
		var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
		s += hash.charAt(k % 52);
	}
	return s;
}

/**  add javascript
 *  @param src String
 *  @param text String
 *	@param callback function
 *  @param reload Int 0/1
 *  @param targetid String possible value{htmlhead,htmlbody,...}
 *  @param charset String
 *  @return void
 */
function appendscript(src, text, callback, reload, targetid, charset) {
	var src = isUndefined(src) ? '' : src;
	var text = isUndefined(text) ? '' : text;
	var callback = isUndefined(callback) ? '' : callback;
	var targetid = (isUndefined(targetid) || targetid == '' || targetid == null) ? 'htmlhead' : targetid;
	var reload = isUndefined(reload) ? 0 : (parseInt(reload) == 1 ? 1 : 0);
	var charset = isUndefined(charset) ? '' : charset;
	var id = hash(src + text);
	if(!src && !text) return;
	if(targetid != 'htmlhead' && targetid != 'htmlbody' && !$id(targetid)) return;
	if(!reload && in_array(id, evalscripts)) return;
	if(reload && $id(id)) {
		$id(id).parentNode.removeChild($id(id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset ? charset : '';
	try {
		if(src) {
			scriptNode.src = src;
			scriptNode.onloadDone = false;
			scriptNode.onload = function () {
				scriptNode.onloadDone = true;
				JSLOADED[src] = 1;
				if(callback)
					try{eval('callback()')} catch(e) {}
			};
			scriptNode.onreadystatechange = function () {
				if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
					scriptNode.onloadDone = true;
					JSLOADED[src] = 1;
					if(callback)
						try{eval('callback()')} catch(e) {}
				}
			};
		} else if(text){
			scriptNode.text = text;
		}
		if(targetid == 'htmlhead') {
			document.getElementsByTagName('head')[0].appendChild(scriptNode);
		} else if(targetid == 'htmlbody') {
			document.getElementsByTagName('body')[0].appendChild(scriptNode);
		} else {
			$id(targetid).appendChild(scriptNode);
		}
	} catch(e) {}
}

/* 动态载入css */
/* 变量STYLEID */
function loadcss(cssname) {
	if(!CSSLOADED[cssname]) {
		if(!$id('css_' + cssname)) {
			css = document.createElement('link');
			css.id = 'css_' + cssname,
				css.type = 'text/css';
			css.rel = 'stylesheet';
			css.href = CSSPATH + cssname + '.css?' + VERHASH;
			var headNode = document.getElementsByTagName("head")[0];
			headNode.appendChild(css);
		} else {
			$id('css_' + cssname).href = CSSPATH + cssname + '.css?' + VERHASH;
		}
		CSSLOADED[cssname] = 1;
	}
}

var waitingtimer=[];
function showwaiting(showid, showmsg, wordflag, space, timeout, wordlength) {
	if(!$id(showid)) return false;
	showmsg = isUndefined(showmsg) ? '\u8bf7\u7a0d\u7b49' : showmsg;
	wordflag = isUndefined(wordflag) ? '.' : wordflag;
	space = isUndefined(space) ? '&nbsp;' : space;
	wordlength = isUndefined(wordlength) ? 3 : parseInt(wordlength);
	timeout = isUndefined(timeout) ? 500 : parseInt(timeout);
	var show = function(count){
		var count = isUndefined(count) ? 0 : parseInt(count);
		var flag = '';
		flag += new Array(count+1).join(wordflag) + new Array(wordlength-count+1).join(space);
		var showword = showmsg + flag;
		if($id(showid))
			$id(showid).innerHTML = showword;
		count++;
		if(count>wordlength) count = 0;
		waitingtimer[showid] = setTimeout(function(){try{clearwaiting(showid)}catch(e){}show(count)},timeout);
	}
	show();
}
function clearwaiting(showid) {
	if(isUndefined(showid)) {
		for(var i in waitingtimer){
			try{clearTimeout(waitingtimer[i]);}catch(e){}
		}
	} else {
		try{clearTimeout(waitingtimer[showid]);}catch(e){}
	}
	if($id(showid)) $id(showid).innerHTML = '';
}

/** cookie tool */
Cookie = {
	get: function(key, nounescape) {
		var nounescape = isUndefined(nounescape) ? false : (nounescape ? true : false);
		var cookie_start = document.cookie.indexOf(key + '=') == 0 ? 0 : document.cookie.indexOf('; ' + key);
		cookie_start = cookie_start == -1 ? -1 : cookie_start + 2;
		var cookie_end = document.cookie.indexOf(";", cookie_start);
		if(cookie_start == -1) {
			return null;
		} else {
			var v = document.cookie.substring(cookie_start + key.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length));
			return !nounescape ? unescape(v) : v;
		}
	},
	set: function(key, value, ttl, path, domain, secure) {
		cookie = [key+'='+    escape(value),
			'path='+    ((!path   || path=='')  ? '/' : path),
			'domain='+  ((!domain || domain=='')?  window.location.hostname : domain)];

		if (ttl)         cookie.push('expires='+Cookie.secondsToExpireDate(ttl));
		if (secure)      cookie.push('secure');
		return document.cookie = cookie.join('; ');
	},
	unset: function(key, path, domain) {
		path   = (!path   || typeof path   != 'string') ? '' : path;
		domain = (!domain || typeof domain != 'string') ? '' : domain;
		if (Cookie.get(key)) Cookie.set(key, '', -3600, path, domain);
	},
	secondsToExpireDate: function(ttl) {
		if (parseInt(ttl) == 'NaN' ) return '';
		else {
			now = new Date();
			now.setTime(now.getTime() + (parseInt(ttl) * 1000));
			return now.toGMTString();
		}
	},
	test: function() {
		Cookie.set('b49f729efde9b2578ea9f00563d06e57', 'true');
		if (Cookie.get('b49f729efde9b2578ea9f00563d06e57') == 'true') {
			Cookie.unset('b49f729efde9b2578ea9f00563d06e57');
			return true;
		}
		return false;
	},
	dump: function() {
		if (typeof console != 'undefined') {
			console.log(document.cookie.split(';'));
		}
	}
}

/**	倒计时
 *	@param endtime	String/Integer 结束时间 如:2014-04-02 11:00:00 或 1396407600
 *	@param starttime String/Integer 开始时间 如:2014-04-01 11:00:00 或 1396321200
 *	@param recall Object(function)/null/String 结束回调
 *	@param update Object(function)/null/String 更新回调
 *	@dayid	显示day元素id String
 *	@hourid 显示hour元素id String
 *	@minid 显示minute元素id String
 *	@secid	显示second元素id String
 *	@return void
 */
function clocker(options) {
	this.defaults = {
		endtime: 10,
		starttime: 0,
		recall: function(){},
		update: function(df, total){},
		dayid: 'day',
		hourid: 'hour',
		minid: 'min',
		secid: 'sec',
		onlySec: true,
		autoRun: false
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
		this.starttime;
	this.endtime;
	this.timeleft;
	this.timer;/*计时器*/
	this.timediff;
	this.fp = 10;
	this.paused = !0;
	this.counter = 0;/*计数器*/
	this.inc = 0;
	this.init();
}
clocker.prototype = {
	init: function() {
		this.endtime = /^\d+$/.test(this.options.endtime) ? parseInt(this.options.endtime) : strtotime(this.options.endtime.toString());
		this.starttime = /^\d+$/.test(this.options.starttime) ? parseInt(this.options.starttime) : strtotime(this.options.starttime.toString());
		this.timeleft = this.timediff = this.endtime - this.starttime;
		if(this.autoRun && this.timediff > 0)
			this.run();
	},
	run: function() {
		_self = this;
		_self.paused = !1;
		if(_self.timediff < 1 || _self.timer)
			return;
		var timer = function(td) {
			if(_self.options.onlySec) {
				var sec = td;
			} else {
				var day = parseInt(td/86400);
				var hour = parseInt((td%86400)/3600);
				var min = parseInt((td%3600)/60);
				var sec = td%60;
				if($id(_self.options.dayid))
					$id(_self.options.dayid).innerHTML = day;
				if($id(_self.options.hourid))
					$id(_self.options.hourid).innerHTML = hour;
				if($id(_self.options.minid))
					$id(_self.options.minid).innerHTML = min;
			}
			if($id(_self.options.secid))
				$id(_self.options.secid).innerHTML = sec;
			if(td > 0) {
				_self.timeleft = td;
				_self.counter++;
				if(_self.counter % _self.fp == 0) {
					_self.counter = 0;
					td = td - 1;
				}
				_self.timer = setTimeout(function(){
					try{clearTimeout(_self.timer)}catch(e){}
					if(typeof _self.options.update == 'function') {_self.options.update(td, _self.timediff)}
					timer(td);
				}, 1000/_self.fp);
			} else {
				_self.timeleft = 0;
				_self.timer = null;
				_self.counter = 0;
				if(typeof _self.options.update == 'function') {_self.options.update(td, _self.timediff)}
				if(typeof _self.options.recall == 'function') {_self.options.recall()}
			}
		}
		timer(_self.timeleft);
	},
	stop: function() {
		this.pause();
		this.timeleft = this.timediff;
	},
	pause: function() {
		try{clearTimeout(this.timer);this.timer=null;this.counter=0}catch(e){}
		this.paused = !0;
	},
	adjust: function(sec) {/*倒计时微调*/
		this.pause();
		this.timeleft += sec;
		if(this.timeleft <= 0) {
			this.timeleft = 0;
		}
		if(sec > 0) {
			this.timediff += sec;
		}
		this.run();
	},
	info: function() {
		return {
			starttime: this.options.starttime,
			endtime: this.endtime,
			starttime2: this.starttime,
			endtime2: this.endtime,
			timediff: this.timediff,
			timeleft: this.timeleft,
			timer: this.timer,
			counter: this.counter,
			paused: this.paused
		}
	}
}

function page(options) {
	this.defaults = {
		wrapId: 'wrapper',
		pageClass: 'page',
		pageCurrClass: 'curr',
		loop: false,/*是否允许循环*/
		loopForward: false,/*是否允许正向循环*/
		loopReverse: false/*是否允许逆向循环*/
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
		this.$main = $('#' + this.options.wrapId),
		this.$pages = $(this.$main).children('div.' + this.options.pageClass),
		this.pagesCount = $(this.$pages).length,
		this.current = 0;
	this.init();
}
page.prototype = {
	init: function() {
		$(this.$pages).each(function() {
			$(this).data('originalClassList', $(this).attr('class'));
		});
		this.pageTo(this.current);
	},
	nextPage: function() {
		if(this.pagesCount < 2)
			return;
		if(this.current < this.pagesCount - 1) {
			this.pageTo(this.current+1)
		} else {
			if(!this.options.loop || !this.options.loopForward) {/*prevent loop*/
				this.isAnimating = false;
				return false;
			}
			this.pageTo(0);
		}
	},
	prevPage: function() {
		if(this.pagesCount < 2)
			return;
		if((!this.options.loop || !this.options.loopReverse) && this.current < 1) {/*prevent loop*/
			return false;
		}

		if(this.current == 0) {
			this.pageTo(this.pagesCount - 1);
		} else {
			this.pageTo(this.current - 1);
		}
	},
	pageTo: function(_page) {
		$('.'+this.options.pageClass).removeClass(this.options.pageCurrClass).eq(_page).addClass(this.options.pageCurrClass);
		this.current = _page;
	},
	log: function(msg) {
		if(console && console.log)
			console.log(msg);
	}
}

/* notice */
function iNotice(info, options) {
	if(arguments.length > 1) {
		this.options = options || {};
		this.options.info = info || '';
	} else {
		this.options = info || {};
	}
	this.timer;
	this.notice;
	this.bg;
	this.attr = {};
	this.init();
}
iNotice.prototype = {
	init: function() {
		var defaults = {
			id: 'iNotice',
			info: '',
			color: '#fff',
			fontSize: '24px',
			zIndex: 999,
			bgColor: '#000',
			bgOpacity: 0.75
		};
		this.options = $.extend(defaults, this.options);/* initial params */
		this.attr.wWidth = $(window).width();
		this.attr.wHeight = $(window).height();
		if($('#'+this.options.id).length < 1) {
			$('<div id="'+this.options.id+'" class="notice"></div>').css({
				width: '100%',
				height: '100%',
				display: 'none',
				color: this.options.color,
				fontSize: this.options.fontSize,
				textAlign: 'center',
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.options.zIndex
			}).prependTo('body');
			$('<span id="'+this.options.id+'_info" class="notice_info">'+this.options.info+'</span>').css({
				width: this.attr.wWidth+'px',
				height: this.attr.wHeight+'px',
				fontSize: 'inherit',
				color: 'inherit',
				display: $.browser.msie&&$.browser.version<=7.0?'block':'table-cell',
				verticalAlign: 'middle'
			}).appendTo('#'+this.options.id);
			$('<div id="'+this.options.id+'_cover" class="notice_cover"></div>').css({
				width:'100%',
				height: (this.attr.wHeight>$(document).height()?this.attr.wHeight:$(document).height())+'px',
				display: 'none',
				position: 'absolute',
				left: 0,
				top: 0,
				backgroundColor: this.options.bgColor,
				opacity: this.options.bgOpacity,
				zIndex: this.options.zIndex-1
			}).prependTo('body');
		}
		this.notice = $('#'+this.options.id);
		this.bg = $('#'+this.options.id+'_cover');
		this.timer;
		this.timer2;
		return true;
	},
	setInfo: function(info, timeout, callback, showwaiting, wordflag, space, timeout2, wordLength) {
		var _self = this;
		var timeout = isUndefined(timeout) ? 0 : parseInt(timeout);
		var showwaiting = isUndefined(showwaiting) ? 0 : showwaiting;
		var wordflag = isUndefined(wordflag) ? '.' : wordflag;
		var space = isUndefined(space) ? '&nbsp;' : space;
		var wordlength = isUndefined(wordlength) ? 3 : parseInt(wordlength);
		var timeout2 = isUndefined(timeout2) ? 500 : parseInt(timeout2);
		$('#'+_self.options.id+'_info').html(info);
		try{clearTimeout(_self.timer2)}catch(e){}
		if(timeout > 0) {
			try{clearTimeout(_self.timer)}catch(e){}
			_self.timer = null;
			_self.timer = setTimeout(function(){_self.hide();if(typeof callback == 'function'){callback()}}, timeout*1000);
		}
		var poll = function(count){
			var count = isUndefined(count) ? 0 : parseInt(count);
			var flag = '';
			flag += new Array(count+1).join(wordflag) + new Array(wordlength-count+1).join(space);
			var showword = info + flag;
			$('#'+_self.options.id+'_info').html(showword);
			count++;
			if(count>wordlength) count = 0;
			_self.timer2 = setTimeout(function(){try{clearTimeout(_self.timer2)}catch(e){}poll(count)},timeout2);
		}
		if(showwaiting) {
			poll();
		}
		_self.show();
	},
	show: function() {
		$('#'+this.options.id+'_info').css({width: $(window).width()+'px',height: $.browser.msie&&$.browser.version<=7.0?'auto':$(window).height()+'px', paddingTop:$.browser.msie&&$.browser.version<=7.0?$(window).height()/2+'px':0});
		$('#'+this.options.id+'_cover').css({width: '100%',height: ($(document).height()>$(window).height()?$(document).height():$(window).height())+'px'});
		$(this.notice).show();
		$(this.bg).show();
	},
	hide: function() {
		try{clearTimeout(this.timer2)}catch(e){}
		$(this.notice).hide();
		$(this.bg).hide();
	}
}

/* audio */
function iAudio(options) {
	this.defaults = {
		attrs: {
			loop: false,
			preload: 'auto',
			src: '',
			autoplay:true
		},
		_key: 0,
		initCallback: function(){},
		playCallback: function(){},
		pauseCallback: function(){},
		loadedCallback: function(){}
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
		this._audio = null,
		this._initialed = false,
		this._playing = false,
		this._loaded = false;
	this.run();
}
iAudio.prototype = {
	init: function() {
		var _self = this;
		try {
			_self._audio = new Audio;
		} catch(e) {
			return false;
		}

		this._audio.addEventListener('loadeddata', function() {
			_self._loaded = true;
			if(_self.options.attrs.autoplay && _self.options.attrs.preload == 'auto') {
				_self.play();
			}
			try {
				_self.options.loadedCallback(_self);
			} catch(e) {
				_self.log('loadedCallback fail !');
			}
		}, false);
		this._audio.addEventListener('play', function() {
			_self._playing = true;
			try {
				_self.options.playCallback(_self);
			} catch(e) {
				_self.log('playCallback fail !');
			}
		}, false);
		this._audio.addEventListener('pause', function() {
			_self._playing = false;
			try {
				_self.options.pauseCallback(_self);
			} catch(e) {
				_self.log('pauseCallback fail !');
			}
		}, false);
		this._audio.addEventListener('abort', function() {
			//alert('abort');
		}, false);
		this._audio.addEventListener('error', function() {
			//alert('error');
		}, false);
		this._audio.addEventListener('ended', function() {
			try{_self._audio.currentTime = 0}catch(e){}
		}, false);
		for(var k in this.options.attrs) {
			if ((this.options.attrs).hasOwnProperty(k) && k in this._audio) {
				this._audio[k] = (this.options.attrs)[k];
			}
		}
		if(this.options.attrs.autoplay || this.options.attrs.preload == 'auto') {
			try{this._audio.load()}catch(e){}
		}
		try {
			_self.options.initCallback(_self);
		} catch(e) {
			_self.log('initCallback fail !');
		}
		this._initialed = true;
		return true;
	},
	load: function() {
		this._audio.load();
	},
	toggle: function() {
		if (!this._playing) {
			this.play();
		} else {
			this.pause();
		}
	},
	play: function() {
		if (this._audio) this._audio.play();
	},
	pause: function() {
		if (this._audio) this._audio.pause();
	},
	stop: function() {
		if (this._audio) {
			this._audio.pause();
			try{this._audio.currentTime = 0}catch(e){}/*iphone4s safari 会出js错误*/
		}
	},
	log: function(msg) {
		if(console && console.log)
			console.log(msg);
	},
	run: function() {
		if(!this._initialed) {
			return this.init();
		} else {
			return this._audio == null ? false : true;
		}
	}
}

/* asker */
function iAsker(options) {
	this.defaults = {
		wrapId: 'asker',
		questions: [],/*题目*/
		prevBtn: 'prevBtn',/*上一题按钮类名*/
		nextBtn: 'nextBtn',/*下一题按钮类名*/
		optionClass: 'option',/* 选项类名 */
		prevBtnClick: function(askobj){},/*点上一题按钮回调*/
		nextBtnClick: function(askobj){},/*点下一题按钮回调*/
		optionClick: function(optionid, question, askobj){},/*点击选项回调*/
		initCallback: function(total, askobj){},/*初始化回调*/
		showCallback: function(question, pointer, total){},/*载入选题回调*/
		overCallback: function(askobj){},/*答题结束回调函数*/
		touchSupport: false/*是否支持触屏*/
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
		this.questions;
	this.pointer,/*当前题目指针,从0开始*/
		this.counter,/*总题目数*/
		this.selected;/*当前题是否已选*/
	this.init();
}
iAsker.prototype = {
	init: function() {
		this.questions = this.options.questions;
		this.pointer = 0;
		this.counter = this.questions.length;
		this.selected = false;
		/*bind event*/
		this.bindEvent();
		if(typeof this.options.initCallback == 'function') {
			this.options.initCallback(this.counter, this);
		}
	},
	show: function(pointer) {
		this.pointer = pointer || this.pointer;
		this.selected = false;
		if(typeof this.options.showCallback == 'function') {
			this.options.showCallback(this.questions[this.pointer]||{}, this.pointer, this.counter);
		}
	},
	pointerNext: function() {
		return ++this.pointer>=this.counter?--this.pointer:this.pointer;
	},
	pointerPrev: function() {
		return --this.pointer<0?++this.pointer:this.pointer;
	},
	showNext: function() {
		if(this.pointer == this.pointerNext()) {
			return;
		}
		this.show();
	},
	showPrev: function() {
		if(this.pointer == this.pointerPrev()) {
			return;
		}
		this.show();
	},
	bindEvent: function() {
		var _self = this;
		$('.'+_self.options.nextBtn).bind(this.options.touchSupport?'touchend':'click', function(){
			_self.showNext();
		});
		$('.'+_self.options.prevBtn).bind(this.options.touchSupport?'touchend':'click', function(){
			_self.showPrev();
		});
		$('#'+_self.options.wrapId).on(touchSupport?'touchend':'click', '.'+_self.options.optionClass, function(){
			this.selected = true;
			_self.options.optionClick($(this).attr('id'), _self.questions[_self.pointer]||{}, _self);
			if(_self.pointer+1>=_self.counter) {
				_self.options.overCallback(_self);
			}
		});
	}
}

function shuffle(inputArr) {
	var valArr = [],
		k = '',
		i = 0,
		strictForIn = false,
		populateArr = [];

	for (k in inputArr) { // Get key and value arrays
		if (inputArr.hasOwnProperty(k)) {
			valArr.push(inputArr[k]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function() {
		return 0.5 - Math.random();
	});

	// BEGIN REDUNDANT
	this.php_js = this.php_js || {};
	this.php_js.ini = this.php_js.ini || {};
	// END REDUNDANT
	strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js
			.ini['phpjs.strictForIn'].local_value !== 'off';
	populateArr = strictForIn ? inputArr : populateArr;

	for (i = 0; i < valArr.length; i++) { // Repopulate the old array
		populateArr[i] = valArr[i];
	}

	return strictForIn || populateArr;
}

function strtotime(text, now) {

	var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

	if (!text) {
		return fail;
	}

	/* Unecessary spaces */
	text = text.replace(/^\s+|\s+$/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/[\t\r\n]/g, '')
		.toLowerCase();

	/* in contrast to php, js Date.parse function interprets: */
	/* dates given as yyyy-mm-dd as in timezone: UTC, */
	/* dates with "." or "-" as MDY instead of DMY */
	/* dates with two-digit years differently */
	/* etc...etc... */
	/* ...therefore we manually parse lots of common date formats */
	match = text.match(
		/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

	if (match && match[2] === match[4]) {
		if (match[1] > 1901) {
			switch (match[2]) {
				case '-':
				{
					// YYYY-M-D
					if (match[3] > 12 || match[5] > 31) {
						return fail;
					}

					return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
				case '.':
				{
					/* YYYY.M.D is not parsed by strtotime() */
					return fail;
				}
				case '/':
				{
					/* YYYY/M/D */
					if (match[3] > 12 || match[5] > 31) {
						return fail;
					}

					return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			}
		} else if (match[5] > 1901) {
			switch (match[2]) {
				case '-':
				{
					/* D-M-YYYY */
					if (match[3] > 12 || match[1] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
				case '.':
				{
					/* D.M.YYYY */
					if (match[3] > 12 || match[1] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
				case '/':
				{
					/* M/D/YYYY */
					if (match[1] > 12 || match[3] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			}
		} else {
			switch (match[2]) {
				case '-':
				{
					/* YY-M-D */
					if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
						return fail;
					}

					year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
					return new Date(year, parseInt(match[3], 10) - 1, match[5],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
				case '.':
				{
					/* D.M.YY or H.MM.SS */
					if (match[5] >= 70) {
						/* D.M.YY */
						if (match[3] > 12 || match[1] > 31) {
							return fail;
						}

						return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
								match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					if (match[5] < 60 && !match[6]) {
						/* H.MM.SS */
						if (match[1] > 23 || match[3] > 59) {
							return fail;
						}

						today = new Date();
						return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
								match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
					}

					/* invalid format, cannot be parsed */
					return fail;
				}
				case '/':
				{
					/* M/D/YY */
					if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
						return fail;
					}

					year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
					return new Date(year, parseInt(match[1], 10) - 1, match[3],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
				case ':':
				{
					/* HH:MM:SS */
					if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
						return fail;
					}

					today = new Date();
					return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
							match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
				}
			}
		}
	}

	/* other formats and "now" should be parsed by Date.parse() */
	if (text === 'now') {
		return now === null || isNaN(now) ? new Date()
			.getTime() / 1000 | 0 : now | 0;
	}
	if (!isNaN(parsed = Date.parse(text))) {
		return parsed / 1000 | 0;
	}

	date = now ? new Date(now * 1000) : new Date();
	days = {
		'sun': 0,
		'mon': 1,
		'tue': 2,
		'wed': 3,
		'thu': 4,
		'fri': 5,
		'sat': 6
	};
	ranges = {
		'yea': 'FullYear',
		'mon': 'Month',
		'day': 'Date',
		'hou': 'Hours',
		'min': 'Minutes',
		'sec': 'Seconds'
	};

	function lastNext(type, range, modifier) {
		var diff, day = days[range];

		if (typeof day !== 'undefined') {
			diff = day - date.getDay();

			if (diff === 0) {
				diff = 7 * modifier;
			} else if (diff > 0 && type === 'last') {
				diff -= 7;
			} else if (diff < 0 && type === 'next') {
				diff += 7;
			}

			date.setDate(date.getDate() + diff);
		}
	}

	function process(val) {
		var splt = val.split(' '), /* Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes */
			type = splt[0],
			range = splt[1].substring(0, 3),
			typeIsNumber = /\d+/.test(type),
			ago = splt[2] === 'ago',
			num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

		if (typeIsNumber) {
			num *= parseInt(type, 10);
		}

		if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
			return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
		}

		if (range === 'wee') {
			return date.setDate(date.getDate() + (num * 7));
		}

		if (type === 'next' || type === 'last') {
			lastNext(type, range, num);
		} else if (!typeIsNumber) {
			return false;
		}

		return true;
	}

	times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
		'|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
		'|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
	regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

	match = text.match(new RegExp(regex, 'gi'));
	if (!match) {
		return fail;
	}

	for (i = 0, len = match.length; i < len; i++) {
		if (!process(match[i])) {
			return fail;
		}
	}

	return (date.getTime() / 1000);
}