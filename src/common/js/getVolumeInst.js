import {Volume} from './modules/Volume';

export function getVolumeInst() {
    return new Volume({
        global: 0.5,
        oneShots: 0.5,
        loops: 0.5
    });
}