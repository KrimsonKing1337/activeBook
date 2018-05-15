export function getScrollBarWidth() {
    const $body = $('body');

    $body.css('overflow', 'scroll');

    const clientWidthWidthScrollBar = $body[0].clientWidth;

    $body.css('overflow', '');

    return $body[0].clientWidth - clientWidthWidthScrollBar;
}