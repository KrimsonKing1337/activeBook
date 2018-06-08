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

        $(window).on('orientationchange.forGallery', () => {
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

        this.$iconForward.off('click');

        this.$iconBackward.off('click');

        $(window).off('orientationchange.forGallery');
    }
}

export const galleryInst = new Gallery();