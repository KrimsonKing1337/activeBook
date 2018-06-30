import {Invert} from '../menu/Menu';
import getDOMSelectors from '../helpers/GetDOMSelectors';
import LocalStorage from '../states/LocalStorage';

const DOMSelectors = getDOMSelectors();
/**
 *
 * @param pageNumberCurrent {number}
 * @param invertPagesRange {object}
 */
export function invertColorsByPageNumber(pageNumberCurrent, invertPagesRange) {
    if (pageNumberCurrent >= invertPagesRange.start && pageNumberCurrent < invertPagesRange.stop) {
        const localStorageFilterInvert = LocalStorage.read({key: 'filterInvert'});

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

        Invert.show();
    } else {
        Invert.set({
            val: false,
            $invertOption: $(DOMSelectors.invertOption)
        });

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