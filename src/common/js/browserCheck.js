import bowser from 'bowser';

//browser compatibility check
export function browserCheck () {
    const $body = $('body');

    //if (bowser.msie || bowser.msedge || bowser.safari) {
    if (bowser.msie || bowser.msedge) {
        $body.empty();
        $body.append('<div class="warning">Пожалуйста, используйте Google Chrome версии 58+ или Firefox версии 53+</div>');

        return false;
    }

    return true;
}