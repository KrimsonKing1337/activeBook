/**
 * Created by K on 29.04.2017.
 */
let fs = require('fs');
let Files = require('./Files');

let jsdom = require('jsdom');
const {JSDOM} = jsdom;
let $ = null;

let SvgImgToObj = require('./SvgImgToObj');

let root = 'new_view/';
let file = 'index.html';
let files = Files.ls(root);

const doctype = '<!DOCTYPE html>';

files.forEach(function (file) {
    fs.readFile(root + file, function (err, data) {
        if (err) throw err;

        let content = data.toString();

        let window = new JSDOM(content);

        $ = require('jquery')(window.window);

        let svgImgToObj = new SvgImgToObj($, root);

        /**
         * заменить все svg-изображения на svg-объекты,
         * у которых есть класс fill (заливка)
         */
        svgImgToObj.replaceAll('img[src$=".svg"].fill');

        let newContent = doctype + $('html').prop('outerHTML');

        fs.writeFile(root + 'test_' + file, newContent, function (err) {
            if (err) throw err;
        });
    });
});