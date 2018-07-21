import getDOMSelectors from '../helpers/GetDOMSelectors';
import {VideoPlayer} from './VideoPlayer';
import {Gallery} from './Gallery';
import 'slick-carousel';
import {CssVariables} from '../helpers/CssVariables';
import LocalStorage from '../states/LocalStorage';
import {getRootApp} from '../helpers/getRootApp';

const DOMSelectors = getDOMSelectors();

export class ModalContent {
    constructor() {
        this.$modalContentWrapper = $('.modal-content-wrapper');
        this.$modalContent = $(DOMSelectors.modalContent).filter('.template').clone().removeClass('template');
        this.$modalContentClose = this.$modalContent.find(DOMSelectors.modalContentClose);
        this.$modalContentFullScreenIcon = this.$modalContent.find('.js-modal-content-full-screen');
        this.$modalContentObjectFitIcon = this.$modalContent.find('.js-modal-content-object-fit');
        this.$imgWrapper = this.$modalContent.find('.js-modal-img-wrapper');
        this.$galleryWrapper = this.$modalContent.find('.gallery-wrapper');
        this.$gallery = this.$modalContent.find('.gallery');
        this.$videoWrapper = this.$modalContent.find('.video-wrapper');
        this.$videoPlayer = this.$modalContent.find('.video-player');
        this.$video = this.$modalContent.find('video');
        this.$sectionWrapper = this.$modalContent.find('.section-wrapper');
        this.$section = this.$modalContent.find('section');
        this.$iconExpand = this.$modalContent.find('.js-modal-content-icon-expand');
        this.$iconCompress = this.$modalContent.find('.js-modal-content-icon-compress');
        this.isOpen = false;
        this.isFullScreen = false;
        this.id = '';
        this.contentType = '';
    }

    /**
     *
     * @param effect {object}
     */
    init(effect) {
        this.id = effect.id;
        this.append(effect.id);
        this.contentType = effect.modalContentType;
        this.$modalContent.attr('data-content-type', this.contentType);
        this.initCloseBtn();
        this.initFullScreenBtn();
        this.initObjectFitBtn();
        this.set(effect);
        ModalContent.videoPlayerInit(this.id);
    }

    async reset() {
        await this.close(true);

        this.$imgWrapper.removeClass('active');

        if (this.$gallery.data('galleryInst')) {
            this.$gallery.data('galleryInst').destroy();
        }

        this.$gallery.empty();
        this.$galleryWrapper.removeClass('active');

        this.$videoWrapper.removeClass('active');
        this.$video.attr('src', '');

        this.$section.removeClass('active');
        this.$section.html('');

        this.$modalContentFullScreenIcon.removeClass('active');

        this.$modalContent.attr('data-content-type', '');

        return Promise.resolve();
    }

    async destroy() {
        await this.reset();

        this.$videoPlayer.data('videoPlayerInst').destroy();

        this.$modalContent.data('modalContentInst', '');

        this.$modalContentClose.off('click');
        this.$modalContentFullScreenIcon.removeClass('active');
        this.$modalContentFullScreenIcon.off('click');
        this.$modalContentObjectFitIcon.removeClass('active');
        this.$modalContentObjectFitIcon.off('click');

        $(document).off('keydown.forModalContent');

        this.$modalContent.remove();

        return Promise.resolve();
    }

    /**
     *
     * @param method {string}
     * @param [options[]] {any}
     */
    static async doForAll(method, options = []) {
        const promisesArr = [];

        $(DOMSelectors.modalContent).filter(':not(.template)').each((i, modalContentCur) => {
            const inst = ModalContent.getInstById($(modalContentCur).attr('data-modal-content-id'));

            promisesArr.push(inst[method](...options));
        });

        return Promise.all(promisesArr);
    }

    static async resetAll() {
        return ModalContent.doForAll('reset');
    }

    static async destroyAll() {
        return ModalContent.doForAll('destroy');
    }

    /**
     *
     * @param [withoutAnimation] {boolean}
     */
    static async closeAll(withoutAnimation) {
        return ModalContent.doForAll('close', withoutAnimation);
    }

    /**
     *
     * @param id {string}
     */
    append(id) {
        this.$modalContentWrapper.append(this.$modalContent);
        this.$modalContent.data('modalContentInst', this);
        this.$modalContent.attr('data-modal-content-id', id);
    }

    /**
     *
     * @param src[] {string};
     * @param poster[] {string};
     * @param modalContentType {string};
     */
    set({src, poster, modalContentType} = {}) {
        if (modalContentType === 'image') {
            ModalContent.setImg(this.$imgWrapper, src);
            ModalContent.showElem(this.$imgWrapper);
        } else if (modalContentType === 'video') {
            ModalContent.setVideo(this.$video, src, poster);
            ModalContent.showElem(this.$videoWrapper);
        } else if (modalContentType === 'html') {
            ModalContent.setHtml(this.$section, src);
            ModalContent.showElem(this.$sectionWrapper);
        } else if (modalContentType === 'gallery') {
            ModalContent.setGallery(this.$gallery, src, this.id);
            ModalContent.showElem(this.$galleryWrapper);
        } else {
            this.$modalContent.attr('data-content-type', '');

            console.error('Unknown modal content type:', modalContentType);
        }
    }

    /**
     *
     * @param id {string}
     */
    static getInstById(id) {
        return $(DOMSelectors.modalContent).filter(`[data-modal-content-id=${id}]`).data('modalContentInst');
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
     * @param posterSrc[] {string}
     */
    static setVideo($el, src, posterSrc = [`${getRootApp()}/img/poster-default.jpg`]) {
        $el.attr('src', src);
        $el.attr('poster', posterSrc);
    }

    /**
     *
     * @param $el {object} jquery
     * @param src {string}
     */
    static setImg($el, src) {
        const newImage = ModalContent.getNewGifOrImgByExt(src);

        $el.append(newImage);
    }

    /**
     *
     * @param src {string}
     */
    static getNewGif(src) {
        return `<video class="gif" loop muted src="${src}" poster="${getRootApp()}/img/poster-default.jpg" />`
    }

    /**
     *
     * @param src {string}
     */
    static getNewImg(src) {
        return `<img src="${src}" />`
    }

    /**
     *
     * @param src {string}
     */
    static getNewGifOrImgByExt(src) {
        const ext = src.split('.').pop();

        if (ext === 'mp4' || ext === 'webm') {
            return ModalContent.getNewGif(src);
        } else {
            return ModalContent.getNewImg(src);
        }
    }

    /**
     *
     * @param $el {object} jquery
     * @param src[] {string}
     * @param modalId {string}
     */
    static setGallery($el, src, modalId) {
        src.forEach((srcCur) => {
            const newGalleryItem = ModalContent.getNewGifOrImgByExt(srcCur);

            $el.append(newGalleryItem);
        });

        ModalContent.galleryInit(modalId);
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

    /**
     *
     * @param modalId {string}
     */
    static galleryInit(modalId) {
        const gallery = new Gallery(modalId);

        gallery.init();
    }

    /**
     *
     * @param modalId {string}
     */
    static videoPlayerInit(modalId) {
        const videoPlayer = new VideoPlayer(modalId);

        videoPlayer.init();
    }

    static playAllGifs() {
        const $gifs = $(DOMSelectors.modalContent).filter(':not(.template)').find('video.gif');

        if ($gifs.length > 0) {
            $gifs.each((i, gifCur) => {
                if (gifCur.paused === true) {
                    gifCur.play();
                }
            });
        }
    }

    open() {
        this.$modalContent.addClass('active');
        this.$modalContent.animateCss('fadeIn', () => {
            if (this.contentType === 'video') {
                this.$videoPlayer.data('videoPlayerInst').play();
            } else if (this.contentType === 'html') {
                setTimeout(() => {
                    this.$sectionWrapper.focus();
                }, 0);
            } else if (this.contentType === 'gallery') {
                if (this.$gallery.find('.slick-track').css('width') === '0px') {
                    this.$gallery.data('galleryInst').refresh();
                }
            } else if (this.contentType === 'image') {
                ModalContent.playAllGifs();
            }

            this.isOpen = true;
        });
    }

    /**
     *
     * @param [withoutAnimation] {boolean}
     */
    close(withoutAnimation = false) {
        if (this.isOpen === false) return Promise.resolve();

        const animateCssDurationOld = CssVariables.get('--animate-css-duration');

        if (withoutAnimation === true) {
            CssVariables.set('--animate-css-duration', '0');
        }

        return new Promise((resolve, reject) => {
            this.$modalContent.animateCss('fadeOut', () => {
                this.$modalContent.removeClass('active');
                this.fullScreenOff();

                if (this.$videoPlayer.data('videoPlayerInst').enable === true) {
                    this.$videoPlayer.data('videoPlayerInst').pause();
                }

                setTimeout(() => {
                    $(DOMSelectors.textWrapper).focus();
                }, 0);

                this.isOpen = false;

                CssVariables.set('--animate-css-duration', animateCssDurationOld);

                resolve();
            });
        });
    }

    initCloseBtn() {
        this.$modalContentClose.on('click', () => {
            this.close();
        });
    }

    initObjectFitBtn() {
        if (this.contentType === 'html') return;

        this.$modalContentObjectFitIcon.on('click', () => {
            this.objectFitToggle();
        });

        this.$modalContentObjectFitIcon.addClass('active');
    }

    objectFitToggle() {
        if (CssVariables.get('--modal-content-object-fit') === 'cover') {
            ModalContent.objectFitContain();
        } else {
            ModalContent.objectFitCover();
        }

        if (this.contentType === 'gallery') {
            this.$gallery.data('galleryInst').refresh();
        }
    }

    static objectFitCover() {
        CssVariables.set('--modal-content-object-fit', 'cover');

        LocalStorage.write({key: 'modalObjectFit', val: 'cover'});
    }

    static objectFitContain() {
        CssVariables.set('--modal-content-object-fit', 'contain');

        LocalStorage.write({key: 'modalObjectFit', val: 'contain'});
    }

    initFullScreenBtn() {
        if (this.contentType === 'html') return;

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

        if (this.contentType === 'gallery') {
            this.$gallery.data('galleryInst').refresh();
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