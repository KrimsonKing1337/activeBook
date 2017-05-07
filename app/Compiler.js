/**
 * Created by k on 07.05.17.
 */

let fs = require('fs');

/**
 * собираем из html-шаблонов страницы книги, записываем в новые html-файлы
 */
module.exports = class Compiler {
    constructor(templatesPaths) {
        Compiler._prepareToGenerateHtml(templatesPaths);
    }

    static _prepareToGenerateHtml(templatesPaths) {
        let newPagesList = Compiler._getNewPagesList(templatesPaths.newPagesFolder);
        let templates = Compiler._getTemplates(templatesPaths);

        //читаем каждую новую страницу и записываем их содержимое в переменную
        newPagesList.map(function (value) {
            fs.readFile(templatesPaths.newPagesFolder + value, function (err, data) {
                if (err) throw err;

                let pageContent = data.toString();

                let pageParams = {} = Compiler._getParamsPage(pageContent);
                pageParams.newFileName = value;
                pageParams.pagesLength = newPagesList.length;
                pageParams.generatedFolder = templatesPaths.generatedFolder;

                Compiler._generateHtml({
                    templates: templates,
                    pageContent: pageContent,
                    pageParams: pageParams
                });
            });
        });
    }

    static _getTemplates(templatesPaths) {
        let templates = {};
        templates.textAndEffects = Compiler._getFileContent(templatesPaths.textAndEffectsFile);
        templates.headerMenu = Compiler._getFileContent(templatesPaths.headerMenuFile);
        templates.page = Compiler._getFileContent(templatesPaths.pageFile)
            .replace('{%header-menu}', templates.headerMenu)
            .replace('{%text-and-effects}', templates.textAndEffects);
        templates.rootWrapper = Compiler._getFileContent(templatesPaths.rootWrapperFile)
            .replace('{%page}', templates.page);

        return templates;
    }

    /**
     *
     * @param params {object}
     * @param params.templates{} {string}
     * @param params.pageContent {string}
     * @param params.pageParams{} {string}
     *
     * передаём шаблоны и переданные данные для новой страницы.
     * пока все шаблоны не будут считаны, дальше дело не пойдёт.
     * если ничего не было передано в качестве данных для новой страницы - функция прекратит выполнение
     */
    static _generateHtml(params = {}) {
        let templates = params.templates;
        let pageContent = params.pageContent;
        let pageParams = params.pageParams;

        //вставляем срендеренную страницу книги в шаблон rootWrapper
        let htmlPage = templates.rootWrapper.replace('{%passed-text-and-effects}', pageContent);

        //заменяем остальные ключевые слова на значения
        if (pageParams.pageNumber) {
            htmlPage = htmlPage.replace(/{%pageNumber}/g, pageParams.pageNumber);
        }

        if (pageParams.pagesLength) {
            htmlPage = htmlPage.replace(/{%pagesLength}/g, pageParams.pagesLength);
        }

        //удаляем параметры страницы
        let $pageParams = htmlPage.substring(htmlPage.indexOf('<params>'), htmlPage.indexOf('</params>'));

        htmlPage = htmlPage.replace($pageParams, '').replace('<params>', '').replace('</params>', '');

        //font-size-100 и data-font-size - это дефолтное значение для размеров шрифта, оно может меняться
        //поэтому задаём это здесь, а не на partial-вьюхах страниц
        htmlPage = htmlPage.replace('<div class="text">', '<div class="text font-size-100" data-font-size="100">');

        fs.writeFile(pageParams.generatedFolder + pageParams.newFileName, htmlPage, function (err) {
            if (err) throw err;
        });
    };

    /**
     *
     * @param filePath {string};
     * @private
     */
    static _getFileContent(filePath) {
        return fs.readFileSync(filePath).toString();
    }

    /**
     *
     * @param page {string}
     */
    static _getParamsPage(page) {
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
     * получаем список файлов в папке и передаём их в generateHtml;
     * readdir возвращает массив из имён файлов
     */
    static _getNewPagesList(newPagesFolder) {
        return fs.readdirSync(newPagesFolder);
    }
};