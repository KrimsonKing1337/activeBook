import getDOMSelectors from './GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

const $modalContent = $(DOMSelectors.modalContent);

function isGalleryActive() {
    return $modalContent.hasClass('active') && $modalContent.attr('data-content-type') === 'gallery';
}

export function keyboardArrowsInit() {
    /**
     * стрелка вперёд = след. страница или следующий слайд (если открыта галерея в модалке)
     * стрелка назад = пред. страница или предыдущий слайд (если открыта галерея в модалке)
     */
    $(document).on('keydown', (e) => {
        if (e.which === 37) {
            if (isGalleryActive() === true) {
                $('.js-gallery-backward-icon').trigger('click');
            } else {
                $('.js-page-prev').trigger('click');
            }
        } else if (e.which === 39) {
            if (isGalleryActive() === true) {
                $('.js-gallery-forward-icon').trigger('click');
            } else {
                $('.js-page-next').trigger('click');
            }
        }
    });
}