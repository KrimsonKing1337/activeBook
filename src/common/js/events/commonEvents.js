import getDOMSelectors from '../helpers/GetDOMSelectors';
import {ModalContent} from '../modalContent/ModalContent';
import {Gallery} from '../modalContent/Gallery';
import {pageInfo} from '../forAppInit/pageInfo';

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

export function swipesInit() {
    const $textWrapper = $(DOMSelectors.textWrapper);

    $textWrapper.on('swiperight', () => {
        if (pageInfo.pageCurNum === 0) return;

        $('.js-page-prev').trigger('click');
    });

    $textWrapper.on('swipeleft', () => {
        if (pageInfo.pageCurNum === 0) return;

        $('.js-page-next').trigger('click');
    });
}

export function accessoriesForModalContentInit() {
    //esc = close
    $(document).on('keydown.forModalContent', (e) => {
        const $activeModal = getActiveModal();

        if ($activeModal.length === 0) return;

        const modalContentInst = ModalContent.getInstById($activeModal.attr('data-modal-content-id'));

        if (e.which === 27 && this.isOpen === true) {
            if (modalContentInst.isFullScreen === true) {
                modalContentInst.fullScreenOff();
            } else {
                modalContentInst.close();
            }
        }
    });

    //miss click
    $(document).on('click.forModalContent touchstart.forModalContent', (e) => {
        const $target = $(e.target);

        const $activeModal = getActiveModal();

        if ($activeModal.length === 0) return;

        const modalContentInst = ModalContent.getInstById($activeModal.attr('data-modal-content-id'));

        if ($target.hasClass('modal-content') === false &&
            $target.closest('.modal-content').length === 0) {
            modalContentInst.close();
        }
    });

    //F = full screen
    $(document).on('keydown.forModalContent', (e) => {
        const $activeModal = getActiveModal();

        if ($activeModal.length === 0) return;

        const modalContentInst = ModalContent.getInstById($activeModal.attr('data-modal-content-id'));

        if (modalContentInst.isOpen === true && e.which === 70) {
            modalContentInst.fullScreenToggle();
        }
    });
}

export function orientationChangeForGalleryInit() {
    $(window).on('orientationchange.forGallery', () => {
        Gallery.refreshAll();
    });
}

export function actionTextInit() {
    //action text click event
    $('[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        window.EffectsController.play($(this).data('effect-target'));
    });

    setTimeout(() => {
        $('.text-wrapper').focus();
    }, 0);
}


export function disableZoomApple() {
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
}