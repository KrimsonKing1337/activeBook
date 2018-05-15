//сохраняем значения настроек
import LocalStorage from './modules/LocalStorage';
import getDOMSelectors from './modules/GetDOMSelectors';
import {volumeInst} from './modules/Effects';

const DOMSelectors = getDOMSelectors();

export function volumeSaveStates() {
    const volumeGlobalSlider = $(DOMSelectors.volumeGlobal).find('.js-range-slider');
    const volumeOneShotsSlider = $(DOMSelectors.volumeOneShots).find('.js-range-slider');
    const volumeLoopsSlider = $(DOMSelectors.volumeLoops).find('.js-range-slider');

    LocalStorage.write({
        key: 'volume',
        val: {
            global: volumeInst.global,
            oneShots: volumeInst.oneShots,
            loops: volumeInst.loops
        }
    });

    LocalStorage.write({
        key: 'volumeSlidersPosition',
        val: {
            global: volumeGlobalSlider.val(),
            oneShots: volumeOneShotsSlider.val(),
            bg: volumeLoopsSlider.val()
        }
    });
}