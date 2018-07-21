import {Invert} from '../menu/Menu';
import getDOMSelectors from '../helpers/GetDOMSelectors';
import LocalStorage from '../states/LocalStorage';

const DOMSelectors = getDOMSelectors();

/**
 *
 * @param pageNumberCurrent {number}
 * @param range[] {object}
 */
function isPageInRange(pageNumberCurrent, range) {
    if (range.length > 0) {
        return range.some((rangeCur) => {
            return pageNumberCurrent >= rangeCur.start && pageNumberCurrent < rangeCur.stop;
        });
    } else {
        return pageNumberCurrent >= range.start && pageNumberCurrent < range.stop;
    }
}

/**
 *
 * @param pageNumberCurrent {number}
 * @param range[] {object}
 */
export function invertColorsByPageNumber(pageNumberCurrent, range) {
    const localStorageFilterInvert = LocalStorage.read({key: 'filterInvert'});

    if (isPageInRange(pageNumberCurrent, range) === true) {
        if (localStorageFilterInvert !== null) {
            Invert.set({
                val: localStorageFilterInvert,
                $invertOption: $(DOMSelectors.invertOption)
            });
        } else {
            Invert.set({
                val: true,
                $invertOption: $(DOMSelectors.invertOption)
            });
        }

        $(DOMSelectors.textDotsWrapper).addClass('active');

        Invert.show();
    } else {
        Invert.set({
            val: false,
            $invertOption: $(DOMSelectors.invertOption)
        });

        $(DOMSelectors.textDotsWrapper).removeClass('active');

        Invert.hide();
    }
}

/**
 *
 * @param pagesEffects[] {object}
 */
export function getInvertColorsPagesRange(pagesEffects) {
    let invertPagesRange = null;

    pagesEffects.some((pagesEffectCur) => {
        const effectIsInvert = pagesEffectCur.type === 'invert';

        if (effectIsInvert === true) {
            invertPagesRange = pagesEffectCur.range;

            return effectIsInvert === true;
        }
    });

    if (invertPagesRange === null) return false;

    return invertPagesRange;
}