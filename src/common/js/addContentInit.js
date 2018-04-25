import getDOMSelectors from './modules/GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export function addContentInit() {
    $(DOMSelectors.addContentClose).on('click', () => {
        $(DOMSelectors.addContent).fadeOut();
    });

    $(DOMSelectors.addContentFullSize).on('click', () => {
        const children = $(DOMSelectors.addContentInner).children();

        let src;
        const video = children.filter('video');
        const img = children.filter('img');

        if (img.length > 0) {
            src = img.attr('src');
        }

        //todo: video

        $(DOMSelectors.addContentClose).trigger('click');

        window.open(`${window.location.origin}/${src}`, '_blank');
    });
}