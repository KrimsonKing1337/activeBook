import LocalStorage from './modules/LocalStorage';

export function bookmarksSaveState() {
    const bookmarks = [];

    $('.js-bookmark-item:not(.template)').each((i, item) => {
        const $bookmark = $(item);
        const date = $bookmark.find('.js-bookmark-date').text().trim();
        const page = $bookmark.find('.js-bookmark-page').text().trim();

        bookmarks.push({
            date,
            page
        });
    });

    LocalStorage.write({
        key: 'bookmarks',
        val: bookmarks
    });
}