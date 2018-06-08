import 'jquery.scrollbar';

/**
 *
 * @param $item {object} jquery
 */
function scrollbarInit($item) {
    return new Promise(((resolve, reject) => {
        $item.scrollbar({
            onInit() {
                resolve();
            }
        });
    }));
}

const $scrollableItem = $('.js-scrollable-item');

export async function scrollbarInitAll() {
    const promisesArr = [];

    $scrollableItem.addClass('scrollbar-macosx');

    $scrollableItem.each((i, item) => {
        promisesArr.push(scrollbarInit($(item)));
    });

    await Promise.all(promisesArr);
}

export function scrollbarDestroy() {
    $scrollableItem.removeClass('scrollbar-macosx').scrollbar('destroy');
}

export function showHideScrollbarTouchEventsFix() {
    let timer;

    $scrollableItem.on('touchstart touchmove', function () {
        if (timer) clearTimeout(timer);

        $('.touchend').removeClass('touchend');
        $(this).addClass('touching');
    });

    $scrollableItem.on('touchend', function () {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            $('.touching').removeClass('touching');
            $(this).addClass('touchend');
        }, 300);
    });
}