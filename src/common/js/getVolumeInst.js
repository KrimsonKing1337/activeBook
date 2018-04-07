import {Volume} from './modules/Volume';
import LocalStorage from './modules/LocalStorage';
import get from 'lodash-es/get';

export function getVolumeInst() {
    const states = LocalStorage.getState();

    return new Volume({
        global: get(states, 'volume.global') || 0.5,
        oneShots: get(states, 'volume.oneShots') || 0.5,
        loops: get(states, 'volume.loops') || 0.5
    });
}