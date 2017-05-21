/**
 * Created by k on 07.05.17.
 */

let fs = require('fs');

/**
 * собираем из html-шаблонов страницы книги, записываем в новые html-файлы;
 * использование - вызываем функцию init и передаём ей пути к шаблонам
 */
module.exports = class GeneratorBookPages {
    constructor () {

    }

    /**
     *
     * @param templatesPaths{{}} {string}
     *
     * поскольку здесь все методы статичные,
     * то не имеет смысла иметь конструктор,
     * т.к. все экземпляры класса будут ссылаться на одно и то же место
     */
    static init (templatesPaths) {
        GeneratorBookPages._prepareToGenerateHtml(templatesPaths);
    }

    /**
     *
     * @param templatesPaths {object} - string;
     * @private
     *
     * подготавливаем данные для формирования новых страниц книги
     */
    static _prepareToGenerateHtml (templatesPaths) {
        /**
         * получаем список новых страниц книги (partial pages)
         */
        let newPagesList = GeneratorBookPages._getNewPagesList(templatesPaths.pagesPartialFolder);

        /**
         * получаем шаблоны
         */
        let templates = GeneratorBookPages._getTemplates(templatesPaths);

        /**
         * читаем каждую новую страницу книги,
         * получаем её параметры и вызываем генератор html-файлов
         */
        newPagesList.forEach(function (value) {
            fs.readFile(templatesPaths.pagesPartialFolder + value, function (err, data) {
                if (err) throw err;

                let pageContent = data.toString();

                let pageParams = {} = GeneratorBookPages._getParamsPage(pageContent);
                pageParams.newFileName = value;
                pageParams.pagesLength = newPagesList.length;
                pageParams.generatedFolder = templatesPaths.generatedFolder;

                GeneratorBookPages._generateHtml({
                    templates: templates,
                    pageContent: pageContent,
                    pageParams: pageParams
                });
            });
        });
    }

    /**
     *
     * @param params {object}
     * @param params.templates{} {string}
     * @param params.pageContent {string}
     * @param params.pageParams{} {string}
     *
     */
    static _generateHtml (params = {}) {
        let templates = params.templates;
        let pageContent = params.pageContent;
        let pageParams = params.pageParams;

        //вставляем partial-страницу книги в шаблон rootWrapper
        let htmlPage = templates.rootWrapper.replace('{%passed-text-and-effects}', pageContent);

        //заменяем остальные ключевые слова на значения
        if (pageParams.pageNumber) {
            htmlPage = htmlPage.replace(/{%pageNumber}/g, pageParams.pageNumber);
        }

        if (pageParams.pagesLength) {
            htmlPage = htmlPage.replace(/{%pagesLength}/g, pageParams.pagesLength);
        }

        //удаляем параметры страницы книги из будущего html-файла
        let $pageParams = htmlPage.substring(htmlPage.indexOf('<params>'), htmlPage.indexOf('</params>'));

        htmlPage = htmlPage.replace($pageParams, '').replace('<params>', '').replace('</params>', '');

        //font-size-100 и data-font-size - это дефолтное значение для размеров шрифта, оно может меняться
        //поэтому задаём это здесь, а не на partial-вьюхах страниц
        htmlPage = htmlPage.replace('<div class="text">', '<div class="text js-scrollable-item font-size-100" data-font-size="100">');

        fs.writeFile(pageParams.generatedFolder + pageParams.newFileName, htmlPage, function (err) {
            if (err) throw err;
        });
    };

    /**
     *
     * @param filePath {string};
     * @private
     *
     * получаем содержимое файла, синхронно
     */
    static _getFileContent (filePath) {
        return fs.readFileSync(filePath).toString();
    }

    /**
     *
     * @param templatesPaths {object} - string
     * @returns {{}}
     * @private
     *
     * формируем список из шаблонов, получаем контент файлов-шаблонов, записываем его в переменные.
     * поскольку некоторые шаблоны состоят из других, то производим операцию чтения файла синхронно
     */
    static _getTemplates (templatesPaths) {
        let templates = {};
        templates.textAndEffects = GeneratorBookPages._getFileContent(templatesPaths.textAndEffectsFile);
        templates.tableOfContents = GeneratorBookPages._getFileContent(templatesPaths.tableOfContentsFile);
        templates.menu = GeneratorBookPages._getFileContent(templatesPaths.menuFile);
        templates.page = GeneratorBookPages._getFileContent(templatesPaths.pageFile)
            .replace('{%menu}', templates.menu)
            .replace('{%text-and-effects}', templates.textAndEffects)
            .replace('{%table-of-contents}', templates.tableOfContents);
        templates.rootWrapper = GeneratorBookPages._getFileContent(templatesPaths.rootWrapperFile)
            .replace('{%page}', templates.page);

        return templates;
    }

    /**
     *
     * @param page {string};
     * @returns {{}}
     * @private
     *
     * получаем параметры страницы, работая с подстрокой
     */
    static _getParamsPage (page) {
        let pageParams = {};

        const paramsNames = {
            pageNumber: 'pageNumber',
        };

        let $pageParams = page.substring(page.indexOf('<params>'), page.indexOf('</params>'))
            .replace('<params>', '');

        pageParams.pageNumber =
            ($pageParams.substring($pageParams.indexOf(paramsNames.pageNumber), $pageParams.indexOf(';'))
                .replace(paramsNames.pageNumber, '').replace('=', ''))
                .trim();

        return pageParams;
    }

    /**
     * получаем список файлов в папке;
     * readdir возвращает массив из имён файлов
     */
    static _getNewPagesList (newPagesFolder) {
        return fs.readdirSync(newPagesFolder);
    }
};