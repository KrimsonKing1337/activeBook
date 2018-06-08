class Gallery {
    constructor() {
        this.$galleryWrapper = $('.gallery-wrapper');
        this.$gallery = this.$galleryWrapper.find('.gallery');
        this.$iconForward = this.$galleryWrapper.find('.js-gallery-forward-icon');
        this.$iconBackward = this.$galleryWrapper.find('.js-gallery-backward-icon');
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
    }

    refresh() {
        this.$gallery.slick('refresh');
    }

    destroy() {
        this.$gallery.slick('unslick');

        this.$iconForward.off('click');

        this.$iconBackward.off('click');
    }
}

export const galleryInst = new Gallery();