export function changePageByKeyboardInit() {
    /**
     * стрелка вперёд / свайп влево = след. страница,
     * стрелка назад / свайп вправо = пред. страница
     */
    $(document).on('keydown', (e) => {
        if (e.which === 37) {
            $('.js-page-prev').trigger('click');
        } else if (e.which === 39) {
            $('.js-page-next').trigger('click');
        } else if (e.which === 38 || e.which === 40) {

        }
    });
}