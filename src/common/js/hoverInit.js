/**
 *
 * @param elems[] {object} jquery;
 * имитация ховеров для тач-событий
 */
export function hoverInit(elems) {
    elems.forEach(($elemCur) => {
        $elemCur.click(function (e) {
            const $el = $(this);

            $el.addClass('hover');

            setTimeout(() => {
                $el.removeClass('hover');
            }, 666);
        });
    });
}