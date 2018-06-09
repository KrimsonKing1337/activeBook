import getDOMSelectors from './GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

function getActiveModal() {
    const $modalContent = $(DOMSelectors.modalContent).filter(':not(.template)');

    return $modalContent.filter('.active');
}

function isGalleryActive() {
    const $activeModal = getActiveModal();

    return $activeModal.length > 0 && $activeModal.attr('data-content-type') === 'gallery';
}

export function keyboardArrowsInit() {
    /**
     * стрелка вперёд = след. страница или следующий слайд (если открыта галерея в модалке)
     * стрелка назад = пред. страница или предыдущий слайд (если открыта галерея в модалке)
     */
    $(document).on('keydown', (e) => {
        if (e.which === 37) {
            if (isGalleryActive() === true) {
                getActiveModal().find('.js-gallery-backward-icon').trigger('click');
            } else {
                $('.js-page-prev').trigger('click');
            }
        } else if (e.which === 39) {
            if (isGalleryActive() === true) {
                getActiveModal().find('.js-gallery-forward-icon').trigger('click');
            } else {
                $('.js-page-next').trigger('click');
            }
        }
    });
}