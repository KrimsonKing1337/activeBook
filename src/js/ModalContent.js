import getDOMSelectors from './GetDOMSelectors';
import {videoPlayerInst} from './VideoPlayer';

const DOMSelectors = getDOMSelectors();

class ModalContentEffects {
    constructor() {
        this.$modalContent = $(DOMSelectors.modalContent);
        this.$modalContentInner = $(DOMSelectors.modalContentInner);
        this.$modalContentClose = $(DOMSelectors.modalContentClose);
        this.$modalContentFullScreenIcon = this.$modalContent.find('.js-modal-content-full-screen');
        this.$img = this.$modalContent.find('img');
        this.$videoWrapper = this.$modalContent.find('.video-wrapper');
        this.$video = this.$modalContent.find('video');
        this.$iframe = this.$modalContent.find('iframe');
        this.$section = this.$modalContent.find('section');
        this.$expandIcon = this.$modalContent.find('.js-modal-content-icon-expand');
        this.$compressIcon = this.$modalContent.find('.js-modal-content-icon-compress');
    }

    /**
     *
     * @param effect {object}
     */
    init(effect) {
        this.set(effect);
        this.initCloseBtn();
        this.initFullScreenBtn();
        videoPlayerInst.init();
    }

    /**
     *
     * @param src[] {string};
     * @param modalContentType {string};
     */
    set({src, modalContentType} = {}) {
        if (modalContentType === 'image') {
            ModalContentEffects.setSrc(this.$img, src);
            ModalContentEffects.showElem(this.$img);
        } else if (modalContentType === 'video') {
            ModalContentEffects.setSrc(this.$video, src);
            ModalContentEffects.showElem(this.$videoWrapper);
        } else if (modalContentType === 'iframe') {
            ModalContentEffects.setSrc(this.$iframe, src);
            ModalContentEffects.showElem(this.$iframe);
        } else if (modalContentType === 'html') {
            ModalContentEffects.setHtml(this.$section, src);
            ModalContentEffects.showElem(this.$section);
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
     * @param src {string}
     */
    static setHtml($el, src) {
        const html = $('.for-modal-content').find(`[data-html-id=${src}]`).html();

        $el.html(html);
    }

    play() {
        this.$modalContent.addClass('active');
        this.$modalContent.animateCss('fadeIn');
    }

    close() {
        this.$modalContent.animateCss('fadeOut', () => {
            this.$modalContent.removeClass('active');
            this.fullScreenOff();
            videoPlayerInst.pause();
        });
    }

    initCloseBtn() {
        this.$modalContentClose.on('click', () => {
            this.close();
        });
    }

    initFullScreenBtn() {
        if (this.$modalContent.find('img').length === 0 && this.$videoWrapper.length === 0) return;

        this.$modalContentFullScreenIcon.on('click', () => {
            this.fullScreenToggle();
        });

        this.$modalContentFullScreenIcon.addClass('active');
    }

    fullScreenToggle() {
        if (this.$modalContent.hasClass('full-screen') === false) {
            this.fullScreenOn();
        } else {
            this.fullScreenOff();
        }
    }

    fullScreenOn() {
        this.$expandIcon.removeClass('active');
        this.$compressIcon.addClass('active');
        this.$modalContent.addClass('full-screen');
    }

    fullScreenOff() {
        this.$compressIcon.removeClass('active');
        this.$expandIcon.addClass('active');
        this.$modalContent.removeClass('full-screen');
    }
}

export const modalContentInst = new ModalContentEffects();