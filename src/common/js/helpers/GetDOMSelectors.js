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
        textWrapper: '.text-wrapper',
        tableOfContents: '.table-of-contents',
        tableOfContentsInner: '.table-of-contents__inner',
        credits: '.credits',
        creditsInner: '.credits__inner',
        menu: '.menu',
        modalContent: '.modal-content',
        mainContent: '.main-content',
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
        menuFullScreen: '.menu-full-screen',
        menuFullScreenInner: '.menu-full-screen__inner',
        tableOfContentsShow: '.js-table-of-contents-show',
        vibrationOption: '.js-vibration-option',
        flashLightOption: '.js-flashlight-option',
        invertToggle: '.js-invert-toggle',
        invertOption: '.js-invert-option',
        themeOption: '.js-theme-option',
        lineHeightMinus: '.js-line-height-minus',
        lineHeightPlus: '.js-line-height-plus',
        lineHeightVal: '.js-line-height-val',
        volumeOneShots: '.js-volume-one-shots',
        volumeLoops: '.js-volume-loops',
        modalContentClose: '.js-modal-content-close',
        modalContentFullSize: '.js-modal-content-full-size',
        modalContentInner: '.js-modal-content-inner'
    }
}