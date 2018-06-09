import getDOMSelectors from './GetDOMSelectors';

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

        $(window).on(`orientationchange.forGallery-${this.id}`, () => {
            this.refresh();
        });
    }

    refresh() {
        this.$gallery.slick('refresh');
    }

    destroy() {
        if (this.$gallery.hasClass('slick-slider')) {
            this.$gallery.slick('unslick');
        }

        this.$gallery.data('galleryInst', '');

        this.$iconForward.off('click');

        this.$iconBackward.off('click');

        $(window).off(`orientationchange.forGallery-${this.id}`);
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
     */
    static async doForAll(method) {
        const promisesArr = [];

        $('.gallery').each((i, galleryCur) => {
            const inst = Gallery.getInstById($(galleryCur).attr('data-gallery-id'));

            promisesArr.push(inst[method]());
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