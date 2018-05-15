import {scrollAutoHideInit} from './scrollAutoHideInit';

export function textInit(EffectsController) {
    //action text click event
    $('[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        EffectsController.play($(this).data('effect-target'));
    });

    scrollAutoHideInit();
}