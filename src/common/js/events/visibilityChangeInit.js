import LocalStorage from '../states/LocalStorage';
import {playOnLoad} from '../effects/playOnLoad';
import filter from 'lodash-es/filter';
import {checkAllAudiosWithRange} from '../effects/audioWithRange';
import {pageInfo} from '../forAppInit/pageInfo';

export function visibilityChangeInit() {
    document.addEventListener('visibilitychange', () => {
        const pageCurEffects = LocalStorage.read({key: 'pageCurEffects'});
        const pagesEffects = LocalStorage.read({key: 'pagesEffects'});

        if (document.hidden) {
            window.EffectsController.stopAll({
                target: 'all',
                unload: false,
                pause: true,
                onesWithRange: true
            });
        } else {
            //воспроизводим заново всё, кроме oneShot-ов
            playOnLoad(filter(pageCurEffects, (o) => o.type !== 'oneShot'));

            checkAllAudiosWithRange(pageInfo.pageCurNum, pagesEffects);
        }
    }, false);
}