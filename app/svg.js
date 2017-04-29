/**
 * Created by K on 29.04.2017.
 */
let fs = require('fs');

let jsdom = require('jsdom');
const { JSDOM } = jsdom;
let $ = null;

let root = 'new_view/';
let file = 'index.html';

fs.readFile(root + file, function (err, data) {
    if (err) throw err;

    let content = data.toString();

    let window = new JSDOM(content);

    $ = require('jquery')(window.window);

    /**
     * заменить все svg-изображения на svg-объекты
     */

    let images = {};
    let counter = 0;

    $('img[src$=".svg"]').each(function() {
        let imgURL = $(this).attr('src');

        counter++;

        fs.readFile(root + imgURL, function (err, data) {
            if (err) throw err;

            images[imgURL] = data.toString();

            counter--;

            if (counter === 0) {
                replaceSvg(images);

                let newContent = $(window.window).html();

                fs.writeFile(root + 'test_' + file, newContent, function (err) {
                    if (err) throw err;
                });
            }
        });
    });
});

/**
 *
 * @param images[] {string}
 *
 * Вставить svg-объекты вместо svg-изображений
 */
const replaceSvg = (images) => {
   $('img[src$=".svg"]').each(function() {
        let imgURL = $(this).attr('src');

        $(this).replaceWith(images[imgURL]);
    });
};