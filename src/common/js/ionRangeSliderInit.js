import 'ion-rangeslider';

export function ionRangeSliderInit() {
    //ionRangeSlider
    $('.js-range-slider').ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        step: 1,
        hide_min_max: true,
        hide_from_to: true
    });
}