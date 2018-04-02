/**
 * геттеры для селекторов
 * на странице
 */

export default function getDOMSelectors() {

    /**
     *
     * @returns {{string}}
     *
     * селекторы DOM-элементов страницы
     */
    return {
        text: '.text',
        tableOfContents: '.table-of-contents',
        menu: '.menu',
        leftSide: '.left-side',
        rightSide: '.right-side',
        action: '.action',
        page: '.page',
        bookmark: '.js-bookmark',
        pagePrev: '.js-page-prev',
        pageNext: '.js-page-next',
        pageNumber: '.js-page-number',
        volume: '.js-volume',
        volumeGlobal: '.js-volume-global',
        fontSizeDown: '.js-font-size-down',
        fontSizeUp: '.js-font-size-up',
        etc: '.js-etc',
        svgWrapper: '.obj-img__wrapper',
        addSettings: '.add-settings',
        addSettingsBottom: '.add-settings__bottom',
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