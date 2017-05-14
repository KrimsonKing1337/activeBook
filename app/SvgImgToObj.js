/**
 * Created by K on 14.05.2017.
 */
let fs = require('fs');

module.exports = class SvgImgToObj {
    constructor (jquery, root) {
        this.$ = jquery;
        this.usedIds = [];
        this.root = root;
    }

    /**
     *
     * @param image {object} - jquery;
     *
     * Вставить svg-объект вместо svg-изображения
     */
    replace (image) {
        let $ = this.$;
        let usedIds = this.usedIds;
        let root = this.root;
        let svgTemplate = fs.readFileSync('templates/svg.html').toString();

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

            let uniqId = SvgImgToObj._getUniqId(usedIds);

            use.attr('xlink:href', '#' + uniqId);
            path.attr('id', uniqId);
            oldUniqId = uniqId;
        });

        let svgForReplace = svgTemplate.replace('{%svg}', svgContentParse.prop('outerHTML'));

        image.replaceWith(svgForReplace);
    }

    /**
     *
     * @param selector {string};
     *
     * Заменить все svg-изображения на svg-объекты
     */
    replaceAll (selector) {
        let $ = this.$;
        let self = this;

        $(selector).each(function () {
            self.replace($(this));
        });
    }

    /**
     *
     * @private
     * @param usedIds[] {string}
     *
     * Получаем уникальный id.
     * Если в массиве usedId такой уже есть,
     * то производим операцию заново.
     * Если нет, записываем значение в массив usedId
     * и возвращаем это значение
     */
    static _getUniqId (usedIds) {
        let uniqId = Math.random().toString(36).substring(7);

        usedIds.some(function (item) {
            if (item === uniqId) SvgImgToObj._getUniqId(usedIds);
        });

        usedIds.push(uniqId);

        return uniqId;
    }
};