import {volumeInst, volumeControllerInst} from '../effects/Effects';

export function visibilityChangeInit() {
    let globalVolume = 0;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            globalVolume = volumeInst.getGlobal();

            volumeControllerInst.setGlobal({volume: 0});
        } else {
            volumeControllerInst.setGlobal({volume: globalVolume});
        }
    }, false);
}