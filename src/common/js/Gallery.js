import getDOMSelectors from './GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

class Gallery {
    constructor() {
        this.$modalContent = $(DOMSelectors.modalContent);
        this.$galleryWrapper = this.$modalContent.find('.gallery-wrapper');
        this.$gallery = this.$modalContent.find('.gallery');
        this.$iconForward = this.$modalContent.find('.gallery-forward');
        this.$iconBackward = this.$modalContent.find('.gallery-backward');
    }

    init() {
        this.$gallery.slick({
            arrows: false,
            slidesToShow: 1,
            mobileFirst: true,
            //infinite: false
        });

        this.$iconForward.on('click', () => {
            this.$gallery.slick('slickNext');
        });

        this.$iconBackward.on('click', () => {
            this.$gallery.slick('slickPrev');
        });
    }

    refresh() {
        this.$gallery.slick('refresh');
    }

    destroy() {
        this.$gallery.slick('unslick');

        this.$iconForward.off('click');

        this.$iconBackward.of('click');
    }
}

export const galleryInst = new Gallery();