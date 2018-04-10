/**
 *
 * @param elems[] {object} jquery;
 * имитация ховеров для тач-событий
 */
export function hoverInit(elems) {
    elems.forEach(($elemCur) => {
        $elemCur.tapstart(function (e) {
            $(this).addClass('hover');
        });

        $elemCur.tapend(function (e) {
            $(this).removeClass('hover');
        });
    });
}