/**
 * управляем отображением поповеров
 */
import GetDOMSelectors from './GetDOMSelectors';
import '../animateCss';

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
    constructor(selectors) {
        const DOMSelectors = GetDOMSelectors();

        this.popoverSelectors = {
            popover: DOMSelectors.addSettings,
            popoverBottom: DOMSelectors.addSettingsBottom,
            menu: DOMSelectors.menu,
            triggerButton: DOMSelectors.svgWrapper
        };
        this.$popover = $(selectors.$popover);
        this.$triggerButton = $(selectors.$triggerButton);
        this.init();
    }

    /**
     *
     */
    init() {
        const $triggerButton = this.$triggerButton;
        const $popover = this.$popover;

        $triggerButton.on('click touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();

            /**
             * скрываем все поповеры,
             * кроме актуальной
             */
            Popover.closeAllOtherPopovers({
                $popovers: $(`${this.popoverSelectors.popover}.active`),
                $popoverActual: $popover
            });

            /**
             * деактивируем все триггер-кнопки,
             * кроме той, по которой щас кликнули
             */
            Popover.closeAllOtherTriggerButtons({
                $triggerButtons: $(`${this.popoverSelectors.triggerButton}.active`),
                $triggerButtonActual: $triggerButton
            });

            if ($popover.hasClass('active')) {
                $popover.removeClass('active');

                $triggerButton.removeClass('active');
            } else {
                $popover.addClass('active');
                $triggerButton.addClass('active');

                /**
                 * позиционируем поповер
                 */
                this.positioning();
            }

            /**
             * навешиваем дополнительные события
             * (для скрытия попапа и т.д.)
             */
            this.additionalEvents();
        });
    }

    /**
     * @private
     * @param selectors {object}
     * @param selectors.$popovers {object} jquery
     * @param selectors.$popoverActual {object} jquery
     */
    static closeAllOtherPopovers(selectors) {
        const $popovers = selectors.$popovers;
        const $popoverActual = selectors.$popoverActual;

        $popovers.each((popoverCur) => {
            const $popoverCur = $(popoverCur);

            if ($popoverCur[0] !== $popoverActual[0]) {
                $popoverCur.animateCss('fadeOut', () => {
                    $popoverCur.removeClass('active');
                });
            }
        });
    }

    /**
     *
     * @param selectors {object}
     * @param selectors.$triggerButtons {object} jquery
     * @param selectors.$triggerButtonActual {object} jquery
     * @private
     */
    static closeAllOtherTriggerButtons(selectors) {
        const $triggerButtons = selectors.$triggerButtons;
        const $triggerButtonActual = selectors.$triggerButtonActual;

        $triggerButtons.each((triggerButtonCur) => {
            const $triggerButtonCur = $(triggerButtonCur);

            if ($triggerButtonCur[0] !== $triggerButtonActual[0]) {
                $triggerButtonCur.removeClass('active');
            }
        });
    }

    /**
     * @private
     */
    additionalEvents() {
        const $popover = this.$popover;
        const $triggerButton = this.$triggerButton;

        /**
         * убираем всплытие события клик у поповера,
         * чтобы он не закрывался при нём
         */
        setTimeout(() => {
            $popover.on('click touchstart', (e) => {
                e.stopPropagation();
            });
        }, 0);

        /**
         * клик в любом месте документа,
         * кроме самого этого элемента
         * скроет поповер
         */
        setTimeout(() => {
            $(document).one('click touchstart', () => {
                Popover.close({
                    $popover,
                    $triggerButton
                });
            });
        }, 0);
    }

    /**
     * @param selectors {object}
     * @param selectors.$triggerButton {object} jquery
     * @param selectors.$popover {object} jquery
     */
    static close(selectors) {
        const $popover = selectors.$popover;
        const $triggerButton = selectors.$triggerButton;

        $popover.removeClass('active');
        $popover.off('click touchstart');
        $triggerButton.removeClass('active');
    }

    positioning() {
        const $popover = this.$popover;

        /**
         * сбрасываем все изменения,
         * чтобы позиционирование сработало нормально.
         * скрываем элемент на время позиционирования.
         *
         */
        this.positioningBefore();

        /**
         *
         * получаем координаты всех нужных объектов
         */
        const coords = this.getCoords();

        /**
         *
         * transform работает гораздо быстрее всяких margin,
         * потому что браузер не перерисовывает DOM-дерево
         */

        const top = Math.abs(parseInt(coords.$popoverBottom.bottom - coords.$popover.top));

        $popover.css({'transform': `translateY(-${ top }px)`});

        /**
         * если правая точка поповера заходит
         * на край блока с текстом, двигаем его назад + небольшой отступ.
         * аналогично с левой точкой
         */
        if (coords.$popover.right >= coords.$menu.right) {
            const right = Math.abs(parseInt(coords.$popover.right - coords.$menu.right + 10 /*padding-right*/));

            $popover.css({'transform': `translate(-${ right }px, ` + `-${ top }px)`});
        } else if (coords.$popover.left <= coords.$menu.left) {
            const left = Math.abs(parseInt(coords.$popover.left - coords.$menu.left + 10 /*padding-left*/));

            $popover.css({'transform': `translate(${ left }px, ` + `-${ top }px)`});
        }

        /**
         *
         * после того как поповер был сдвинут,
         * координаты его нижней части были измененеы,
         * их нужно актуализировать, ещё раз получив их
         */

        const $popoverBottom = $popover.find(this.popoverSelectors.popoverBottom);

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
        this.positioningAfter();
    }

    /**
     *
     * @private
     */
    positioningBefore() {
        const $popover = this.$popover;

        $popover.css({
            'transform': 'translate(0, 0)'
        });

        const $popoverBottom = $popover.find(this.popoverSelectors.popoverBottom);
        $popoverBottom.removeClass('revert');
    }

    /**
     * @private
     */
    getCoords() {
        const $popover = this.$popover;
        const $triggerButton = this.$triggerButton;

        return {
            $popover: $popover[0].getBoundingClientRect(),
            $triggerButton: $triggerButton[0].getBoundingClientRect(),
            $menu: $(this.popoverSelectors.menu)[0].getBoundingClientRect(),
            $popoverBottom: $popover.find(this.popoverSelectors.popoverBottom)[0].getBoundingClientRect()
        };
    }

    /**
     *
     * @private
     */
    positioningAfter() {
        this.$popover.css({
            'opacity': ''
        });
    }
}