import 'jquery.scrollbar';

/**
 *
 * @param $item {object} jquery
 */
function scrollbarInit($item) {
  return new Promise(((resolve) => {
    $item.scrollbar({
      onInit() {
        resolve();
      }
    });
  }));
}

function getScrollableItems() {
  return $('.js-scrollable-item').filter((i, item) => {
    const $scrollableCur = $(item);

    /**
     * строчка $(item).find('> .js-scrollable-item').length === 0
     * нужна для того, чтобы в выборку не попали элементы,
     * которые генерирует сам плагин для своей работы.
     * иначе он пытается и к ним применить себя, в итоге
     * это приводит к непредсказуемому результату
     */

    return $scrollableCur.hasClass('template') === false
      && $scrollableCur.closest('.template').length === 0
      && $(item).find('> .js-scrollable-item').length === 0;
  });
}

export async function scrollbarInitAll() {
  const promisesArr = [];

  getScrollableItems().each((i, item) => {
    const $scrollableItemCur = $(item);

    $scrollableItemCur.addClass('scrollbar-macosx');

    promisesArr.push(scrollbarInit($scrollableItemCur));
  });

  await Promise.all(promisesArr);
}

export function scrollbarDestroy() {
  getScrollableItems()
    .removeClass('scrollbar-macosx')
    .scrollbar('destroy');
}

export function showHideScrollbarTouchEventsFix() {
  let timer;

  getScrollableItems().on('touchstart touchmove', function () {
    if (timer) clearTimeout(timer);

    $('.touchend').removeClass('touchend');
    $(this).addClass('touching');
  });

  getScrollableItems().on('touchend', function () {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      $('.touching').removeClass('touching');
      $(this).addClass('touchend');
    }, 300);
  });
}
