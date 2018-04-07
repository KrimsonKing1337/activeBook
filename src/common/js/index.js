import {childInit} from './childInit';
import {parentInit} from './parentInit';

$(window).on('load', () => {
    const $body = $('body');

    if ($body.data('type') === 'parent') {
        parentInit();
    } else {
        childInit();
    }
});