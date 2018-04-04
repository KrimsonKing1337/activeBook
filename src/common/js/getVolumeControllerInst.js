import {VolumeController} from './modules/Volume';

export function getVolumeControllerInst({VolumeInst, EffectsController, $audios = $('audio'), $videos = $('video')} = {}) {
    return new VolumeController({
        Volume: VolumeInst,
        $audios,
        $videos,
        loops: EffectsController.soundEffectsInst.AudioLoops
    });
}