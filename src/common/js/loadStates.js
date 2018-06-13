import {Bookmarks, FontSize, LineHeight, Theme, Vibration, VolumeSliders} from './Menu';
import LocalStorage from './LocalStorage';
import getDOMSelectors from './GetDOMSelectors';
import {CssVariables} from './CssVariables';
import {FilterEffects} from './Effects';


const DOMSelectors = getDOMSelectors();

export function loadStates() {
    const states = LocalStorage.getStates();

    //volume sliders position
    if (states.volume && states.volumeSlidersPosition) {
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
    }

    //font-size
    if (states.fontSize) {
        FontSize.set({
            $target: $(DOMSelectors.page),
            newVal: states.fontSize
        });
    }

    //line-height
    if (states.lineHeight) {
        LineHeight.set({
            $target: $(DOMSelectors.page),
            $val: $(DOMSelectors.lineHeightVal),
            newVal: states.lineHeight
        });
    }

    //theme
    if (states.theme) {
        Theme.set({
            $target: $(DOMSelectors.page),
            val: states.theme,
            $themeOption: $(DOMSelectors.themeOption)
        });
    }

    //vibration
    if (states.vibration) {
        Vibration.set({
            $target: $(DOMSelectors.page),
            val: states.vibration,
            $vibrationOption: $(DOMSelectors.vibrationOption)
        });
    }

    //bookmarks
    if (states.bookmarks) {
        Bookmarks.set({
            $bookmarkContainer: $('.js-bookmarks-list'),
            $bookmarkTemplate: $('.js-bookmark-item.template'),
            bookmarksArr: states.bookmarks
        });
    }

    if (states.modalObjectFit) {
        CssVariables.set('--modal-content-object-fit', states.modalObjectFit);
    }

    if (states.filterInvert) {
        //FilterEffects.invert(states.filterInvert, false);
    }
}