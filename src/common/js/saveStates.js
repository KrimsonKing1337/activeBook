//сохраняем значения настроек
import LocalStorage from './modules/LocalStorage';
import getDOMSelectors from './modules/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function saveStates(VolumeInst) {
    const volumeGlobalSlider = $(DOMSelectors.volumeGlobal).find('.js-range-slider');
    const volumeOneShotsSlider = $(DOMSelectors.volumeOneShots).find('.js-range-slider');
    const volumeLoopsSlider = $(DOMSelectors.volumeLoops).find('.js-range-slider');

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
            global: VolumeInst.global,
            oneShots: VolumeInst.oneShots,
            loops: VolumeInst.loops
        },
        volumeSlidersPosition: {
            global: volumeGlobalSlider.val(),
            oneShots: volumeOneShotsSlider.val(),
            bg: volumeLoopsSlider.val()
        },
        currentPage: $(DOMSelectors.pageNumber).attr('data-page-number'),
        fontSize: $(DOMSelectors.page).attr('data-font-size'),
        lineHeight: $(DOMSelectors.page).attr('data-line-height'),
        scrollTop: Math.abs(parseInt($('.mCustomScrollBox.mCS-activeBook').find('> .mCSB_container').css('top'))),
        theme: $(DOMSelectors.page).attr('data-theme'),
        vibration: JSON.parse($(DOMSelectors.page).attr('data-vibration')),
        bookmarks
    });
}