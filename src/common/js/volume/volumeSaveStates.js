//сохраняем значения настроек
import LocalStorage from '../states/LocalStorage';
import getDOMSelectors from '../helpers/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function volumeSaveStates() {
    const EffectsController = window.EffectsController;

    const volumeGlobalSlider = $(DOMSelectors.volumeGlobal).find('.js-range-slider');
    const volumeOneShotsSlider = $(DOMSelectors.volumeOneShots).find('.js-range-slider');
    const volumeLoopsSlider = $(DOMSelectors.volumeLoops).find('.js-range-slider');

    LocalStorage.write({
        key: 'volume',
        val: {
            global: EffectsController.volumeInst.global,
            oneShots: EffectsController.volumeInst.oneShots,
            loops: EffectsController.volumeInst.loops
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