//сохраняем значения настроек
import LocalStorage from './modules/LocalStorage';
import getDOMSelectors from './modules/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function saveStates(VolumeInst) {
    const volumeGlobalSlider = $(DOMSelectors.volumeGlobal).find('.js-range-slider');
    const volumeOneShotsSlider = $(DOMSelectors.volumeOneShots).find('.js-range-slider');
    const volumeBgSlider = $(DOMSelectors.volumeBg).find('.js-range-slider');

    const bookmarks = [];

    $('.js-bookmark-item:not(.template)').each((i, item) => {
        const $bookmark = $(item);
        const date = $bookmark.find('.js-bookmark-date').text().trim();
        const page = $bookmark.find('.js-bookmark-page').text().trim();

        bookmarks.push({
            date,
            page
        });
    });

    LocalStorage.saveState({
        volume: {
            global: VolumeInst.getGlobal(),
            oneShots: VolumeInst.getOneShots(),
            loops: VolumeInst.getLoops()
        },
        volumeSlidersPosition: {
            global: volumeGlobalSlider.val(),
            oneShots: volumeOneShotsSlider.val(),
            bg: volumeBgSlider.val()
        },
        currentPage: $(DOMSelectors.pageNumber).attr('data-page-number'),
        fontSize: $(DOMSelectors.text).attr('data-font-size'),
        lineHeight: $(DOMSelectors.text).attr('data-line-height'),
        scrollTop: Math.abs(parseInt($('.mCustomScrollBox.mCS-activeBook').find('> .mCSB_container').css('top'))),
        theme: $(DOMSelectors.page).attr('data-theme'),
        vibration: $(DOMSelectors.page).attr('data-vibration'),
        bookmarks
    });
}