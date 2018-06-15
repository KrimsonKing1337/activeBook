import {FilterEffects} from './Effects';

/**
 *
 * @param pageNumberCurrent {number}
 * @param pageNumberForInvert {number}
 */
export function invertColorsByPageNumber(pageNumberCurrent, pageNumberForInvert) {
    if (pageNumberCurrent >= pageNumberForInvert) {
        FilterEffects.invert(true);
    } else {
        FilterEffects.invert(false);
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