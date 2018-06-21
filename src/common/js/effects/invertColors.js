import {Invert} from '../menu/Menu';
import getDOMSelectors from '../helpers/GetDOMSelectors';
import LocalStorage from '../states/LocalStorage';

const DOMSelectors = getDOMSelectors();
/**
 *
 * @param pageNumberCurrent {number}
 * @param pageNumberForInvert {number}
 */
export function invertColorsByPageNumber(pageNumberCurrent, pageNumberForInvert) {
    if (pageNumberCurrent >= pageNumberForInvert) {
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
export function getInvertColorsPageNumber(pagesEffects) {
    let invertPageNumber = null;

    pagesEffects.some((pagesEffectCur) => {
        const effectIsInvert = pagesEffectCur.type === 'invert';

        if (effectIsInvert === true) {
            invertPageNumber = pagesEffectCur.value;

            return effectIsInvert === true;
        }
    });

    if (invertPageNumber === null) return false;

    return invertPageNumber;
}