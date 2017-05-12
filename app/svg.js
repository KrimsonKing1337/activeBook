/**
 * Created by K on 29.04.2017.
 */
let fs = require('fs');

let jsdom = require('jsdom');
const {JSDOM} = jsdom;
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
     * заменить все svg-изображения на svg-объекты,
     * у которых есть класс fill (заливка)
     */
    $('img[src$=".svg"].fill').each(function () {
        replaceSvg($(this));
    });

    let newContent = doctype + $('html').prop('outerHTML');

    fs.writeFile(root + 'test_' + file, newContent, function (err) {
        if (err) throw err;
    });
});


let usedId = [];

/**
 *
 * @returns {string}
 *
 * Получаем уникальный id.
 * Если в массиве usedId такой уже есть,
 * то производим операцию заново.
 * Если нет, записываем значение в массив usedId
 * и возвращаем это значение
 */
const getUniqId = () => {
    let uniqId = Math.random().toString(36).substring(7);

    usedId.some(function (item) {
        if (item === uniqId) getUniqId();
    });

    usedId.push(uniqId);

    return Math.random().toString(36).substring(7);
};

/**
 *
 * @param image {object} - jquery
 *
 * Вставить svg-объекты вместо svg-изображений
 */
const replaceSvg = (image) => {
    let imgURL = image.attr('src');
    let svgContent = fs.readFileSync(root + imgURL).toString();
    let svgContentParse = $($.parseHTML(svgContent));
    let oldUniqId;

    /**
     * пробегаемся по каждому тэгу use
     * внутри svg.
     * ищем соответствующий <use> тэг <path>,
     * аттрибут первого xlink:href и id у второго совпадают.
     * если нет <path> с таким id, значит несколько <use> ссылаются
     * на один и тот же <path>.
     * в этом случае записываем старый уникальный id и выходим из функции.
     * тогда у нас будет уникальный id и все <use> будут ссылаться
     * на один и тот же <path>
     */
    svgContentParse.find('use').each(function () {
        let use = $(this);
        let id = use.attr('xlink:href');
        let path = svgContentParse.find(id);

        /**
         * todo: кажется, что есть более очевидное решение
         */
        if (path.length === 0) {
            use.attr('xlink:href', '#' + oldUniqId);
            path.attr('id', oldUniqId);
            return;
        }

        let uniqId = getUniqId();

        use.attr('xlink:href', '#' + uniqId);
        path.attr('id', uniqId);
        oldUniqId = uniqId;
    });

    let svgToReplace = svgTemplate.replace('{%svg}', svgContentParse.prop('outerHTML'));

    image.replaceWith(svgToReplace);
};