import {VolumeController} from './modules/Volume';

export function getVolumeControllerInst({VolumeInst, EffectsController, $videos = $('video')} = {}) {
    return new VolumeController({
        Volume: VolumeInst,
        $videos,
        oneShots: EffectsController.soundEffectsInst.oneShots,
        loops: EffectsController.soundEffectsInst.loops
    });
}