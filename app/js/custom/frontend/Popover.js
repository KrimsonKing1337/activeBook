/**
 * управляем отображением поповеров
 */
import ConstsDom from './ConstsDOM';

/**
 * инициализатор для поповера
 */
export default class Popover {
    /**
     *
     * @param selectors {object} jquery;
     * @param selectors.$popover {object} jquery;
     * @param selectors.$triggerButton {object} jquery;
     */
    constructor (selectors) {
        this.constDomPopover = ConstsDom.getPopover();
        this.$popover = $(selectors.$popover);
        this.$triggerButton = $(selectors.$triggerButton);
        this.init();
    }

    /**
     *
     */
    init () {
        let self = this;
        let $triggerButton = self.$triggerButton;
        let $popover = self.$popover;

        $triggerButton.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            /**
             * скрываем все поповеры,
             * кроме актуальной
             */
            Popover._closeAllOtherPopovers({
                $popovers: $(self.constDomPopover.popover + '.active'),
                $popoverActual: $popover
            });

            /**
             * деактивируем все триггер-кнопки,
             * кроме той, по которой щас кликнули
             */
            Popover._closeAllOtherTriggerButtons({
                $triggerButtons: $(self.constDomPopover.triggerButton + '.active'),
                $triggerButtonActual: $triggerButton
            });

            $popover.toggleClass('active');
            $triggerButton.toggleClass('active');

            /**
             * позиционируем поповер
             */
            self._positioning();

            /**
             * навешиваем дополнительные события
             * (для скрытия попапа и т.д.)
             */
            self._additionalEvents();
        });
    }

    /**
     *
     * @param selectors {object}
     * @param selectors.$popovers {object} jquery
     * @param selectors.$popoverActual {object} jquery
     * @private
     */
    static _closeAllOtherPopovers (selectors) {
        let $popovers = selectors.$popovers;
        let $popoverActual = selectors.$popoverActual;

        $popovers.each(function () {
            if ($(this)[0] !== $popoverActual[0]) $(this).removeClass('active');
        });
    }

    /**
     *
     * @param selectors {object}
     * @param selectors.$triggerButtons {object} jquery
     * @param selectors.$triggerButtonActual {object} jquery
     * @private
     */
    static _closeAllOtherTriggerButtons (selectors) {
        let $triggerButtons = selectors.$triggerButtons;
        let $triggerButtonActual = selectors.$triggerButtonActual;

        $triggerButtons.each(function () {
            if ($(this)[0] !== $triggerButtonActual[0]) $(this).removeClass('active');
        });
    }

    /**
     * @private
     */
    _additionalEvents () {
        let self = this;
        let $popover = self.$popover;
        let $triggerButton = self.$triggerButton;

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
                Popover.close({
                    $popover: $popover,
                    $triggerButton: $triggerButton
                });
            });
        }, 0);
    }

    /**
     * @param selectors {object}
     * @param selectors.$triggerButton {object} jquery
     * @param selectors.$popover {object} jquery
     */
    static close (selectors) {
        let $popover = selectors.$popover;
        let $triggerButton = selectors.$triggerButton;

        $popover.removeClass('active');
        $popover.off('click');
        $triggerButton.removeClass('active');
    }

    /**
     * @private
     */
     _positioning () {
        let self = this;
        let $popover = self.$popover;

        /**
         * сбрасываем все изменения,
         * чтобы позиционирование сработало нормально.
         * скрываем элемент на время позиционирования.
         *
         */
        self._positioningBefore();

        /**
         *
         * получаем координаты всех нужных объектов
         */
        let coords = self._getCoords();

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
        if (coords.$popover.right >= coords.$menu.right) {
            let right = Math.abs(parseInt(coords.$popover.right - coords.$menu.right + 10 /*padding-right*/));

            $popover.css({'transform' : 'translate(-' + right + 'px, ' + '-' + top + 'px)'});
        } else if (coords.$popover.left <= coords.$menu.left) {
            let left = Math.abs(parseInt(coords.$popover.left - coords.$menu.left + 10 /*padding-left*/));

            $popover.css({'transform' : 'translate(' + left + 'px, ' + '-' + top + 'px)'});
        }

        /**
         *
         * после того как поповер был сдвинут,
         * координаты его нижней части были измененеы,
         * их нужно актуализировать, ещё раз получив их
         */

        let $popoverBottom = $popover.find(self.constDomPopover.popoverBottom);

        coords.$popoverBottom = $popoverBottom[0].getBoundingClientRect();

        /**
         * зеркалим нижнюю часть поповера,
         * если триггер-кнопка правее его
         */

        if ((coords.$popoverBottom.left - parseInt($popoverBottom.css('left'))) < coords.$triggerButton.left) {
            $popoverBottom.addClass('revert');
        }

        /**
         * когда позиционирование было завершено,
         * проявляем элемент
         */
        self._positioningAfter();
    }

    /**
     *
     * @private
     */
    _positioningBefore () {
        let self = this;
        let $popover = self.$popover;

        $popover.css({
            'transform' : 'translate(0, 0)',
            'opacity' : '0'
        });

        let $popoverBottom = $popover.find(self.constDomPopover.popoverBottom);
        $popoverBottom.removeClass('revert');
    }

    /**
     * @private
     */
    _getCoords () {
        let self = this;
        let $popover = self.$popover;
        let $triggerButton = self.$triggerButton;

        return {
            $popover: $popover[0].getBoundingClientRect(),
            $triggerButton: $triggerButton[0].getBoundingClientRect(),
            $menu: $(self.constDomPopover.menu)[0].getBoundingClientRect(),
            $popoverBottom: $popover.find(self.constDomPopover.popoverBottom)[0].getBoundingClientRect()
        };
    }

    /**
     *
     * @private
     */
    _positioningAfter () {
        this.$popover.css({
            'opacity' : ''
        });
    }
}