import bowser from 'bowser';

//browser compatibility check
export function browserCheck () {
    const $body = $('body');

    //if (bowser.msie || bowser.msedge || bowser.safari) {
    if (bowser.msie || bowser.msedge) {
        $body.empty();
        $body.append('<div class="browser-warning">Пожалуйста, используйте Google Chrome, Safari или Firefox последней актуальной версии</div>');

        return false;
    }

    return true;
}