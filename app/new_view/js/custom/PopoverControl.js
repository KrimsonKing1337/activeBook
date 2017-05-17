/**
 * управляем отображением поповеров
 */
export default class PopoverControl {
    constructor () {

    }

    /**
     *
     * @param $popoversParents[] {object}
     */
    static init ($popoversParents) {
        $popoversParents.each(function (index, popoverParent) {
            $(popoverParent).find('.obj-img__wrapper').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                let $triggerButton = $(this);
                let $popover = $(popoverParent).find('.add-settings');

                /**
                 * скрываем все поповеры,
                 * кроме актуальной
                 */
                PopoverControl._closeAllOtherPopovers($('.add-settings.active'), $popover);

                /**
                 * деактивируем все триггер-кнопки,
                 * кроме той, по которой щас кликнули
                 */
                PopoverControl._closeAllOtherTriggerButtons($('.obj-img__wrapper.active'), $triggerButton);

                $popover.toggleClass('active');
                $triggerButton.toggleClass('active');

                /**
                 * позиционируем поповер
                 */
                PopoverControl._positioning($triggerButton, $popover);

                /**
                 * навешиваем дополнительные события
                 * (для скрытия попапа и т.д.)
                 */
                PopoverControl._additionalEvents($triggerButton, $popover);
            });
        });
    }

    /**
     *
     * @param $popovers[] {object}
     * @param $popoverActual {object}
     * @private
     */
    static _closeAllOtherPopovers ($popovers, $popoverActual) {
        $popovers.each(function () {
            if ($(this)[0] !== $popoverActual[0]) $(this).removeClass('active');
        });
    }

    /**
     *
     * @param $triggerButtons[] {object}
     * @param $triggerButtonActual {object}
     * @private
     */
    static _closeAllOtherTriggerButtons ($triggerButtons, $triggerButtonActual) {
        $triggerButtons.each(function () {
            if ($(this)[0] !== $triggerButtonActual[0]) $(this).removeClass('active');
        });
    }

    /**
     *
     * @param $triggerButton {object}
     * @param $popover {object}
     * @private
     */
    static _additionalEvents ($triggerButton, $popover) {
        /**
         * убираем всплытие события клик у поповера,
         * чтобы он не закрывался при нём
         */
        setTimeout(function () {
            $popover.on('click', function (e) {
                e.stopPropagation();
            });
        }, 0);

        /**
         * клик в любом месте документа,
         * кроме самого этого элемента
         * скроет поповер
         */
        setTimeout(function () {
            $(document).one('click', function () {
                $popover.removeClass('active');
                $popover.off('click');
                $triggerButton.removeClass('active');
            });
        }, 0);
    }

    /**
     *
     * @param $triggerButton {object}
     * @param $popover {object}
     * @private
     */
    static _positioning ($triggerButton, $popover) {
        /**
         * сбрасываем все изменения,
         * чтобы позиционирование сработало нормально.
         * скрываем элемент на время позиционирования.
         *
         */
        PopoverControl._positioningBefore($popover);

        /**
         *
         * получаем координаты всех нужных объектов
         */
        let coords = PopoverControl._getCoords($triggerButton, $popover);

        /**
         *
         * transform работает гораздо быстрее всяких margin,
         * потому что браузер не перерисовывает DOM-дерево
         */

        let top = Math.abs(parseInt(coords.$popoverBottom.bottom - coords.$popover.top));

        $popover.css({'transform' : 'translateY(-' + top + 'px)'});

        /**
         * если правая точка поповера заходит
         * на край блока с текстом, двигаем его назад + небольшой отступ.
         * аналогично с левой точкой
         */
        if (coords.$popover.right >= coords.$text.right) {
            let right = Math.abs(parseInt(coords.$popover.right - coords.$text.right + 10 /*padding-right*/));

            $popover.css({'transform' : 'translate(-' + right + 'px, ' + '-' + top + 'px)'});
        } else if (coords.$popover.left <= coords.$text.left) {
            let left = Math.abs(parseInt(coords.$popover.left - coords.$text.left + 10 /*padding-left*/));

            $popover.css({'transform' : 'translate(' + left + 'px, ' + '-' + top + 'px)'});
        }

        /**
         *
         * после того как поповер был сдвинут,
         * координаты его нижней части были измененеы,
         * их нужно актуализировать, ещё раз получив их
         */
        coords.$popoverBottom = $popover.find('.add-settings__bottom')[0].getBoundingClientRect();

        /**
         * зеркалим нижнюю часть поповера,
         * если триггер-кнопка правее его
         */
        let $addSettingsBottom = $popover.find('.add-settings__bottom');

        if ((coords.$popoverBottom.left - parseInt($addSettingsBottom.css('left'))) < coords.$triggerButton.left) {
            $addSettingsBottom.addClass('revert');
        }

        /**
         * когда позиционирование было завершено,
         * проявляем элемент
         */
        PopoverControl._positioningAfter($popover);
    }

    /**
     *
     * @param $popover {object}
     * @private
     */
    static _positioningBefore ($popover) {
        $popover.css({
            'transform' : 'translate(0, 0)',
            'opacity' : '0'
        });

        let $addSettingsBottom = $popover.find('.add-settings__bottom');
        $addSettingsBottom.removeClass('revert');
    }

    /**
     *
     * @param $triggerButton {object}
     * @param $popover {object}
     * @private
     */
    static _getCoords ($triggerButton, $popover) {
        return {
            $popover: $popover[0].getBoundingClientRect(),
            $triggerButton: $triggerButton[0].getBoundingClientRect(),
            $text: $text[0].getBoundingClientRect(),
            $popoverBottom: $popover.find('.add-settings__bottom')[0].getBoundingClientRect()
        };
    }

    /**
     *
     * @param $popover {object}
     * @private
     */
    static _positioningAfter ($popover) {
        $popover.css({
            'opacity' : ''
        });
    }
}