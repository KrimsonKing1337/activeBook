//custom scripts

$(window).load(function () {
    //inits

    //flags
    let flags = {}; //variable for flags, to not using window object

    //enable/disable vibro flag
    flags.vibroEnabled = true;

    //const
    const READING_PLACE = $('.reading-place');
    const VIBRATION_ICON = $('.header-menu__item__vibration__icon');
    let AUDIO_SLIDER;
    const $EFFECTS_PARENT = $('.effects');

    //customScrollBar
    READING_PLACE.find('.text').mCustomScrollbar({
        theme: 'activeBook',
        autoDraggerLength: true,
        mouseWheel:{ scrollAmount: 75 }
    });

    //ionRangeSlider
    $('.header-menu__item__volume__slider').ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        hide_min_max: true,
        hide_from_to: true,
        onChange: function (data) {
            volumeChange({volume: data.from, disableChangeSlider: true});//from - настоящее значение
        }
    });

    AUDIO_SLIDER = $('.header-menu__item__volume__slider').data('ionRangeSlider');

    //remodal
    $('.remodal').remodal({
        hashTracking: false
    });

    $(document).on('opening', '.remodal-with-image', function () {
        let imageWidth = $(this).find('img').width();

        $(this).css({
            'width': imageWidth + 'px'
        });
    });

    $(document).on('closed', '.remodal-with-video', function () {
        $(this).find('video')[0].pause();
    });

    let vibroControl = {
        isVibroSupport: function (el) {
            if ( !el ) return false;

            if ('vibrate' in navigator)  return true;
            if ('oVibrate' in navigator)  return true;
            if ('mozVibrate' in navigator)  return true;
            if ('webkitVibrate' in navigator)  return true;

            if ( el.attr('data-vibration') == 'on' ) return true;

            console.log('Cannot play vibro!');

            return false;
        },

        toggleVibroState: function (el) {
            if ( !el ) return false;

            flags.vibroEnabled = !flags.vibroEnabled;

            if ( el.attr('data-vibration') == 'on' ) {
                el.attr('data-vibration', 'off');
            } else {
                el.attr('data-vibration', 'on');
            }
        },

        vibroChangeState: function (el, state) {
            if ( !el || !state ) return false;

            if ( state == 'on' ) {
                flags.vibroEnabled = true;
                el.attr('data-vibration', 'on');
            } else if ( state == 'off' ) {
                flags.vibroEnabled = false;
                el.attr('data-vibration', 'off');
            }
        }
    };

    VIBRATION_ICON.on('click', function () {
       vibroControl.toggleVibroState(VIBRATION_ICON);
    });

    //swipes support
    READING_PLACE.find('.text').hammer({
        threshold: 90,
        direction: Hammer.DIRECTION_HORIZONTAL
    }).on('swipe', function (e) {
        if (e.gesture.pointerType == 'mouse') return;

        //4 = swipeLeft, 2 = swepiRight
        if (e.gesture.offsetDirection == 4) {
            $('.header-menu__item__page-nav__prev').trigger('click');
        } else if (e.gesture.offsetDirection == 2) {
            $('.header-menu__item__page-nav__next').trigger('click');
        }
    });

    //effects

    let defaultGlobalVolume = 75;

    const getCurrentGlobalVolume = function () {
        return AUDIO_SLIDER.result.from;
    };

    //Unload and destroy a Howl object.
    //This will immediately stop all sounds attached to this sound and remove it from the cache.
    const tryCatchHowlUnload = function (obj) {
        try {
            obj.unload();
        } catch (err) {
            return false;
        }

        return true;
    };

    /**
     *
     * @param params {object}
     * @param params.loop {object} || string - loop-звук, который нужно остановить.
     * если нужно остановить все фоновые звуки - передаём 'all'
     * @param [params.fadeOutSpeed] {number} - скорость, с которой будет происходить fadeOut
     */
    const loopBgStop = function (params = {}) {
        //params = params || {};

        let loop = params.loop;
        let fadeOutSpeed = params.fadeOutSpeed;
        if (typeof fadeOutSpeed === 'undefined') fadeOutSpeed = 1000;

        if (!loop) return;

        if (loop == 'all') {
            $.each([loopBgSound, loopBgSoundNew, loopBgMusic, loopBgMusicNew], function (index, value) {
                loopBgStop({loop: value, fadeOutSpeed: fadeOutSpeed});
            });

            return;
        }

        let volume = getCurrentGlobalVolume() / 100;

        loop.once('fade', function () {
            loop.stop();

            if ( tryCatchHowlUnload(loop) ) loop.unload();
        });

        //некорректное поведение, если задавать fadeOutSpeed = 0;
        loop.fade(volume, 0, fadeOutSpeed > 0 ? fadeOutSpeed : 1);
    };

    let loopBgSound,
        loopBgSoundNew;
    let loopBgMusic,
        loopBgMusicNew;
    /**
     * @param params {object}
     * @param params.type {string}
     * @param params.src {string[]}
     * @param [params.fadeOutSpeed] {number}
     * @param [params.fadeInSpeed] {number}
     */
    const setLoopAudio = function (params = {}) {
        //params = params || {};

        let type = params.type;
        let src = params.src;
        let fadeOutSpeed = params.fadeOutSpeed;
        if (typeof fadeOutSpeed === 'undefined') fadeOutSpeed = 1000;
        let fadeInSpeed = params.fadeInSpeed;
        if (typeof fadeInSpeed === 'undefined') fadeInSpeed = 1000;

        if ( !type || !src ) return false;

        let volume = getCurrentGlobalVolume() / 100;

        /**
         * @param _src {string} - путь к файлу у объекта Howler
         */
        const srcEquals = function (_src) {
            $.each(src, function (index, value) {
                if ( _src == value ) {
                    return true;
                }
            });

            return false;
        };

        const newHowl = function () {
            return new Howl({
                src: src,
                autoplay: true,
                loop: true,
                volume: 0
            });
        };

        //ogg, webm формат даёт настоящий seamless/gapless звук на FF, в хроме по-прежнему присутствуют gap-ы, другие форматы толку не дали
        if ( type == 'sound' ) {
            if ( loopBgSound && srcEquals(loopBgSound._src) && loopBgSound.playing()
            || loopBgSoundNew && srcEquals(loopBgSoundNew._src) && loopBgSoundNew.playing() ) return;

            if ( !loopBgSound || loopBgSound && loopBgSound.state() == 'unloaded' ) {
                if ( loopBgSoundNew || loopBgSoundNew && loopBgSoundNew.state() != 'unloaded' ) {
                    loopBgStop({loop: loopBgSoundNew, fadeOutSpeed: fadeOutSpeed});
                }

                loopBgSound = newHowl();

                if (loopBgSound.state() != 'loaded') {
                    loopBgSound.once('load', function () {
                        loopBgSound.fade(0, volume, fadeInSpeed);
                    });
                } else {
                    loopBgSound.fade(0, volume, fadeInSpeed);
                }
            } else {
                loopBgStop({loop: loopBgSound});

                loopBgSoundNew = newHowl();

                if (loopBgSoundNew.state() != 'loaded') {
                    loopBgSoundNew.once('load', function () {
                        loopBgSoundNew.fade(0, volume, fadeInSpeed);
                    });
                } else {
                    loopBgSoundNew.fade(0, volume, fadeInSpeed);
                }
            }
        } else if ( type == 'music' ) {
            if ( loopBgMusic && srcEquals(loopBgMusic._src) && loopBgMusic.playing()
                || loopBgMusicNew && srcEquals(loopBgMusicNew._src) && loopBgMusicNew.playing() ) return;

            if ( !loopBgMusic || loopBgMusic && loopBgMusic.state() == 'unloaded' ) {
                if ( loopBgMusicNew || loopBgMusicNew && loopBgMusicNew.state() != 'unloaded' ) {
                    loopBgStop({loop: loopBgMusicNew, fadeOutSpeed: fadeOutSpeed});
                }

                loopBgMusic = newHowl();

                if (loopBgMusic.state() != 'loaded') {
                    loopBgMusic.once('load', function () {
                        loopBgMusic.fade(0, volume, fadeInSpeed);
                    });
                } else {
                    loopBgMusic.fade(0, volume, fadeInSpeed);
                }
            } else {
                loopBgStop({loop: loopBgMusic, fadeOutSpeed: fadeOutSpeed});

                loopBgMusicNew = newHowl();

                if (loopBgMusicNew.state() != 'loaded') {
                    loopBgMusicNew.once('load', function () {
                        loopBgMusicNew.fade(0, volume, fadeInSpeed);
                    });
                } else {
                    loopBgMusicNew.fade(0, volume, fadeInSpeed);
                }
            }
        }
    };

    //controller for manage effects
    const controlEffects = {
        /**
         *
         * @param params {object}
         * @param params.target {object}
         * @param params.type {string}
         * @param [params.params] {object}
         * @param [params.params.stopBy] {number}; через сколько остановить воспроизведение эффекта
         * @param [params.params.fadeOut] {number}; плавность fadeOut
         * @param [params.params.fadeIn] {number}; плавность fadeIn
         * @param [params.params.vibroDuration] {number}; сколько вибрировать
         * @param [params.vibro] {object}; вибрация
         * @param [params.vibro.repeat] {number}; сколько раз повторить
         * @param [params.vibro.sleep] {number}; пауза между вибрациями
         * @param [params.vibro.duration] {number}; длительность вибрации
         */
        playEffect: function (params = {}) {
            //params = params || {};

            let target = params.target;
            let type = params.type;
            let addParams = params.params;
            let vibro = params.vibro;

            if (!target || !type) {
                return false;
            }

            let src = [];

            if (typeof (target) == 'object') {
                target.find('source').each(function (index, item) {
                    src.push($(item).attr('src'));
                });
            }

            if (type == 'audio') {
                if ( controlEffects.getState({target: target}) == 'paused' ) {
                    controlEffects.stopSounds({target: ['sounds']});
                    target[0].play();
                }
            } else if (type == 'bg-sound') {
                setLoopAudio({type: 'sound', src: src});
            } else if (type == 'bg-music') {
                setLoopAudio({type: 'music', src: src});
            } else if (type == 'popup') {
                target.remodal().open();
            }

            if (addParams && addParams.vibroDuration) {
                if ( !vibroControl.isVibroSupport(VIBRATION_ICON) ) return;
                let vibroDuration = addParams.vibroDuration || 500;

                window.navigator.vibrate(vibroDuration); //вибрировать
            } else if (vibro) {
                if ( !vibroControl.isVibroSupport(VIBRATION_ICON) ) return;

                let vibroRepeat = vibro.repeat;
                let vibroSleep = vibro.sleep;
                let vibroDuration = vibro.duration || 500;

                if (vibroRepeat <= 0) return;

                window.navigator.vibrate(vibro); //вибрировать

                let i = 1;
                let interval = setInterval(function () {
                    if (i >= vibroRepeat) clearInterval(interval);

                    window.navigator.vibrate(vibroDuration); //вибрировать
                    i++;
                }, vibroSleep);
            }

            /**
             * остановить через
             */
            if (addParams && addParams.stopBy) {
                setTimeout(function () {
                    if (type == 'audio') {
                        controlEffects.stopSounds({target: ['sounds'], fadeOutSpeed: addParams.fadeOutSpeed});
                    } else if (type == 'bg-sound') {
                        controlEffects.stopSounds({target: ['bgSound'], fadeOutSpeed: addParams.fadeOutSpeed});
                    } else if (type == 'bg-music') {
                        controlEffects.stopSounds({target: ['bgMusic'], fadeOutSpeed: addParams.fadeOutSpeed});
                    }
                }, addParams.stopBy);
            }
        },

        /**
         * @param params {object}
         * @param params.target {object} jquery
         * @returns {string}
         */
        getState: function (params = {}) {
            //params = params || {};

            let target = params.target;

            if ( target[0].duration > 0 && !target[0].paused ) {
                return 'playing';
            } else {
                return 'paused';
            }
        },

        /**
         * @param [params] {object}
         * @param [params.target] {string[]} is what kind of sounds will be stop
         * @param [params.volume] {number} is current volume now
         * @param [params.fadeOutSpeed] {number} = number is how fast will be fadeOut
         * */
        stopSounds: function (params = {}) {
            //params = params || {};

            let sounds = $('audio');
            let currentVolume = getCurrentGlobalVolume();
            let target = params.target || ['sounds', 'bgMusic', 'bgSound'];
            let volume = params.volume || currentVolume;
            let fadeOutSpeed = params.fadeOutSpeed;
            if (typeof fadeOutSpeed === 'undefined') fadeOutSpeed = 1000;

            $.each(target, function (index, value) {
                //for all other sounds
                if ( value == 'sounds' ) {
                    let sounds = $('audio');

                    sounds.each(function (index, item) {
                        if ( controlEffects.getState({target: $(item)}) == 'playing' ) {
                            let el = this;
                            //this.volume = 0;
                            el.animate({volume: 0}, 0, function () {
                                el.pause();
                                el.currentTime = 0;
                                el.volume = currentVolume;
                            });
                        }
                    });

                //for howler.js (loop sounds)
                } else if ( value == 'bgSound' ) {
                    if ( !loopBgSound ) return;

                    if ( loopBgSound.state() == 'unloaded' ) {
                        loopBgStop({loop: loopBgSoundNew, fadeOutSpeed: fadeOutSpeed});
                    } else {
                        loopBgStop({loop: loopBgSound, fadeOutSpeed: fadeOutSpeed});
                    }

                } else if ( value == 'bgMusic' ) {
                    if ( !loopBgMusic ) return;

                    if ( loopBgMusic.state() == 'unloaded' ) {
                        loopBgStop({loop: loopBgMusicNew, fadeOutSpeed: fadeOutSpeed});
                    } else {
                        loopBgStop({loop: loopBgMusic, fadeOutSpeed: fadeOutSpeed});
                    }
                }
            });
        }
    };

    /**
     * после загрузки страницы воспроизводим те эффекты, у которых прописан атррибут data-play-on-load
     * */
    const playEffectsOnLoad = function () {
        let $effects = $EFFECTS_PARENT.find('>[class^="effects"]').find('[data-play-on-load]');

        $effects.each(function (index, item) {
            let target,
                type,
                params,
                vibro;

            if ($(item).attr('data-effect-id')) {
                target = $(item);
                type = target.data('effect-type');
                params = target.data('effect-params');
                vibro = target.data('effect-vibro');
            } else if ($(item).attr('data-remodal-id')) {
                target = $(item);
                type = 'popup';
                params = target.data('effect-params');
            }

            controlEffects.playEffect({target: target, type: type, params: params, vibro: vibro});
        });
    };

    //volume control
    /**
     * @param params {object}
     * @param params.volume {number} is new volume value
     * @param [params.disableChangeSlider] {bool} is for change volume slider state or not
    * */
    const volumeChange = function (params = {}) {
        //params = params || {};

        let volume = params.volume;
        let disableChangeSlider = params.disableChangeSlider;

        if (volume != 0 && !volume || isNaN(volume)) {
            return false;
        }

        //меняем положение ползунка слайдера громкости
        if ( !disableChangeSlider ) {
            AUDIO_SLIDER.update({
                from: volume
            });
        }

        volume = volume / 100; //из процентов в вещественное число

        $('audio').each(function () {
            this.volume = volume;
        });

        $('video').each(function () {
            this.volume = volume;
        });

        if ( loopBgSound ) {
            loopBgSound.volume(volume);
        }

        if ( loopBgMusic ) {
            loopBgMusic.volume(volume);
        }
    };

    //action text click event
    $('a[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        let target = $('[data-effect-id="' + $(this).data('effect-target') + '"]');
        let type = target.data('effect-type');
        let params = $(this).data('effect-params');
        let vibro = $(this).data('effect-vibro');

        controlEffects.playEffect({target: target, type: type, params: params, vibro: vibro});
    });

    $('.header-menu__item__volume__min').on('click', function () {
        volumeChange({volume: 0});
    });

    $('.header-menu__item__volume__max').on('click', function () {
        volumeChange({volume: 100});
    });

    //font-size control
    /**
     * @param params {object}
     * @param params.newFontSize {string}
    * */
    const changeFontSize = function (params = {}) {
        //params = params || {};

        let newFontSize = params.newFontSize;

        if (!newFontSize) {
            return false;
        }

        let text = READING_PLACE.find('.text');
        let classNameForRemove = text.attr('data-font-size');

        text.removeClass('font-size-' + classNameForRemove).addClass('font-size-' + newFontSize);
        text.attr('data-font-size', newFontSize);
    };

    $('.header-menu__item__font-size__less').add('.header-menu__item__font-size__more').on('click', function () {
        let fontSizes = ['75', '100', '125', '150'];
        let text = $('.reading-place').find('.text');
        let fontSizeNow = text.attr('data-font-size');
        let fontSizeNowIndex = $.inArray(fontSizeNow, fontSizes);
        let newFontSize = fontSizes[fontSizeNowIndex - 1];

        if ( $(this).hasClass('header-menu__item__font-size__more') ) {
            newFontSize = fontSizes[fontSizeNowIndex + 1];
        }

        if ( !newFontSize ) {
            return false;
        }

        changeFontSize({newFontSize: newFontSize});
    });

    //go to page
    /**
     * @param params {object};
     * @param params.page {object || string || number}; jquery object
     * если был передан jquery объект - значит нажали на стрелку,
     * если строка или число - значит вызов функции осуществляется иначе;
     * строка = оглавление, обложка, описание и так далее;
     * число = номер страницы
    * */
    const goToPage = function (params = {}) {
        //params = params || {};

        let page = params.page;

        if ( !page ) return false;

        let activePageEl = $('.header-menu__item__page-nav__counter__active-page');
        let lastPageEl = $('.header-menu__item__page-nav__counter__last-page');
        let activePage = parseInt( activePageEl.text() );
        let lastPage = parseInt( lastPageEl.text() );
        let limitCheck;
        let newVal;

        //typeof null == object, поэтому дополнительно проверяем на null
        if ( page && typeof page == 'object' && ( page.hasClass('header-menu__item__page-nav__prev') || page.hasClass('header-menu__item__page-nav__next') ) ) {
            limitCheck = activePage >= lastPage;
            newVal = activePage + 1;

            if ( page.hasClass('header-menu__item__page-nav__prev') ) {
                limitCheck = activePage <= 1;
                newVal = activePage - 1;
            }
        } else if ( page ) {
            //если не число - переходим куда сказали
            if ( typeof page != 'number' ) window.location = page + '.html';

            limitCheck = page > lastPage;
            newVal = page;
        }

        if ( limitCheck ) {
            return false;
        }

        localStorageControl.saveBookState(newVal); //записыаем состояния с новым номером страницы
        flags.goToPage = true; //ставим флаг

        window.location = 'page_' + newVal + '.html';
    };

    $('.header-menu__item__page-nav__counter').on('click', function (e) {
        e.stopPropagation();

        let counter = $(this);
        let prev = $('.header-menu__item__page-nav__prev');
        let next = $('.header-menu__item__page-nav__next');
        let input = $('.header-menu__item__page-nav__input');
        let oldTitleNext = next.attr('title');

        if ( input.hasClass('hidden') ) {
            input.removeClass('hidden');
            counter.addClass('hidden');
            prev.addClass('hidden');
            input.val(''); //for Firefox
            input.focus();
            next.attr('title', 'Перейти');

            setTimeout(function () {
                $(document).one('click', function () {
                    input.addClass('hidden');
                    counter.removeClass('hidden');
                    prev.removeClass('hidden');
                    next.attr('title', oldTitleNext);
                    next.off('click.forCounter');
                    input.off('keypress.forCounter');
                });
            }, 0);

            const goToPageByCounter = function () {
                if (input.val().length < 1) return;

                let page = parseInt(input.val());

                if (isNaN(page)) return;

                let speed = 700;

                loopBgStop({loop: 'all', fadeOutSpeed: speed});
                turningEffectPage({
                    oriDomiParams: {
                        speed: speed,
                        listAxis: 'left'
                    },
                    callback: function () {
                        goToPage({page: page});
                    }
                });
            };

            next.on('click.forCounter', function (e) {
                e.stopImmediatePropagation();
                goToPageByCounter();
            });

            input.on('keypress.forCounter', function (e) {
                if (e.which == 13) {
                    goToPageByCounter();
                }
            });
        }
    });

    $('.header-menu__item__page-nav__input').on('click', function (e) {
       e.stopPropagation();
    });

    /**
     *
     * @param params
     * @param params.oriDomiParams {object}
     * @param [params.oriDomiParams.speed] {number} - скорость анимации перелистывания; default = 700
     * @param params.oriDomiParams.listAxis {string} - какая сторона будет якорем
     * @param params.callback {function}
     *
     */
    const turningEffectPage = function (params = {}) {
        let oriDomiParams = params.oriDomiParams;
        let callback = params.callback;

        //если параметры для oriDomi не были передены или listAxis не равно left или right, или не был передан callback, то выходим
        if (!oriDomiParams || !(oriDomiParams.listAxis == 'left' || oriDomiParams.listAxis == 'right') || !callback) return;

        oriDomiParams.speed = oriDomiParams.speed || 700;

        oriDomiParams.vPanels = [1, 99];

        if (oriDomiParams.listAxis == 'right') {
            oriDomiParams.vPanels = [99, 1];
        }

        let $paper = READING_PLACE.find('.text').oriDomi({
            maxAngle: 180,
            vPanels: oriDomiParams.vPanels,
            shading: false,
            touchEnabled: false,
            speed: oriDomiParams.speed
        });

        READING_PLACE.find('.text').addClass('page-turning');

        //костыль, в документации не смог найти как убрать лишний отступ
        setTimeout(function () {
            $('.oridomi-stage-' + oriDomiParams.listAxis).find('> .oridomi-panel-v').css('margin-' + oriDomiParams.listAxis, 'calc(-1% - 2px)');
        }, (oriDomiParams.speed/2));

        $paper.oriDomi('ramp', -180, oriDomiParams.listAxis, function () {
            callback();
        });
    };

    $('.header-menu__item__page-nav__prev').add('.header-menu__item__page-nav__next').on('click', function () {
        let $this = $(this);
        let activePageEl = $('.header-menu__item__page-nav__counter__active-page');
        let lastPageEl = $('.header-menu__item__page-nav__counter__last-page');
        let activePage = parseInt( activePageEl.text() );
        let lastPage = parseInt( lastPageEl.text() );

        if ($this.hasClass('header-menu__item__page-nav__next') && activePage + 1 > lastPage) return;
        if ($this.hasClass('header-menu__item__page-nav__prev') && activePage - 1 < 1) return;

        let speed = 700;
        let listAxis = 'right';

        if ($this.hasClass('header-menu__item__page-nav__next')) {
            listAxis = 'left';
        }

        loopBgStop({loop: 'all', fadeOutSpeed: speed});
        turningEffectPage({
            oriDomiParams: {
                speed: speed,
                listAxis: listAxis
            },
            callback: function () {
                goToPage({page: $this});
            }
        });
    });

    //сохраняем/загружаем состояния. не забываем, что всё хранится в строках
    const localStorageControl = {
        /**
         * @params params {object}
         * @param params.newPage {string}
         */
        saveBookState: function (params = {}) {
            //params = params || {};
            let newPage = params.newPage;

            if ( !localStorageControl.isLocalStorageSupported() ) return false;

            let states = {
                volume: getCurrentGlobalVolume(),
                vibro: $('.header-menu__item__vibration__icon').attr('data-vibration'),
                newPage: newPage,
                page: $('.header-menu__item__page-nav__counter__active-page').text(),
                fontSize: READING_PLACE.find('.text').attr('data-font-size'),
                scrollTop: Math.abs(parseInt($('.mCustomScrollBox.mCS-activeBook').find('> .mCSB_container').css('top')))
            };

            //
            if ( flags.goToPage ) {
                states.goToPageDeny = true;
            } else {
                states.goToPageDeny = false;
            }

            //localStorage.removeItem('activeBook');
            localStorage.setItem('activeBook', JSON.stringify(states)); //сериализуем объект в строку
        },

        /**
         * загружаем состояния.
         * состояние позиции страницы загружаем, если пользователь продолжает читать ту же страницу;
        * */
        resumeReading: function () {
            if ( !localStorage.getItem('activeBook') ) return false;

            let states = JSON.parse(localStorage.getItem('activeBook')); //получаем значение и десериализируем его в объект

            volumeChange({volume: states.volume});

            vibroControl.vibroChangeState(VIBRATION_ICON, states.vibro);
            changeFontSize({newFontSize: states.fontSize});

            if (parseInt($('.header-menu__item__page-nav__counter__active-page').text()) != parseInt(states.page)) {
                /*если данная страница не соотвествует той, что указана в сохранённом состоянии,
                и если нет флага на запрет перехода на другую страницу,
                то переходим на страницу, где пользователь завершил чтение,
                иначе - продолжаем скрипт и перематываем.

                иными словами - если пользователь загружает ту же страницу, где читал, перематываем;
                иначе - кидаем его на страницу, где он был.
                * */

                if ( states.goToPageDeny ) return true;

                //goToPage({page: parseInt(states.page)}); //todo: какой-то баг
            }

            //перематываем к месту чтения без плавности - сразу прыгаем
            READING_PLACE.find('.text').mCustomScrollbar('scrollTo', states.scrollTop, {scrollInertia : 0});

            return true;
        },

        //проверяем на доступность localStorage (safari в приватном режиме отключает его, поймаем эксепшн)
        isLocalStorageSupported: function () {
            let testKey = 'test', storage = localStorage;

            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                return true;
            } catch (error) {
                return false;
            }
        }
    };

    //загружаем состояния при открытии страницы и проверяем что возвращет эта функция
    if(!localStorageControl.resumeReading()) {
        //set default volume if there is no localStorage of activeBook
        volumeChange({volume: defaultGlobalVolume});
    }

    playEffectsOnLoad();

    //сохраняем состояния при закрытии вкладки
    $(window).unload(function () {
        localStorageControl.saveBookState();
    });

    //проверка активности окна
    $(window).on('blur', function () {
        //localStorageControl.saveBookState();
    });

    $(window).on('focus', function () {
        //localStorageControl.resumeReading();
    });
});