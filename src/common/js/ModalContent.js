import getDOMSelectors from './GetDOMSelectors';
import {videoPlayerInst} from './VideoPlayer';
import {galleryInst} from './Gallery';
import 'slick-carousel';

const DOMSelectors = getDOMSelectors();

class ModalContent {
    constructor() {
        this.$modalContent = $(DOMSelectors.modalContent);
        this.$modalContentClose = $(DOMSelectors.modalContentClose);
        this.$modalContentFullScreenIcon = this.$modalContent.find('.js-modal-content-full-screen');
        this.$img = this.$modalContent.find('.js-modal-img');
        this.$galleryWrapper = this.$modalContent.find('.gallery-wrapper');
        this.$gallery = this.$modalContent.find('.gallery');
        this.$videoWrapper = this.$modalContent.find('.video-wrapper');
        this.$video = this.$modalContent.find('video');
        this.$section = this.$modalContent.find('section');
        this.$iconExpand = this.$modalContent.find('.js-modal-content-icon-expand');
        this.$iconCompress = this.$modalContent.find('.js-modal-content-icon-compress');
        this.isOpen = false;
        this.isFullScreen = false;
    }

    /**
     *
     * @param effect {object}
     */
    //todo: вместо init использовать set, чтобы менять содержимое модалки. в destroy добавить параметр totalDestroy
    //todo: прокрутка содержимого модалки стрелками вверх-вниз (tabindex + focus() на $section)
    //todo: проверка нескольких модалкок на одной странице
    init(effect) {
        this.set(effect);
        this.initCloseBtn();
        this.initFullScreenBtn();
        videoPlayerInst.init();
    }

    async destroy() {
        await this.close();

        this.$img.attr('src', '');
        this.$img.removeClass('active');


        galleryInst.destroy();
        this.$gallery.empty();
        this.$galleryWrapper.removeClass('active');

        videoPlayerInst.destroy();
        this.$videoWrapper.removeClass('active');
        this.$video.attr('src', '');

        this.$section.removeClass('active');
        this.$section.html('');

        this.$modalContentFullScreenIcon.removeClass('active');
        this.$modalContentClose.off('click');
        this.$modalContentFullScreenIcon.off('click');

        $(document).off('keydown.forModalContent');

        this.isOpen = false;
        this.isFullScreen = false;
        this.$modalContent.attr('data-content-type', '');

        return Promise.resolve();
    }

    /**
     *
     * @param src[] {string};
     * @param modalContentType {string};
     */
    set({src, modalContentType} = {}) {
        this.$modalContent.attr('data-content-type', modalContentType);

        if (modalContentType === 'image') {
            ModalContent.setSrc(this.$img, src);
            ModalContent.showElem(this.$img);
        } else if (modalContentType === 'video') {
            ModalContent.setSrc(this.$video, src);
            ModalContent.showElem(this.$videoWrapper);
        } else if (modalContentType === 'html') {
            ModalContent.setHtml(this.$section, src);
            ModalContent.showElem(this.$section);
        } else if (modalContentType === 'gallery') {
            ModalContent.setGallery(this.$gallery, src);
            ModalContent.showElem(this.$galleryWrapper);
        } else {
            this.$modalContent.attr('data-content-type', '');

            console.error('Unknown modal content type:', modalContentType);
        }
    }

    /**
     *
     * @param $el {object} jquery
     */
    static showElem($el) {
        $el.addClass('active');
    }

    /**
     *
     * @param $el {object} jquery
     * @param src[] {string}
     */
    static setSrc($el, src) {
        $el.attr('src', src[0]);
    }

    /**
     *
     * @param $el {object} jquery
     * @param src[] {string}
     */
    static setGallery($el, src) {
        src.forEach((srcCur) => {
            $el.append(`<img src="${ srcCur }" />`);
        });

        galleryInst.init();
    }

    /**
     *
     * @param $el {object} jquery
     * @param src {string}
     */
    static setHtml($el, src) {
        const html = $('.for-modal-content').find(`[data-html-id=${src}]`).html();

        $el.html(html);
    }

    open() {
        this.$modalContent.addClass('active');
        this.$modalContent.animateCss('fadeIn');

        if (this.$modalContent.attr('data-content-type') === 'video') {
            videoPlayerInst.play();
        }

        this.isOpen = true;
    }

    close() {
        if (this.isOpen === false) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.$modalContent.animateCss('fadeOut', () => {
                this.$modalContent.removeClass('active');
                this.fullScreenOff();
                videoPlayerInst.pause();
                $(DOMSelectors.textWrapper).focus();

                this.isOpen = false;

                resolve();
            });
        });
    }

    initCloseBtn() {
        this.$modalContentClose.on('click', () => {
            this.close();
        });

        //esc = close
        $(document).on('keydown.forModalContent', (e) => {
            if (e.which === 27 && this.isOpen === true) {
                if (this.isFullScreen === true) {
                    this.fullScreenOff();
                } else {
                    this.close();
                }
            }
        });
    }

    initFullScreenBtn() {
        if (this.$modalContent.attr('data-content-type') !== 'image' &&
            this.$modalContent.attr('data-content-type') !== 'gallery' &&
            this.$modalContent.attr('data-content-type') !== 'video') {
            return;
        }

        this.$modalContentFullScreenIcon.on('click', () => {
            this.fullScreenToggle();
        });

        //F = full screen
        $(document).on('keydown.forModalContent', (e) => {
            if (this.isOpen === true && e.which === 70) {
                this.fullScreenToggle();
            }
        });

        this.$modalContentFullScreenIcon.addClass('active');
    }

    fullScreenToggle() {
        if (this.$modalContent.hasClass('full-screen') === false) {
            this.fullScreenOn();
        } else {
            this.fullScreenOff();
        }

        if (this.$modalContent.attr('data-content-type') === 'gallery') {
            galleryInst.refresh();
        }
    }

    fullScreenOn() {
        this.$iconExpand.removeClass('active');
        this.$iconCompress.addClass('active');
        this.$modalContent.addClass('full-screen');
        this.isFullScreen = true;
    }

    fullScreenOff() {
        this.$iconCompress.removeClass('active');
        this.$iconExpand.addClass('active');
        this.$modalContent.removeClass('full-screen');
        this.isFullScreen = false;
    }
}

export const modalContentInst = new ModalContent();