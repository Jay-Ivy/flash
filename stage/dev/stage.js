/**
 * Created by jie.ding on 2015/11/19.
 *
 * 实现动画秀h5动画框架
 */
(function($) {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    // 判断客户端版本
    var CLIENT = {
        trident: /(Trident)/i.test(ua), // IE内核
        presto: /(Presto)/i.test(ua), // opera内核
        webKit: /(AppleWebKit)/i.test(ua), // google内核
        gecko: /(Trident)/i.test(ua), // 火狐内核
        ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: /(Android|Linux)/i.test(ua),
        iPhone: /(iPhone|Mac)/i.test(ua),
        iPad: /(iPad)/i.test(ua),
        wechat: /(MicroMessenger)/i.test(ua),
        pc: !/(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/i.test(ua),
        mobile: /mobile|tablet|ip(ad|hone|od)|android/i.test(ua)
    };

    // 是否支持touch事件
    var SUPPORT_TOUCH = ('ontouchstart' in window);
    // 是否只支持touch事件
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && CLIENT.mobile;

    /**
     * 工具类对象
     * @type {{isEmpty: Function, isNotEmpty: Function, empty2def: Function}}
     */
    $.extend($, {
        /**
         * 加载Javascript文件
         *
         * @param {}
         *            src 文件路径
         */
        importScript : function(src) {
            var scriptElem = document.createElement('script');
            scriptElem.setAttribute('src', src);
            document.getElementsByTagName('head')[0].appendChild(scriptElem);
        },

        /**
         * 加载CSS文件
         *
         * @param {}
         *            href 文件路径
         */
        importLink : function(href) {
            var linkElem = document.createElement('link');
            linkElem.setAttribute('href', href);
            linkElem.setAttribute('rel', 'stylesheet');
            document.getElementsByTagName('head')[0].appendChild(linkElem);
        },

        /**
         * 是否为空
         * @param obj
         * @returns {boolean}
         */
        isEmpty : function(obj) {
            return obj == null || obj === '';
        },

        /**
         * 是否不为空
         * @param obj
         * @returns {boolean}
         */
        isNotEmpty : function(obj) {
            return !this.isEmpty(obj);
        },

        /**
         * 依次判断参数返回非空参数，若为空则取下一个非空，直到结束为止均为空则返回空字符串
         *
         * @param {} params...
         */
        empty2def : function() {
            var value = '', length = arguments.length;
            for (var i = 0; i < length; i++) {
                if (this.isNotEmpty(arguments[i])) {
                    value = arguments[i];
                    break;
                }
            }
            return value;
        }
    });

    /**
     * 对象方法拓展
     * @type {{setTransition: Function, setTransform: Function, setTransformOrigin: Function, setAnimation: Function, runAnimation: Function, clearAnimation: Function, animationOver: Function}}
     */
    $.extend($.fn, {
        /**
         * 设置兼容性transition
         * @param transition
         * @returns {*}
         */
        setTransition : function(transition) {
            return this.each(function() {
                $(this).css({
                    '-webkit-transition': transition,
                    '-moz-transition': transition,
                    '-ms-transition': transition,
                    '-o-transition': transition,
                    'transition': transition,
                });
            });
        },

        /**
         * 设置兼容性transform
         * @param transform
         * @returns {*}
         */
        setTransform : function(transform) {
            return this.each(function() {
                $(this).css({
                    '-webkit-transform': transform,
                    '-moz-transform': transform,
                    '-ms-transform': transform,
                    '-o-transform': transform,
                    'transform': transform
                });
            });
        },

        /**
         * 设置兼容性transformOrigin
         * @param transformOrigin
         * @returns {*}
         */
        setTransformOrigin : function(transformOrigin) {
            return this.each(function() {
                $(this).css({
                    '-webkit-transform-origin': transformOrigin,
                    '-moz-transform-origin': transformOrigin,
                    '-ms-transform-origin': transformOrigin,
                    '-o-transform-origin': transformOrigin,
                    'transform-origin': transformOrigin
                });
            });
        },

        /**
         * 设置兼容性动画animation
         * @param animation 动画配置
         */
        setAnimation : function(animation) {
            return this.each(function() {
                $(this).css({
                    '-webkit-animation': animation,
                    '-moz-animation': animation,
                    '-ms-animation': animation,
                    '-o-animation': animation,
                    'animation': animation
                });
            });
        },

        /**
         * 运行所有动画
         */
        runAnimation : function() {
            return this.each(function() {
                $(this).find('[data-animation]').each(function(index) {
                    var $this = $(this);
                    $this.setAnimation($this.data('animation')).css({
                        zIndex: index + 1
                    }).removeClass('hide');
                });
            });
        },

        /**
         * 清除所有动画
         */
        clearAnimation : function() {
            return this.each(function() {
                $(this).find('[data-animation]').each(function(index) {
                    var $this = $(this);
                    $this.setAnimation('').addClass('hide');
                });
            });
        },

        /**
         * 动画全部运行结束监听
         * @param callback  动画全部运行结束回调函数
         * @returns {*}
         */
        animationOver : function(callback) {
            return this.each(function() {
                var count = 0;
                var $animation = $(this).find('[data-animation]');
                var length = $animation.length;
                $animation.off(animationEnd).one(animationEnd, function() {
                    count++;
                    if (count >= length) {
                        count = 0;
                        $animation.off(animationEnd);
                        if ($.isFunction(callback)) {
                            callback();
                        }
                    }
                });
            });
        }
    });

    // animation结束事件
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd animationend';
    // transition结束事件
    var transitionEnd = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend';

	/**
	 * 翻页相关常量
	 * @type {{STATUS: {INIT: string, START: string, MOVE: string, END: string}, ANIMATION: {COVER: string, BLUR: string, ZOOM: string}, DIRECTION: {V: string, H: string}}}
	 */
	var TURN = {
		/**
		 * 翻页状态
		 * @type {{INIT: string, START: string, MOVE: string, END: string}}
		 */
		STATUS : {
			INIT: 'feeling',
			START: 'started',
			MOVE: 'turning',
			END: 'leaving'
		},
		/**
		 * 翻页动画
		 * @type {{COVER: string, BLUR: string, ZOOM: string}}
		 */
		ANIMATION : {
			COVER: 'cover',
			BLUR: 'blur',
			ZOOM: 'zoom'
		},
		/**
		 * 翻页方向
		 * @type {{V: string, H: string}}
		 */
		DIRECTION : {
			V: 'vertical',
			H: 'horizontal'
		},
	};

	/**
	 * audio对象
	 * @param options
	 */
	var iAudio = function(options) {
		var _defaults = {
			attrs: {
				src: '',
				loop: false,
				preload: 'auto',
				autoplay: true
			},
			callback: {
				onInit: null,
				onLoad: null,
				onAbort: null,
				onError: null,
				onPlay: null,
				onPause: null,
				onStop: null,
				onEnd: null
			}
		};

		this.options = $.extend(_defaults, options || {}),
		this._audio = null,
		this._initialed = null,
		this._playing = null,
		this._loaded = null;

		this.run();
	};
	iAudio.prototype = {
		run: function() {
			return this._initialed ? (this._audio == null ? false : true) : this.init();
		},
		init: function() {
			var _this = this;
			try {_this._audio = new Audio();} catch(e) {return false;}

			var attrs = _this.options.attrs,
				callback = _this.options.callback;

			_this._audio.addEventListener('loadeddata', function() {
				_this._loaded = true;
				if (attrs.autoplay && attrs.preload == 'auto') _this.play();
				if ($.isFunction(callback.onLoad)) callback.onLoad.call(_this);
			}, false);

			_this._audio.addEventListener('abort', function() {
				if ($.isFunction(callback.onAbort)) callback.onAbort.call(_this);
			}, false);

			_this._audio.addEventListener('error', function() {
				if ($.isFunction(callback.onError)) callback.onError.call(_this);
			}, false);

			_this._audio.addEventListener('play', function() {
				_this._playing = true;
				if ($.isFunction(callback.onPlay)) callback.onPlay.call(_this);
			}, false);

			_this._audio.addEventListener('pause', function() {
				_this._playing = false;
				if ($.isFunction(callback.onPause)) callback.onPause.call(_this);
			}, false);

			_this._audio.addEventListener('ended', function() {
				try {_this._audio.currentTime = 0;} catch(e) {}
				if ($.isFunction(callback.onEnd)) callback.onEnd.call(_this);
			}, false);


			for (var attr in attrs) {
				if (attr in _this._audio) {
					_this._audio[attr] = attrs[attr];
				}
			}

			if (attrs.autoplay || attrs.preload == 'auto') {
				try {_this._audio.load();} catch (e) {}
			}

			_this._initialed = true;

			if ($.isFunction(callback.onInit)) callback.onInit.call(_this);
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
		}
	};

    /***************** 华丽的分割线-动画秀 *****************/

    // 动画秀对象
    var stage = {
		debug : false,                  // Boolean: 是否启用debug模式
		version : '0.0.1',				// String:  版本号
		simulator : {
			name : '动画秀',				// String:  秀场名称
			battery : '99%'				// String:  秀场电量
		},
		audio : {
			src : '',					// String:  音频路径，不为空时创建音频播放器
			loop : true,				// Boolean: 是否循环播放
			preload : 'auto',			// String:  预加载资源
			autoplay : true				// Boolean: 是否自动播放
		},
		animation : true,               // Boolean: 模拟器启动动画
        mousewheel : true,              // Boolean: 是否开启滑轮滚动
        autoTurn : false,               // Boolean: 是否自动翻页
        autoTurnInterval : 3000,        // Integer: ms 自动翻页间隔时间
        pauseOnAction : true,           // Boolean: 用户操作时停止自动翻页
        turnAfterPaused : null,         // Integer: ms 用户停止操作多长时间以后重新开始自动翻页
        turnDuration: 400,              // Integer: ms 翻页动画持续时间
        turnDistance : 20,              // Integer: 翻页启动距离
		blurScale : 0.2,                // Integer: 翻页模糊缩小比例临界值[0-1]
		minBlur : 1,                    // Integer: 翻页模糊最小值[0-10]
        // 翻页状态
        turnStatus : TURN.STATUS.INIT,
        // 翻页起始点
        turnStartCoord : {},
        // 最后翻页坐标点
        turnEndCoord : {},
        // 强制翻页
        _turnPage : false,
        // 自动翻页定时器
        _timer : false,
		// 音频对象
        _audio : null,
        /**
         * 支持事件
         * ready            场景准备完毕
         * animationOver    动画显示结束
         * change           页改变
         */
        events : ['ready', 'animationOver', 'change'],
        // 事件处理函数
        handlers : {},

        /**
         * 内部函数:自动翻页
         * @returns {stage}
         * @private
         */
        _autoTimer : function() {
            var _this = this;
			_this._resetTimer();
            if (_this.autoTurn) {
                _this.setDebug('auto turn timer');
                _this._timer = setTimeout(function() {
                    _this.nextPage();
                }, _this.autoTurnInterval);
            } else if (_this.turnAfterPaused) {
                _this.setDebug('turn after paused timer');
                _this._timer = setTimeout(function() {
                    _this.nextPage();
                    _this.autoTurn = true;
                }, _this.turnAfterPaused);
            }
            return _this;
        },


        /**
         * 内部函数:清除自动翻页
         * @returns {stage}
         * @private
         */
        _resetTimer : function() {
            var _this = this;
            _this.setDebug('reset auto turn timer');
            if (_this._timer) {
                clearTimeout(_this._timer);
            }
            return _this;
        },

        /**
         * 内部函数:清除自动翻页
         * @returns {stage}
         * @private
         */
        _clearTimer : function() {
            var _this = this;
            _this.setDebug('paused auto turn timer');
            _this.autoTurn = false;
            if (_this._timer) {
                clearTimeout(_this._timer);
            }
            return _this;
        },

		/**
		 * 设置时钟
		 * @private
		 */
		_setClock : function() {
			var _this = this;
			var date = new Date();
			var hour = date.getHours(), minutes = date.getMinutes();
			$('.phone-box .bar .time .hour').text(hour < 10 ? '0' + hour : hour);
			$('.phone-box .bar .time .minutes').text(minutes < 10 ? '0' + minutes : minutes);
			setTimeout(function() {
				_this._setClock();
			}, 1000);
		},

        /**
         * 获得事件数组对象
         * @param types     事件类型
         * @returns {*}
         */
        getTypes : function(types) {
            var _this = this;
            if ($.inArray(types, _this.events) == -1) {
                types = types.split(' ');
            } else {
                types = [types];
            }
            return types;
        },

        /**
         * 绑定事件
         * @param types         事件类型，多个用空格隔开
         * @param handler       事件处理函数
         * @returns {stage}
         */
        on : function(types, handler) {
            var _this = this;
            types = _this.getTypes(types);
            $.each(types, function(i, type) {
                if ($.inArray(type, _this.events) != -1) {
                    // 取得事件对应处理函数
                    var handlers = _this.handlers.hasOwnProperty(type) && _this.handlers[type];
                    // 判断并加入事件处理函数
                    if ($.isEmpty(handlers) || !$.isArray(handlers)) {
                        handlers = [];
                    }
                    handlers.push(handler);
                    // 设置事件处理函数
                    _this.handlers[type] = handlers;
                }
            });
            return _this;
        },

        /**
         * 解绑事件
         * @param types         事件类型，多个用空格隔开
         * @returns {stage}
         */
        off : function(types) {
            var _this = this;
            types = _this.getTypes(types);
            $.each(types, function(i, type) {
                if ($.inArray(type, _this.events) != -1) {
                    _this.handlers.hasOwnProperty(type) && delete _this.handlers[type];
                }
            });
            return this;
        },

        /**
         * 触发事件
         * @param types         事件类型，多个用空格隔开
         * @returns {stage}
         */
        trigger : function(types) {
            var _this = this;
            types = _this.getTypes(types);
            $.each(types, function(i, type) {
                if ($.inArray(type, _this.events) != -1) {
                    // 取得事件对应处理函数
                    var handlers = _this.handlers.hasOwnProperty(type) && _this.handlers[type];
                    // 判断并加入事件处理函数
                    if ($.isArray(handlers)) {
                        $.each(handlers, function(index, handler) {
                            if ($.isFunction(handler)) {
                                handler.call(_this, {
                                    type: type
                                });
                            }
                        });
                    }
                }
            });
            return this;
        },

        /**
         * 马上秀启动函数
         * @param options {}
         *          simulator : {
		 *				name : '动画秀',		// String:  秀场名称
		 *				battery : '99%'			// String:  秀场电量
		 *			},
		 *			audio : {
		 *				src : '',				// String:  音频路径，不为空时创建音频播放器
		 *				loop : true,			// Boolean: 是否循环播放
		 *				preload : 'auto',		// String:  预加载资源
		 *				autoplay : true			// Boolean: 是否自动播放
		 *			},
         *          debug : true,               // Boolean: 是否启用debug模式
         *          animation : true,           // Boolean: 模拟器启动动画
         *          mousewheel : true,          // Boolean: 是否开启滑轮滚动翻页
         *          turnDuration : 400,         // Integer: ms 翻页动画持续时间
         *          autoTurn : false,           // Boolean: 是否自动翻页
         *          autoTurnInterval : 3000,    // Integer: ms 自动翻页间隔时间
         *          pauseOnAction : true,       // Boolean: 用户操作时停止自动翻页
         *          turnAfterPaused : null,     // Integer: ms 用户停止操作多长时间以后重新开始自动翻页
		 *          blurScale : 0.2,            // Integer: 翻页模糊缩小比例临界值[0-1]
		 *          minBlur : 1,                // Integer: 翻页模糊最小值[0-10]
         */
        startup : function(options) {
            var _this = this;
            $.extend(true, _this, options || {});
			// 初始化配置
			//if (options) {
			//	if (options.hasOwnProperty('simulator')) {
			//		$.extend(_this.simulator, options.simulator);
			//	}
			//	if (options.hasOwnProperty('audio')) {
			//		$.extend(_this.audio, options.audio);
			//	}
			//	if (options.hasOwnProperty('debug')) _this.debug = options.debug;
			//	if (options.hasOwnProperty('animation')) _this.animation = options.animation;
			//	if (options.hasOwnProperty('mousewheel')) _this.mousewheel = options.mousewheel;
			//	if (options.hasOwnProperty('turnDuration')) _this.turnDuration = options.turnDuration;
			//	if (options.hasOwnProperty('autoTurn')) _this.autoTurn = options.autoTurn;
			//	if (options.hasOwnProperty('autoTurnInterval')) _this.autoTurnInterval = options.autoTurnInterval;
			//	if (options.hasOwnProperty('pauseOnAction')) _this.pauseOnAction = options.pauseOnAction;
			//	if (_this.autoTurn && options.hasOwnProperty('turnAfterPaused')) _this.turnAfterPaused = options.turnAfterPaused;
			//	if (options.hasOwnProperty('blurScale')) _this.blurScale = options.blurScale;
			//	if (options.hasOwnProperty('minBlur')) _this.minBlur = options.minBlur;
			//}

			// 获得初始开始页码
			var startPageNo = 0;
			if ($('.page-current').length > 0) {
				startPageNo = $('.page-current').index() || 0;
				$('.page-current').removeClass('page-current');
			}
			
            // 是否启动debug模式
            if (_this.debug) {
                $('<div/>').addClass('debug-box').appendTo($('body'));
            }

            // 添加加载动画
            var $load = $('<div/>').addClass('page-loading').appendTo($('body'));
            // 加载结束
            var loadEnd = function() {
                // 设置土豪金边框
                $('.phone-box').addClass('gold');
				// 移除加载动画
				$load.setAnimation('rotateOut 1s linear 1').one(animationEnd, function() {
					// 判断并初始化音频对象
					if ($.isNotEmpty(_this.audio.src)) {
						_this._audio = new iAudio({
							attrs: _this.audio,
							callback: {
								onInit: function() {
									$('<div/>').addClass('audio-control off').on('touchend click', function(e) {
										e.preventDefault();
										_this._audio && ($('.audio-control').hasClass('off') ? _this._audio.play() : _this._audio.stop());
									}).prependTo($('.pages'));
									if (this._playing) $('.audio-control').removeClass('off');
								},
								onPlay: function(o) {
									$('.audio-control').removeClass('off');
								},
								onPause: function(o) {
									$('.audio-control').addClass('off');
								}
							}
						});
					}
					// 移除加载提示动画
					$(this).remove();
					// 清除所有动画
					$('.pages').find('.page').clearAnimation();
					// 初始化翻页处理器
					_this.onTurnPage();
					$('.page').eq(startPageNo).runAnimation().addClass('page-current').animationOver(function() {
						_this._autoTimer();
						_this.trigger('animationOver');
					});
					_this.trigger('ready');
				});
            };

            // 判断非移动浏览器端显示模拟器
            if (CLIENT.pc) {
                /**
                 * 构造模拟器场景
                 */
                var bulidSimulator = function() {
                    $('html').addClass('simulator');
                    var $pages = $('.pages');
                    var $phoneBox = $('<div/>').addClass('phone-box');
                    $phoneBox.append('<div class="top"><i></i></div>');
					$phoneBox.append('<div class="bar"><div class="points"><i></i><i></i><i></i><i></i><i></i></div><label class="name">' + _this.simulator.name + '</label><label class="time"><span class="hour">22</span><span class="separate">:</span><span class="minutes">11</span></label><label class="percent">' + _this.simulator.battery + '</label><div class="battery"><i></i></div></div>');
                    $phoneBox.append('<div class="title">' + $.empty2def(document.title, _this.simulator.name) + '</div>');
                    $phoneBox.append($pages);
                    $phoneBox.append('<div class="bottom"></div>');
                    $('body').append($phoneBox);
					// 设置时钟
					_this._setClock();
                    // 是否开启启动动画
                    if (_this.animation) {
                        // 启动模拟器动画时长
                        var loadDelay = 1200;
                        var animationDuration = loadDelay / 1000;
                        var half = animationDuration / 2;
                        // 设置动画效果
                        $phoneBox.children('.pages').setAnimation('zoomIn ' + (animationDuration + half) + 's ease 0s 1 both');
                        $phoneBox.children('.bar').setAnimation('fadeInLeft ' + animationDuration + 's ease ' + half + 's 1 both');
                        $phoneBox.children('.title').setAnimation('fadeInRight ' + animationDuration + 's ease ' + half + 's 1 both');
                        $phoneBox.children('.top').setAnimation('fadeInDown ' + animationDuration + 's ease-out ' + animationDuration + 's 1 both');
                        $phoneBox.children('.bottom').setAnimation('fadeInUp ' + animationDuration + 's ease-out ' + animationDuration + 's 1 both')
                            .off(animationEnd).one(animationEnd, function() {
                                _this.setDebug('simulator startup over!');
                                loadEnd();
                            });
                    } else {
                        loadEnd();
                    }
                };
                // 预加载模拟器图片
                var preloadImages = [];
                var count = preloadImages.length;
                // 判断是否存在预加载图片资源
                if (count > 0) {
                    // 依次预加载图片资源
                    $.each(preloadImages, function(index, data) {
                        _this.preload({
                            url: data,
                            onComplete: function(img) {
                                if (--count == 0) bulidSimulator();
                            }
                        });
                    });
                } else {
                    // 构造模拟器
                    bulidSimulator();
                }
            } else {
                loadEnd();
            }

            return _this;
        },

        /**
         * 设置debug信息
         * @param text  信息
         */
        setDebug : function(text) {
            var _this = this;
            // 是否启动debug模式
            if (_this.debug) {
                $('.debug-box').stop(true, true).slideDown(function() {
                    setTimeout(function() {
                        $('.debug-box').stop(true).slideUp();
                    }, 2000);
                }).html(text);
                console && console.log(text);
            }

            return _this;
        },

        /**
         * 获得当前JS文件所在路径
         * @returns {*}
         */
        getPath : function(jsFileName) {
            var js = document.scripts;
            var jsPath;
            for (var i = js.length - 1; i >= 0; i--) {
                var src = js[i].src;
                var reg = new RegExp($.empty2def(jsFileName, '(stage\\.js[\\w\\W]*)'));
                if (reg.test(src)) {
                    jsPath = src.replace(RegExp.$1, '');
                    break;
                }
            }
            return jsPath;
        },

        /**
         * 预加载图片
         * @param options {}
         *              url: '',                            // 图片路径
         *              onSuccess: function(img) {},        // 预加载成功
         *              onError: function(img) {},          // 预加载失败
         *              onComplete: function(img) {}        // 预加载完成
         */
        preload : function(options) {
            var _this = this;
            var _options = $.empty2def(options, {});
            if ($.isNotEmpty(_options.url)) {
                // 创建图片对象
                var img = new Image();
                img.src = _options.url;

                var onSuccess = _options.onSuccess,
                    onError = _options.onError,
                    onComplete = _options.onComplete;

                // 加载错误的事件
                img.onerror = function () {
                    if ($.isFunction(onError)) {
                        onError(img);
                    }
                    if ($.isFunction(onComplete)) {
                        onComplete(img);
                    }
                    img = img.onload = img.onerror = null;
                };

                // 加载完毕的事件
                img.onload = function () {
                    if ($.isFunction(onSuccess)) {
                        onSuccess(img);
                    }
                    if ($.isFunction(onComplete)) {
                        onComplete(img);
                    }
                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                };

            } else if ($.isFunction(_options.onComplete)) {
                _options.onComplete();
            }

            return _this;
        },

        /**
         * 获得上页对象
         * @returns {*|jQuery|HTMLElement}
         */
        getPrevPage : function() {
			var $prev = $('.page').length > 1 ? $('.page-current').prev('.page') : $('.page-current');
            return $prev.length ? $prev : $('.page').last();
        },

        /**
         * 获得当前页对象
         * @returns {*|jQuery|HTMLElement}
         */
        getCurrentPage : function() {
            return $('.page-current');
        },

        /**
         * 获得下页对象
         * @returns {*|jQuery|HTMLElement}
         */
        getNextPage : function() {
			var $next = $('.page').length > 1 ? $('.page-current').next('.page') : $('.page-current');
            return $next.length ? $next : $('.page').first();
        },

        /**
         * 获得当前位置坐标
         * @param e
         * @returns {{x: number, y: number}}
         */
        getCoord : function(e) {
            var coord = {x: 0, y: 0};
            try {
                CLIENT.mobile ? (e.touches ? coord = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                } : coord = {
                    x: e.originalEvent.touches[0].pageX,
                    y: e.originalEvent.touches[0].pageY
                }) : coord = {
                    x: e.pageX,
                    y: e.pageY
                };
                var offset = $('.pages').offset() || {left: 0, top: 0};
                coord.x = coord.x - offset.left;
                coord.y = coord.y - offset.top;
            } catch (e) {
                coord = {x: 0, y: 0};
            }
            return coord;
        },

		/**
		 * 获得翻页动画
		 * @returns {*|jQuery|string}
		 * @private
		 */
		_getPageAnimation : function() {
			return $('.pages').data('animation') || TURN.ANIMATION.COVER;
		},

		/**
		 * 获得翻页方向
		 * @returns {*|jQuery|string}
		 * @private
		 */
		_getPageDirection : function() {
			return $('.pages').data('direction') || TURN.DIRECTION.V;
		},

        /**
         * 开始翻页
         * @param e 事件对象
         */
        turnStart : function(e) {
            var _this = this;
            _this.turnStatus = TURN.STATUS.START;
            _this.turnStartCoord = _this.getCoord(e);
            _this.setDebug('start:' + _this.turnStartCoord.x + ',' + _this.turnStartCoord.y);
            var $pageCurrent = $('.page-current'), $pageActive = $('.page-active');
            $pageActive.removeClass('page-active').setTransform('none').setTransition('none');
            $pageCurrent.setTransform('none').setTransition('none').setTransformOrigin('none').css({
                '-webkit-filter': 'blur(0)'
            });
        },

        /**
         * 翻页移动
         * @param e 事件对象
         */
        turnMove : function(e) {
            var _this = this;
            _this.turnStatus = TURN.STATUS.MOVE;
            _this.turnEndCoord = _this.getCoord(e);
            _this.setDebug('move:' + _this.turnEndCoord.x + ',' + _this.turnEndCoord.y);
			var isHorizontal = _this._getPageDirection() == TURN.DIRECTION.H;
            var distance = isHorizontal ? _this.turnStartCoord.x - _this.turnEndCoord.x : _this.turnStartCoord.y - _this.turnEndCoord.y;
            var total = isHorizontal ? $('.pages').width() : $('.pages').height();
            var _distance = total - Math.abs(distance);
            var scale = _distance / total;
            var pageAnimation = _this._getPageAnimation();
            var $pageCurrent = _this.getCurrentPage();
            if (distance > 0) {
                // 设置当前页缩小
                $pageCurrent.addClass('next').removeClass('prev');
				var transformOrigin = isHorizontal ? 'left center' : 'center top';
                if (TURN.ANIMATION.BLUR == pageAnimation) {
					var _scale = Math.max(scale, _this.blurScale);
                    $pageCurrent.setTransform('scale(' + _scale + ')').setTransformOrigin(transformOrigin).css({
                        '-webkit-filter': 'blur(' + Math.max(_this.minBlur, 10 - Math.floor(_scale * 10)) + 'px)'
                    });
                } else if (TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransform('scale(' + scale + ')').setTransformOrigin(transformOrigin);
                }
                // 设置下页显示
                _this.getNextPage().addClass('page-active').setTransform(isHorizontal ? 'translateX(' + _distance + 'px)' : 'translateY(' + _distance + 'px)').siblings('.page-active').removeClass('page-active');
            } else if (distance < 0) {
                // 设置当前页缩小
                $pageCurrent.addClass('prev').removeClass('next');
				var transformOrigin = isHorizontal ? 'right center' : 'center bottom';
                if (TURN.ANIMATION.BLUR == pageAnimation) {
					var _scale = Math.max(scale, _this.blurScale);
                    $pageCurrent.setTransform('scale(' + _scale + ')').setTransformOrigin(transformOrigin).css({
                        '-webkit-filter': 'blur(' + Math.max(_this.minBlur, 10 - Math.floor(_scale * 10)) + 'px)'
                    });
                } else if (TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransform('scale(' + scale + ')').setTransformOrigin(transformOrigin);
                }
                // 设置下页显示
                _this.getPrevPage().addClass('page-active').setTransform(isHorizontal ? 'translateX(' + -1 * _distance + 'px)' : 'translateY(' + -1 * _distance + 'px)').siblings('.page-active').removeClass('page-active');
            }
        },

        /**
         * 翻页结束
         * @param e 事件对象
         */
        turnEnd : function() {
            var _this = this;
            _this.turnStatus = TURN.STATUS.END;
            _this.setDebug('end:' + _this.turnEndCoord.x + ',' + _this.turnEndCoord.y);
            var $pageCurrent = $('.page-current'), $pageActive = $('.page-active');
			var transition = 'all ' + parseFloat(_this.turnDuration / 1000) + 's ease-out';
			var isHorizontal = _this._getPageDirection() == TURN.DIRECTION.H;
			var pageAnimation = _this._getPageAnimation();
            var isTurn = false;
			var distance = isHorizontal ? _this.turnStartCoord.x - _this.turnEndCoord.x : _this.turnStartCoord.y - _this.turnEndCoord.y;
            if (_this._turnPage || Math.abs(distance) > _this.turnDistance) { // 判断是否下一页
                _this.setDebug('turn page!');
				_this._turnPage = false;
                isTurn = true;
                if (TURN.ANIMATION.BLUR == pageAnimation) {
                    $pageCurrent.setTransition(transition).setTransform('scale(' + _this.blurScale + ')').css({
                        '-webkit-filter': 'blur(' + Math.max(_this.minBlur, 10 - Math.floor(this.blurScale * 10)) + 'px)'
                    });
                } else if (TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransition(transition).setTransform('scale(0)');
                }
                $pageActive.setTransition(transition).setTransform(isHorizontal ? 'translateX(0)' : 'translateY(0)');
            } else { // 判断页面是否复原
                _this.setDebug('turn reset!');
                if (TURN.ANIMATION.BLUR == pageAnimation) {
                    $pageCurrent.setTransition(transition).setTransform('scale(1)').css({
                        '-webkit-filter': 'blur(0)'
                    });
                } else if (TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransition(transition).setTransform('scale(1)');
                }
                $pageActive.setTransition(transition);
				var total = isHorizontal ? $('.pages').width() : $('.pages').height();
                if ($pageCurrent.hasClass('prev')) {
                    $pageActive.setTransform(isHorizontal ? 'translateX(' + -1 * total + 'px)' : 'translateY(' + -1 * total + 'px)');
                } else if ($pageCurrent.hasClass('next')) {
                    $pageActive.setTransform(isHorizontal ? 'translateX(' + total + 'px)' : 'translateY(' + total + 'px)');
                }
            }
            $pageCurrent.removeClass('prev next');
            $pageActive.off(transitionEnd).one(transitionEnd, function() {
                _this.setDebug('turn page over!');
                $pageActive.off(transitionEnd).removeClass('page-active').setTransform('none').setTransition('none').siblings('.page-active').removeClass('page-active');
                $pageCurrent.setTransform('none').setTransition('none').setTransformOrigin('none').css({
                    '-webkit-filter': 'blur(0)'
                }).siblings('.page-current').removeClass('page-current');
                // 是否需要翻页
                if (isTurn) {
                    $pageCurrent.clearAnimation().removeClass('page-current');
                    $pageActive.addClass('page-current').runAnimation().animationOver(function() {
                        _this._autoTimer();
                        _this.trigger('animationOver');
                    });
                    _this.trigger('change');
                }
                _this.turnStatus = TURN.STATUS.INIT;
            });
        },

        /**
         * 设置翻页事件
         */
        onTurnPage : function() {
            var _this = this;
            if ($('.page').length > 1) {
                $('.pages').on(SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown', function(e) {
                    e.preventDefault();
                    _this._clearTimer();
                    TURN.STATUS.INIT == _this.turnStatus && _this.turnStart(e);
                }).on(SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove', function(e) {
                    e.preventDefault();
                    (TURN.STATUS.START == _this.turnStatus || TURN.STATUS.MOVE == _this.turnStatus) && _this.turnMove(e);
                }).on(SUPPORT_ONLY_TOUCH ? 'touchend touchcancel' : 'mouseup mouseleave', function(e) {
                    e.preventDefault();
                    (TURN.STATUS.MOVE == _this.turnStatus && $('.page-active').get(0)) ? _this.turnEnd(e) : TURN.STATUS.END == _this.turnStatus ? '' : _this.turnStatus = TURN.STATUS.INIT;
                }).on('select', function(e) {
                    e.preventDefault();
                }).on('scroll', function(e) {
                    e.preventDefault();
                }).on('mousedown mousemove', 'img', function(e) {
                    e.preventDefault();
                });

                // 判断是否绑定滑轮事件
                if (!SUPPORT_ONLY_TOUCH && _this.mousewheel) {
                    var scrollTime = 0;
                    $('.pages').on('mousewheel DOMMouseScroll', function (e) {
                        e.preventDefault();

                        var t = new Date().getTime();
                        //防止鼠标滚动太快
                        if (t - scrollTime < _this.turnDuration) {
                            return !1;
                        }
                        scrollTime = t;

                        _this._clearTimer();

                        //鼠标滚轮的滚动方向 >0 up;<0 down
                        var _delta = parseInt(e.originalEvent ? (e.originalEvent.wheelDelta || e.originalEvent.detail) : (e.wheelDelta || e.detail));
                        if (_delta > 0) {
                            _this.setDebug('mouse wheel prev');
                            _this.prevPage();
                        } else {
                            _this.setDebug('mouse wheel next');
                            _this.nextPage();
                        }
                    });
                }

				// 添加翻页箭头提示动画
				var isHorizontal = _this._getPageDirection() == TURN.DIRECTION.H;
				if (isHorizontal) {
					$('.page').append('<i class="u-arrow-right"><div class="pre-wrap"><div class="pre-box1"><div class="pre1"></div></div><div class="pre-box2"><div class="pre2"></div></div></div></i>');
				} else {
					$('.page').append('<i class="u-arrow-bottom"><div class="pre-wrap"><div class="pre-box1"><div class="pre1"></div></div><div class="pre-box2"><div class="pre2"></div></div></div></i>');
				}
            }
        },

        /**
         * 上一页
         */
        prevPage : function() {
            var _this = this;
            if ($('.page').length > 1 && TURN.STATUS.INIT == _this.turnStatus) {
                _this._resetTimer();
                _this._turnPage = true;
                _this.turnStatus = TURN.STATUS.END;
				var isHorizontal = _this._getPageDirection() == TURN.DIRECTION.H;
                var pageAnimation = _this._getPageAnimation();
                var $pageCurrent = _this.getCurrentPage();
                // 设置当前页缩小
                if (TURN.ANIMATION.BLUR == pageAnimation || TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransform('scale(1)').setTransformOrigin(isHorizontal ? 'right center' : 'center bottom');
                }
				var total = isHorizontal ? $('.pages').width() : $('.pages').height();
                _this.getPrevPage().addClass('page-active').setTransform(isHorizontal ? 'translateX(' + -1 * total + 'px)' : 'translateY(' + -1 * total + 'px)').siblings('.page-active').removeClass('page-active');
                setTimeout(function() {
                    _this.turnEnd();
                    _this._turnPage = false;
                }, 100);
            }

            return _this;
        },

        /**
         * 下一页
         */
        nextPage : function() {
            var _this = this;
            if ($('.page').length > 1 && TURN.STATUS.INIT == _this.turnStatus) {
                _this._resetTimer();
                _this._turnPage = true;
                _this.turnStatus = TURN.STATUS.END;
				var isHorizontal = _this._getPageDirection() == TURN.DIRECTION.H;
                var pageAnimation = _this._getPageAnimation();
                var $pageCurrent = _this.getCurrentPage();
                // 设置当前页缩小
                if (TURN.ANIMATION.BLUR == pageAnimation || TURN.ANIMATION.ZOOM == pageAnimation) {
                    $pageCurrent.setTransform('scale(1)').setTransformOrigin(isHorizontal ? 'left center' : 'center top');
                }
				var total = isHorizontal ? $('.pages').width() : $('.pages').height();
                _this.getNextPage().addClass('page-active').setTransform(isHorizontal ? 'translateX(' + total + 'px)' : 'translateY(' + total + 'px)').siblings('.page-active').removeClass('page-active');
                setTimeout(function() {
                    _this.turnEnd();
                    _this._turnPage = false;
                }, 100);
            }
            return _this;
        }

    };

	// 加载资源样式
	$(document).ready(function() {
		// 获得动画秀stage.js所在目录路径
		var path = stage.getPath();
		if (path) $.importLink(path + 'stage.css');
	});

    // 提供api调用
    window.STAGE = {};
    var openAPI = ['startup', 'on', 'off', 'trigger', 'setDebug', 'preload', 'getPrevPage', 'getCurrentPage', 'getNextPage', 'prevPage', 'nextPage'];
    $.each(openAPI, function(i, api) {
        if (stage.hasOwnProperty(api)) {
            if ($.isFunction(stage[api])) {
                window.STAGE[api] = $.proxy(stage[api], stage);
            } else {
                window.STAGE[api] = stage[api];
            }
        }
    });

})(window.jQuery || window.Zepto);