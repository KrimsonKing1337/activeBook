/**
 * Created by K on 29.04.2017.
 */
let fs = require('fs');

let jsdom = require('jsdom');
const { JSDOM } = jsdom;
let $ = null;

let root = 'new_view/';
let file = 'index.html';
let svgTemplate = fs.readFileSync('templates/svg.html').toString();
const doctype = '<!DOCTYPE html>';

fs.readFile(root + file, function (err, data) {
    if (err) throw err;

    let content = data.toString();

    let window = new JSDOM(content);

    $ = require('jquery')(window.window);

    /**
     * заменить все svg-изображения на svg-объекты
     */
    $('img[src$=".svg"]').each(function() {
        replaceSvg($(this));
    });

    let newContent = doctype + $('html').prop('outerHTML');

    fs.writeFile(root + 'test_' + file, newContent, function (err) {
        if (err) throw err;
    });
});

/**
 *
 * @param image {object} - jquery
 *
 * Вставить svg-объекты вместо svg-изображений
 */
const replaceSvg = (image) => {
    let imgURL = image.attr('src');
    let objSvg = svgTemplate.replace('{%src}', imgURL);

    image.replaceWith(objSvg);
};