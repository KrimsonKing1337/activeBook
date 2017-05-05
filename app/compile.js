/**
 * Created by k on 18.03.17.
 */
let fs = require('fs');

/**
 *
 * @const templatesFolder {string}; имя директории с шаблонами, пишется со слэшем на конце
 * @const newPagesFolder {string}; имя директории с новыми данными
 * @const generatedFolder {string}; имя директории куда писать сгенерированные html-файлы
 * @const rootWrapperFile {string}; имя файла главного шаблона для формирования html-страницы
 * @const pageFile {string}; имя файла шаблона страницы книги
 * @const headerMenuFile {string}; имя файла шаблона главного меню
 * @const textAndEffectsFile {string}; имя файла шаблона для содержимого страницы книги
 */
const templatesFolder = 'templates/';
const newPagesFolder = 'pages_partial/';
const generatedFolder = 'pages/';
const rootWrapperFile = templatesFolder + 'root_wrapper.html';
const pageFile = templatesFolder + 'page.html';
const headerMenuFile = templatesFolder + 'header_menu.html';
const textAndEffectsFile = templatesFolder + 'text_and_effects.html';

/**
 * собираем из html-шаблонов страницу книги, записываем в новый html-файл
 */
class Compiler {
    constructor(templatesPath) {
        Compiler._init();
    }

    static _init() {
        Compiler._prepareToGenerateHtml();
    }

    static _prepareToGenerateHtml() {
        let newPagesList = Compiler._getNewPagesList(newPagesFolder);
        let templates = Compiler._getTemplates();

        //читаем каждую новую страницу и записали их содержимое в переменную
        newPagesList.map(function (value) {
            fs.readFile(newPagesFolder + value, function (err, data) {
                if (err) throw err;

                let pageContent = data.toString();

                let pageParams = {} = Compiler._getParamsPage(pageContent);
                pageParams.newFileName = value;
                pageParams.pagesLength = newPagesList.length;

                Compiler._generateHtml({
                    templates: templates,
                    pageContent: pageContent,
                    pageParams: pageParams
                });
            });
        });
    }

    static _getTemplates() {
        let templates = {};
        templates.textAndEffects = Compiler._getFileContent(textAndEffectsFile);
        templates.headerMenu = Compiler._getFileContent(headerMenuFile);
        templates.page = Compiler._getFileContent(pageFile)
            .replace('{%header-menu}', templates.headerMenu)
            .replace('{%text-and-effects}', templates.textAndEffects);
        templates.rootWrapper = Compiler._getFileContent(rootWrapperFile).replace('{%page}', templates.page);

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

        fs.writeFile(generatedFolder + pageParams.newFileName, htmlPage, function (err) {
            if (err) throw err;
        });
    };

    static _getFileContent(filePath) {
        fs.readFile(filePath, function (err, data) {
            if (err) throw err;

            return data.toString();
        });
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
        fs.readdir(newPagesFolder, (err, files) => {
            if (err) throw err;

            return files;
        });
    }
}