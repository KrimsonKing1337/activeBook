export function visibilityChangeInit(VolumeInst, VolumeControllerInst) {
    let globalVolume = 0;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            globalVolume = VolumeInst.getGlobal();

            VolumeControllerInst.setGlobal({volume: 0});
        } else {
            VolumeControllerInst.setGlobal({volume: globalVolume});
        }
    }, false);
}