import {Bookmarks, FontSize, LineHeight, Theme, Vibration, VolumeSliders} from './modules/Menu';
import LocalStorage from './modules/LocalStorage';
import getDOMSelectors from './modules/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function loadStates() {
    const states = LocalStorage.getState();

    if (states === null) return;

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
                inst: $(DOMSelectors.volumeLoops).find('.js-range-slider').data('ionRangeSlider'),
                val: states.volumeSlidersPosition.bg
            }
        }
    });

    $(DOMSelectors.volumeGlobal).trigger('change', false);
    $(DOMSelectors.volumeOneShots).trigger('change', false);
    $(DOMSelectors.volumeLoops).trigger('change', false);

    //font-size
    FontSize.set({
        $target: $(DOMSelectors.page),
        newVal: states.fontSize
    });

    //line-height
    LineHeight.set({
        $target: $(DOMSelectors.page),
        $val: $(DOMSelectors.lineHeightVal),
        newVal: states.lineHeight
    });

    //theme
    Theme.set({
        $target: $(DOMSelectors.page),
        val: states.theme,
        $themeOption: $(DOMSelectors.themeOption)
    });

    //vibration
    Vibration.set({
        $target: $(DOMSelectors.page),
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