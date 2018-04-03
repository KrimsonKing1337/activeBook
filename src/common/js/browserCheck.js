import bowser from 'bowser';

//browser compatibility check
export function browserCheck () {
    const $body = $('body');

    if (!bowser.blink && !bowser.gecko && !bowser.safari) {
        $body.empty();
        $body.append('<div class="warning">Пожалуйста, используйте Google Chrome версии 58+ или Firefox версии 53+</div>');

        return false;
    }

    return true;
}