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