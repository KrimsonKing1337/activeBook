/**
 * геттеры для селекторов
 * на странице
 */

export default class ConstsDOM {
    constructor () {

    }

    /**
     *
     * @returns {{string}}
     *
     * основные селекторы DOM-элементов страницы
     */
    static get () {
        return {
            text: '.text',
            tableOfContents: '.table-of-contents',
            menu: '.menu',
            leftSide: '.left-side',
            rightSide: '.right-side',
            action: '.action',
            objImgWrapper: '.obj-img__wrapper',
            page: '.page'
        }
    }

    /**
     *
     * @returns {{string}}
     *
     * js-хуки для элементов меню
     */
    static getMenu () {
        return {
            bookmark: '.js-bookmark',
            pagePrev: '.js-page-prev',
            pageNext: '.js-page-next',
            pageNumber: '.js-page-number',
            volumeGlobal: '.js-volume-global',
            fontSizeDown: '.js-font-size-down',
            fontSizeUp: '.js-font-size-up',
            svgWrapper: '.obj-img__wrapper'
        }
    }

    /**
     *
     * @returns {{jquery}}
     *
     * js-хуки для элементов поповера
     */
    static getPopover () {
        return {
            popover: '.add-settings',
            popoverBottom: '.add-settings__bottom',
            triggerButton: '.obj-img__wrapper',
            menu: '.menu',
            tableOfContentsShow: '.js-table-of-contents-show',
            vibrationToggle: '.js-vibration-toggle',
            vibrationOption: '.js-vibration-option',
            themeOption: '.js-theme-option',
            lineHeightMinus: '.js-line-height-minus',
            lineHeightPlus: '.js-line-height-plus',
            lineHeightVal: '.js-line-height-val',
            volumeHints: '.js-volume-hints',
            volumeBg: '.js-volume-bg'
        }
    }
}