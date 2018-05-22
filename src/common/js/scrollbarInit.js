import 'jquery.scrollbar';

/**
 *
 * @param $item {object} jquery
 */
function scrollbarOneInit($item) {
    return new Promise(((resolve, reject) => {
        $item.scrollbar({
            onInit() {
                resolve();
            },
            onScroll() {
                //console.log('scroll');
            }
        });
    }));
}

const $scrollableItem = $('.js-scrollable-item');

export async function scrollbarInit() {
    const promisesArr = [];

    $scrollableItem.addClass('scrollbar-macosx');

    $scrollableItem.each((i, item) => {
        promisesArr.push(scrollbarOneInit($(item)));
    });

    await Promise.all(promisesArr);
}

export function scrollbarDestroy() {
    $scrollableItem.removeClass('scrollbar-macosx').scrollbar('destroy');
}