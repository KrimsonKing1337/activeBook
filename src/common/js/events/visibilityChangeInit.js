import {EffectsController} from '../effects/Effects';
import LocalStorage from '../states/LocalStorage';
import {playOnLoad} from '../effects/playOnLoad';
import filter from 'lodash-es/filter';

export function visibilityChangeInit() {
    document.addEventListener('visibilitychange', () => {
        const pageCurEffects = LocalStorage.read({key: 'pageCurEffects'});

        if (document.hidden) {
            EffectsController.stopAll({
                target: 'all',
                unload: false
            });
        } else {
            //воспроизводим заново всё, кроме oneShot-ов
            playOnLoad(filter(pageCurEffects, (o) => o.type !== 'oneShot'));
        }
    }, false);
}