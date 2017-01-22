/**
 * Created by jie.ding on 2015/11/25.
 */
var Tip,Ask,Pager,touchSupport='ontouchend' in document,_counter=0,_hits=[],_hits2=[];
var audio, audio_yes, audio_no;
var dataForWeixinShare = {
	title:'翻滚吧！二次元！',
	content:'二次元词语大考验，据说颜值高的才能通关！',
	imgurl:'http://shouji.sogou.com/sapp/erciyuan/static/i/sharepic.jpg',
	contenturl:'http://shouji.sogou.com/sapp/erciyuan/'
}
var dataForWeiboShare = {
	title:'翻滚吧！二次元！',
	content:'#翻滚吧二次元# @搜狗输入法 【二次元词语大考验】，据说颜值高的才能通关！',
	imgurl:'http://shouji.sogou.com/sapp/erciyuan/static/i/sharepic_wb.jpg',
	contenturl:'http://shouji.sogou.com/sapp/erciyuan/'
}
var WXTIP_ST = null;
function show_weixin_share() {
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	var eleId = 'dialog_weixin';
	var bgId = eleId+'_cover';
	var dialogWidth = $('#'+eleId).width();
	var dialogHeight = $('#'+eleId).height();

	var show = function() {
		$('#'+bgId).remove();
		$('body').prepend($('#'+eleId));
		$('body').prepend('<div id="'+bgId+'" class="menu_cover share_menu_cover"></div>');
		$('#'+eleId).show();
		$('#'+bgId).unbind('click').click(function(){hide()});
		try{clearTimeout(WXTIP_ST)}catch(e){}
		WXTIP_ST = setTimeout(function(){hide()}, 2500);
		$('#'+bgId).css({
			width:'100%',
			height:(winHeight>$(document).height()?winHeight:$(document).height())+'px',
			zIndex:998
		});
	}
	var hide = function() {
		try{clearTimeout(WXTIP_ST)}catch(e){}
		$('#'+eleId).hide();
		$('#'+bgId).unbind('click').remove();
	}
	show();
}
function share() {
	pb_count('btn_share_total');
	if(isWeiXin()) {
		show_weixin_share();
		return;
	}
	show_share();
}
function show_share() {
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	var eleId = 'share-wrap';
	var bgId = eleId+'_cover';
	var show = function() {
		$('#share-wrap').css('z-index','999').show();
		$('#'+bgId).remove();
		$('body').prepend('<div id="'+bgId+'" class="menu_cover share_cover"></div>');
		$('#'+eleId).show();
		$('#'+bgId).unbind('click').click(function(){hide()});
		$('#'+bgId).css({
			width:'100%',
			height:(winHeight>$(document).height()?winHeight:$(document).height())+'px',
			zIndex:998
		});
	}
	var hide = function() {
		$('#'+eleId).hide();
		$('#'+bgId).unbind('click').remove();
	}
	show();
}
function share_wb() {
	pb_count('btn_share_weibo');
	var _t = dataForWeiboShare.content+' '+dataForWeiboShare.contenturl;
	window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(_t)+'&pic='+encodeURIComponent(dataForWeiboShare.imgurl)+'&source=bookmark','_blank','width=450,height=400');
}
function share_qzone() {
	pb_count('btn_share_qzone');
	var p = {
		url: dataForWeixinShare.contenturl,
		showcount: '0', /*是否显示分享总数,显示：'1'，不显示：'0' */
		desc: '', /*默认分享理由(可选)*/
		summary: dataForWeixinShare.content, /*分享摘要(可选)*/
		title: dataForWeixinShare.title, /*分享标题(可选)*/
		site: '搜狗输入法', /*分享来源 如：腾讯网(可选)*/
		pics: dataForWeixinShare.imgurl, /*分享图片的路径(可选)*/
		style: '203',
		width: 22,
		height: 22
	};
	var s = [];
	for (var i in p) {
		s.push(i + '=' + encodeURIComponent(p[i] || ''));
	}
	window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&'),'_blank','width=450,height=400');
}
function show_score_plus(_tp) {
	var _tp = typeof _tp == 'undefined' ? 1 : _tp;
	var person = {};
	var tip = {};
	$('#meter').stop().remove();
	tip.ele = $('#hideWrap .meter:first').clone();
	$(tip.ele).attr('id', 'meter');
	$(tip.ele).html(_tp>0?'+1000':'-1000');
	$('body').append(tip.ele);

	person.offset = $('#person').offset();
	person.width = $('#person').width();
	person.height = $('#person').height();
	tip.width =  $('#meter').width();
	tip.height =  $('#meter').height();

	$('#meter').css({
		position: 'absolute',
		left: person.offset.left+person.width/2 + (Math.random()>0.5?1:(-1))*5*Math.random(),
		top: person.offset.top - tip.height/2 + (Math.random()>0.5?1:(-1))*5*Math.random(),
		zIndex: 3
	}).show();
}
function done() {
	var yesnum = _hits.length;
	//var _s = 2*yesnum-_counter+_hits2.length;//单位:千米
	var _s = yesnum;
	$('#ppic').html('');
	if(yesnum < 1) {
		$('#words').html('<p><span class="whead">纳尼？</span></p><p>你竟然全错！难道你就是</p><p>传说中的<span class="wbig">老腊肉</span>？</p>');
		$('#ppic').html('<img src="static/i/oldman.png" />');
	} else if(yesnum <= 8) {
		$('#words').html('<p><span class="whead">啧啧啧！</span></p><p>才答对<span class="wred">'+yesnum+'</span>道题，翻滚了<span class="wred">'+_s*1000+'</span>米！</p><p>难道你就是传说中的<span class="wbig">老腊肉</span>？</p>');
		$('#ppic').html('<img src="static/i/oldman.png" />');
	} else if(yesnum < window['questions'].length) {
		$('#words').html('<p><span class="whead">好棒！</span></p><p>你答对<span class="wred">'+yesnum+'</span>道题，一共翻滚了<span class="wred">'+_s*1000+'</span>米！</p><p>你一定是个好学的<span class="wbig">小年轻</span>！</p>');
		$('#ppic').html('<img src="static/i/younger.png" />');
	} else {
		$('#words').html('<p>天啦噜！你全都答对了！</p><p>一共翻滚了'+_s*1000+'米！</p><p><span class="wbig">小鲜肉</span>就是你！</p>');
		$('#ppic').html('<img src="static/i/freshman.png" />');
	}
	/*reset share*/
	if(isWeiXin()) {
		var title = dataForWeixinShare.title;
		var desc;
		if(yesnum < 1) {
			desc = '二次元词语大考验！我竟然一直在原地翻滚！被鉴定成老腊肉了！你能翻滚多少米？';
		} else if(yesnum <= 8) {
			desc = '二次元词语大考验！我翻滚了'+_s+'千米！都成老腊肉了！你能翻滚多少米？';
		} else if(yesnum < window['questions'].length) {
			desc = '二次元词语大考验！我翻滚了'+_s+'千米！经鉴定我就是小年轻！你能翻滚多少米？';
		} else {
			desc = '二次元词语大考验！据说能全答对的小鲜肉没几个，我就是其中之一！不服来战！';
		}
		var link = dataForWeixinShare.contenturl;
		var imgUrl = dataForWeixinShare.imgurl;
		wx.onMenuShareTimeline({
			title: desc,
			link: link,
			imgUrl: imgUrl,
			success: function (res) {
				pb_count('share_weixin_timeline_succ');
			},
			cancel: function (res) {
				pb_count('share_weixin_timeline_cancel');
			},
			fail: function (res) {
				pb_count('share_weixin_timeline_fail');
			}
		});
		wx.onMenuShareAppMessage({
			title: title,
			desc: desc,
			link: link,
			imgUrl: imgUrl,
			success: function (res) {
				pb_count('share_weixin_appmes_succ');
			},
			cancel: function (res) {
				pb_count('share_weixin_appmes_cancel');
			},
			fail: function (res) {
				pb_count('share_weixin_appmes_fail');
			}
		});
		wx.onMenuShareQQ({
			title: title,
			desc: desc,
			link: link,
			imgUrl: imgUrl,
			success: function (res) {
			},
			cancel: function (res) {
			},
			fail: function (res) {
			}
		});
		wx.onMenuShareWeibo({
			title: title,
			desc: desc,
			link: link,
			imgUrl: imgUrl,
			success: function (res) {
			},
			cancel: function (res) {
			},
			fail: function (res) {
			}
		});
	}
	if(yesnum < 1) {
		dataForWeiboShare.content = '#翻滚吧二次元# @搜狗输入法 【二次元词语大考验】，我竟然一直在原地翻滚！被鉴定成老腊肉了！你能翻滚多少米？';
	} else if(yesnum <= 8) {
		dataForWeiboShare.content = '#翻滚吧二次元# @搜狗输入法 【二次元词语大考验】，我翻滚了'+_s+'千米！都成老腊肉了！你能翻滚多少米？';
	} else if(yesnum < window['questions'].length) {
		dataForWeiboShare.content = '#翻滚吧二次元# @搜狗输入法 【二次元词语大考验】，我翻滚了'+_s+'千米！经鉴定我就是小年轻！你能翻滚多少米？';
	} else {
		dataForWeiboShare.content = '#翻滚吧二次元# @搜狗输入法 【二次元词语大考验】，据说能全答对的小鲜肉没几个，我就是其中之一！不服来战！';
	}
	post_form();
	setTimeout(function(){Pager.nextPage()}, 800);
}
function init_size_data() {
	$('#asker-wrap').data({
		height: parseFloat($('#asker-wrap').css('height').replace(/\s*(px|%)/,''), 10)/100
	});
	$('#asker-cont').data({
		ratio: 600/672,
		height: parseFloat($('#asker-cont').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#asker-wrap').data('height')
	});
	$('#asker-timer').data({
		ratio: 2,
		height: parseFloat($('#asker-timer').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#asker-wrap').data('height')
	});
	$('#asker-option').data({
		height: parseFloat($('#asker-option').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#asker-wrap').data('height')
	});
	$('#asker-option .option').each(function(idx){
		$('#asker-option').data({
			opt_height: parseFloat($(this).css('height').replace(/\s*(px|%)/,''), 10)/100*$('#asker-option').data('height')
		});
	});
	$('#animate').data({
		height: parseFloat($('#animate').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#asker-wrap').data('height')
	});
	$('#anitop').data({
		height: parseFloat($('#anitop').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#animate').data('height')
	});
	$('#anibot').data({
		height: parseFloat($('#anibot').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#animate').data('height')
	});
	$('#result-wrap').data({
		height: parseFloat($('#result-wrap').css('height').replace(/\s*(px|%)/,''), 10)/100
	});
	$('#result-cont').data({
		ratio: 600/640,
		height: parseFloat($('#result-cont').css('height').replace(/\s*(px|%)/,''), 10)/100*$('#result-wrap').data('height')
	});
	$('#u-audio').data({
		ratio: 1,
		height: parseFloat($('#u-audio').css('height').replace(/\s*(px|%)/,''), 10)/100
	});
}
function resize() {
	$('body').css('font-size', function(){
		var fz = $(window).height()/40;
		return (fz<6?6:fz)+'px';
	});

	var _w_cont = $(window).height()*$('#asker-cont').data('height')*$('#asker-cont').data('ratio')/$(window).width();
	_w_cont = _w_cont > 0.94 ? 0.94 : _w_cont;
	$('#asker-cont').css('width', _w_cont*100+'%');

	var _w_timer = $(window).height()*$('#asker-timer').data('height')*$('#asker-timer').data('ratio');
	$('#asker-timer').css({
		width:_w_timer+'px',
		height:_w_timer/2+'px',
		borderRadius:'0 0 '+_w_timer+'px '+_w_timer+'px',
		lineHeight: _w_timer/2+'px',
		top: '1.5%',
		left: ($(window).width()*_w_cont/2-_w_timer/2)+'px'
	});
	$('.ph2-3').css('height', _w_timer/2+$(window).height()*$('#asker-wrap').data('height')*0.04+'px');
	$('#asker-option .option').each(function(){
		var _h = $(window).height()*$('#asker-option').data('opt_height');
		$(this).css({
			height:_h+'px',
			paddingLeft:(_h+5)+'px',
			lineHeight:_h+'px'
		});
	});
	var _h_person = $(window).height()*$('#anitop').data('height')*0.9;
	$('#person').css({
		width:(_h_person*9/8-1)+'px',
		height:_h_person+'px'
	});
	var _h_flager = $(window).height()*$('#anitop').data('height')*0.4;
	$('#flager').css({
		width:_h_flager*17/36+'px',
		height:_h_flager+'px'
	});
	/*cursor*/
	var _w_border_top = $(window).height()*$('#anibot').data('height')*0.3;
	$('#cursor').css({
		borderLeftWidth:0.75*_w_border_top+'px',
		borderRightWidth:0.75*_w_border_top+'px',
		borderTopWidth: _w_border_top+'px'
	});
	/*result page*/
	var _w_cont = $(window).height()*$('#result-cont').data('height')*$('#result-cont').data('ratio')/$(window).width();
	_w_cont = _w_cont > 0.94 ? 0.94 : _w_cont;
	$('#result-cont').css('width', _w_cont*100+'%');
	/*audio*/
	var _w_audio = $(window).height()*$('#u-audio').data('height')*$('#u-audio').data('ratio');
	$('#u-audio').css('width', _w_audio+'px');
}
function post_form() {
	if($("#post_form").attr('ajaxing')) {
		return;
	}
	$("#post_form").attr('ajaxing', true);
	$("#post_form").ajaxSubmit({
		success:function(respon) {
			//if(console && console.log) console.log(respon);
		},
		error:function(){
			if(console && console.log) console.log('post error');
		},
		complete:function(XMLHttpRequest, status){
			$("#post_form").removeAttr('ajaxing');
			if(status == 'timeout') {
				XMLHttpRequestabort();
				if(console && console.log) console.log('post timeout');
			}
		}
	});
}
$(function(){
	/* calculate size */
	init_size_data();
	resize();
	$(document).on(touchSupport?'touchstart':'mousedown', '*[clickbtn="true"]', function(){
		if($(this).css('position') == 'absolute') {
			$(this).css({left:parseInt($(this).css('left'))+1,top:parseInt($(this).css('top'))+1});
		} else {
			$(this).addClass('clickbtn');
		}
	}).on(touchSupport?'touchend':'mouseup', '*[clickbtn="true"]', function(){
		if($(this).css('position') == 'absolute') {
			$(this).css({left:parseInt($(this).css('left'))-1,top:parseInt($(this).css('top'))-1});
		} else {
			$(this).removeClass('clickbtn');
		}
	});
	$('a.btns').each(function(){
		if(!$(this).attr('initialized')) {
			$(this).children('img:first').data('src', $(this).children('img:first').attr('src'));
			$(this).children('img:first').data('src2', ($(this).children('img:first').attr('src')).replace(/(\S+)\.(png|jpg|jpeg|gif)/, '$12.$2'))
			$(this).attr('initialized', true);
		}
	});
	$('a.btns').bind(touchSupport?'touchstart':'mousedown', function(){
		$(this).children('img:first').attr('src', $(this).children('img:first').data('src2'));
	}).bind(touchSupport?'touchend':'mouseup', function(){
		$(this).children('img:first').attr('src', $(this).children('img:first').data('src'));
	});
	$('#start').bind(touchSupport?'touchend':'click', function(){
		pb_count('btn_start');
		Asker.show();
		Pager.nextPage();
		if(isIOS()) {
			audio_yes.play();
			audio_yes.stop();
			audio_no.play();
			audio_no.stop();
		}
		audio.play();
		$('#u-audio').attr('playing', 'true');
	});
	$('#btnreplay').bind(touchSupport?'touchend':'click', function(){
		pb_count('btn_replay');
		document.location.href = './';
	});
	$('#btnshare').bind('click', function(){
		share();
	});
	$('#share-qzone').bind(touchSupport?'touchend':'click', function(){
		share_qzone();
	});
	$('#share-wb').bind(touchSupport?'touchend':'click', function(){
		share_wb();
	});
	audio = new iAudio({
		attrs: {
			loop: true,
			preload: 'auto',
			src: 'http://wap.dl.pinyin.sogou.com/wapdl/hole/201510/10/music_bg.mp3',
			autoplay: true
		},
		initCallback: function(o) {
			$('#btn_audio').bind(touchSupport?'touchend':'click', function(){
				o.toggle();
				setTimeout(function(){
					if(o._playing) {
						$('#u-audio').attr('playing', 'true');
					} else {
						$('#u-audio').removeAttr('playing');
					}
				}, 50);
			});
			if(o.options.attrs.autoplay) {
				$('#u-audio').attr('playing', 'true');
			}
			$('#u-audio').prependTo('#wrapper');
			$('#u-audio>#btn_audio').html('<span class="audio_open"></span>');
		},
		playCallback: function(o) {
			$('#u-audio>#btn_audio').addClass('audioRate').html('<span class="audio_open"></span>');
		},
		pauseCallback: function(o) {
			$('#u-audio>#btn_audio').removeClass('audioRate').html('<span class="audio_off"></span>');
		}
	});
	if(isIOS) {
		audio_yes = new iAudio({
			attrs: {
				loop: false,
				preload: 'auto',
				src: 'http://wap.dl.pinyin.sogou.com/wapdl/hole/201510/10/music_yes.mp3',
				autoplay: false
			}
		});
		audio_no = new iAudio({
			attrs: {
				loop: false,
				preload: 'auto',
				src: 'http://wap.dl.pinyin.sogou.com/wapdl/hole/201510/10/music_no.mp3',
				autoplay: false
			}
		});
	}
	Tip = new iNotice();
	Asker = new iAsker({
		wrapId: 'asker',
		questions: window['questions']||[],
		optionClass: 'option',
		optionClick: function(optionid, question, askobj){
			if($.isEmptyObject(question)) {
				return;
			}
			if($('#'+askobj.options.wrapId).attr('done')) {
				return;
			}
			$('#'+askobj.options.wrapId).attr('done', true);
			var code = $('#'+optionid).attr('code');
			var optid = $('#'+optionid).attr('value');
			var input_optid = '<input type="hidden" name="optid['+question.id+']" value="'+optid+'" />';
			var input_code = '<input type="hidden" name="code['+question.id+']" value="'+code+'" />';
			if($('#post_form').find('input[name="optid['+question.id+']"]').length > 0) {
				$('#post_form').find('input[name="optid['+question.id+']"]').replaceWith(input_optid);
			} else {
				$('#post_form').append(input_optid);
			}
			if($('#post_form').find('input[name="code['+question.id+']"]').length > 0) {
				$('#post_form').find('input[name="code['+question.id+']"]').replaceWith(input_code);
			} else {
				$('#post_form').append(input_code);
			}
			//var _num = 2*_hits.length-_counter+_hits2.length;
			var _num = _hits.length;
			_counter++;
			if(question.options[code] && parseInt(question.options[code].checked) == 1) {/*select right*/
				if(!in_array(question.id, _hits)) {
					_hits.push(question.id);
					_num += 1;
				}
				if(_num<0) {
					_num = 0;
				}
				if(isIOS() && $('#u-audio').attr('playing')) {
					audio_yes.stop();
					audio_yes.play();
				}
				$('#'+optionid).addClass('mGreen').children('span').eq(0).html('<img src="static/i/str.png" width="27" />');
				/*person roll*/
				$('#person').addClass('running').animate({left:_num/askobj.counter*90+'%'}, 600, function(){$(this).removeClass('running')});
				$('#cursor').animate({left:2+_num/askobj.counter*90+'%'}, 600);
				/*score plus*/
				show_score_plus(1);
			} else {/*select wrong*/
				$('#'+optionid).addClass('mRed');
				for(var _code in question.options) {
					if(question.options[_code].checked == 1) {
						$('#option'+_code).addClass('mGreen');
					}
				}
				//_num -= 1;
				if(_num<0) {
					if(!in_array(question.id, _hits2)) {
						//_hits2.push(question.id);
					}
					_num = 0;
				}
				if(isIOS() && $('#u-audio').attr('playing')) {
					audio_no.stop();
					audio_no.play();
				}
				/*person roll*/
				//var _ani_name = _num==0&&parseInt(($('#person').css('left')).replace(/\s*(px|%)/,''),10)==0?'running3':'running2';
				var _ani_name = 'running3';
				$('#person').addClass(_ani_name).animate({left:_num/askobj.counter*90+'%'}, 600, function(){$(this).removeClass(_ani_name)});
				$('#cursor').animate({left:2+_num/askobj.counter*90+'%'}, 600);
				/*score plus*/
				//show_score_plus(0);
			}
			setTimeout(function(){
				if(Asker.pointer + 1 < Asker.counter) {
					$('#'+askobj.options.wrapId).removeAttr('done');
				}
				Asker.showNext();
			}, 650);
		},
		initCallback: function(total) {
			//$('#goal').html(total*1000);
		},
		showCallback: function(question, pointer, total) {
			if($.isEmptyObject(question)) {
				return;
			}
			$('#asker-title').html(function(){
				return question.content;
			});
			$('#asker-option').html(function(){
				var _opts = [];
				for(var k in question.options) {
					_opts.push('<a href="javascript:;" class="option" id="option'+question.options[k].code+'" code="'+question.options[k].code+'" value="'+question.options[k].id+'" clickbtn="true">'+question.options[k].content+'<span class="imgwrap"></span></a>');
				}
				_opts = shuffle(_opts);
				return _opts.join('');
			});
			$('#asker-timer').html((pointer+1)+'/'+total);
			resize();
		},
		overCallback: function(askobj) {
			/*calculate scores*/
			setTimeout(function(){done()}, 500);
		},
		touchSupport: touchSupport
	});
	Pager = new page({
		wrapId: 'wrapper',
		pageClass: 'page',
		pageCurrClass: 'curr'
	});
});
$(window).resize(function(){resize()});
if(isWeiXin()) {
	appendscript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', '', function(){
		appendscript('http://shouji.sogou.com/api/weixin/jssdk/wxconfig.php?rurl='+encodeURIComponent(document.location.href), '', function(){
			var wxconfig = window['wxconfig'] || '';
			if(wxconfig) {
				wx.config({
					appId: wxconfig.appId,
					timestamp: wxconfig.timestamp,
					nonceStr: wxconfig.nonceStr,
					signature: wxconfig.signature,
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo'
					]
				});
				wx.ready(function () {
					var title = dataForWeixinShare.title;
					var desc = dataForWeixinShare.content;
					var link = dataForWeixinShare.contenturl;
					var imgUrl = dataForWeixinShare.imgurl;
					wx.onMenuShareTimeline({
						title: desc,
						link: link,
						imgUrl: imgUrl,
						success: function (res) {
							pb_count('share_weixin_timeline_succ');
						},
						cancel: function (res) {
							pb_count('share_weixin_timeline_cancel');
						},
						fail: function (res) {
							pb_count('share_weixin_timeline_fail');
						}
					});
					wx.onMenuShareAppMessage({
						title: title,
						desc: desc,
						link: link,
						imgUrl: imgUrl,
						success: function (res) {
							pb_count('share_weixin_appmes_succ');
						},
						cancel: function (res) {
							pb_count('share_weixin_appmes_cancel');
						},
						fail: function (res) {
							pb_count('share_weixin_appmes_fail');
						}
					});
					wx.onMenuShareQQ({
						title: title,
						desc: desc,
						link: link,
						imgUrl: imgUrl,
						success: function (res) {
						},
						cancel: function (res) {
						},
						fail: function (res) {
						}
					});
					wx.onMenuShareWeibo({
						title: title,
						desc: desc,
						link: link,
						imgUrl: imgUrl,
						success: function (res) {
						},
						cancel: function (res) {
						},
						fail: function (res) {
						}
					});
				});
			}
		});
	});
}