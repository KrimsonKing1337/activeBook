import getDOMSelectors from '../helpers/GetDOMSelectors';
import {ModalContent} from './ModalContent';

const DOMSelectors = getDOMSelectors();

export class Gallery {
    /**
     *
     * @param modalId {string}
     */
    constructor(modalId) {
        this.$modalContent = $(DOMSelectors.modalContent).filter(`[data-modal-content-id=${modalId}]`);
        this.$galleryWrapper = this.$modalContent.find('.gallery-wrapper');
        this.$gallery = this.$galleryWrapper.find('.gallery');
        this.$iconForward = this.$galleryWrapper.find('.js-gallery-forward-icon');
        this.$iconBackward = this.$galleryWrapper.find('.js-gallery-backward-icon');
        this.id = modalId;
    }

    init() {
        this.$gallery.slick({
            arrows: false,
            slidesToShow: 1,
            mobileFirst: true,
            accessibility: false,
            speed: 200
        });

        this.$iconForward.on('click', () => {
            this.$gallery.slick('slickNext');
        });

        this.$iconBackward.on('click', () => {
            this.$gallery.slick('slickPrev');
        });

        this.$gallery.data('galleryInst', this);
        this.$gallery.attr('data-gallery-id', this.id);
    }

    refresh() {
        if (this.$gallery.hasClass('slick-slider')) {
            this.$gallery.slick('refresh');

            ModalContent.playAllGifs();
        }
    }

    destroy() {
        if (this.$gallery.hasClass('slick-slider')) {
            this.$gallery.slick('unslick');
        }

        this.$gallery.data('galleryInst', '');

        this.$iconForward.off('click');

        this.$iconBackward.off('click');
    }

    /**
     *
     * @param id {string}
     */
    static getInstById(id) {
        return $('.gallery').filter(`[data-gallery-id=${id}]`).data('galleryInst');
    }

    /**
     *
     * @param method {string}
     * @param [options[]] {any}
     */
    static async doForAll(method, options = []) {
        const promisesArr = [];

        $('.gallery.slick-initialized').each((i, galleryCur) => {
            const inst = Gallery.getInstById($(galleryCur).attr('data-gallery-id'));

            promisesArr.push(inst[method](...options));
        });

        return Promise.all(promisesArr);
    }

    static async refreshAll() {
        return Gallery.doForAll('refresh');
    }

    static async destroyAll() {
        return Gallery.doForAll('destroy');
    }
}