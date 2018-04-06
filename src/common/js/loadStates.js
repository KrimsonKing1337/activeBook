import {Bookmarks, FontSize, LineHeight, Theme, Vibration, VolumeSliders} from './modules/Menu';
import LocalStorage from './modules/LocalStorage';
import getDOMSelectors from './modules/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function loadStates() {
    const states = LocalStorage.getState();

    if (states === false) return;

    //volume sliders position
    VolumeSliders.set({
        sliders: {
            global: {
                inst: $(DOMSelectors.volumeGlobal).find('.js-range-slider').data('ionRangeSlider'),
                val: states.volumeSlidersPosition.global
            },
            oneShots: {
                inst: $(DOMSelectors.volumeOneShots).find('.js-range-slider').data('ionRangeSlider'),
                val: states.volumeSlidersPosition.oneShots
            },
            bg: {
                inst: $(DOMSelectors.volumeBg).find('.js-range-slider').data('ionRangeSlider'),
                val: states.volumeSlidersPosition.bg
            }
        }
    });

    //todo: заменить на volume.global = ..., etc.

    $(DOMSelectors.volumeGlobal).trigger('change');
    $(DOMSelectors.volumeOneShots).trigger('change');
    $(DOMSelectors.volumeBg).trigger('change');

    //font-size
    FontSize.set({
        $text: $(DOMSelectors.text),
        newVal: states.fontSize
    });

    //line-height
    LineHeight.set({
        $text: $(DOMSelectors.text),
        $val: $(DOMSelectors.lineHeightVal),
        newVal: states.lineHeight
    });

    //theme
    Theme.set({
        $page: $(DOMSelectors.page),
        val: states.theme,
        $themeOption: $(DOMSelectors.themeOption)
    });

    //vibration
    Vibration.set({
        $page: $(DOMSelectors.page),
        val: states.vibration,
        $vibrationOption: $(DOMSelectors.vibrationOption)
    });

    //bookmarks
    Bookmarks.set({
        $bookmarkContainer: $('.js-bookmarks-list'),
        $bookmarkTemplate: $('.js-bookmark-item.template'),
        bookmarksArr: states.bookmarks
    });
}