/**
 * Created by k on 18.03.17.
 */
let fs = require('fs');
/*let beautify_js = require('js-beautify');
let beautify_css = require('js-beautify').css;
let beautify_html = require('js-beautify').html;
let tidy = require('htmltidy2').tidy;*/

/**
 * @param newFile {string}; имя для файла, который будет создан. возможно, поменять это на директорию откуда брать файлы для генерации на их основе html-страниц
 */
//const newFileName = process.argv[2];

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
 *
 * @var {object} templates; шаблоны страницы, которые будут собраны в один html-файл
 * @property templates.rootWrapper {string}; главная обёртка html-страницы
 * @property templates.textAndEffects {string}; содержимое страницы книги
 * @property templates.headerMenu {string}; меню
 * @property templates.page {string}; страница книги
 *
 */
let templates = {
    rootWrapper: null,
    headerMenu: null,
    textAndEffects: null,
    page: null
};

/**
 *
 * @var pageContent {string}; переданное содержимое, которое вставится в шаблон
 */
let pageContent = null;

/**
 *
 * @var {object} pageParamsGlobal; параметры для новой страницы, глобальные
 * @property pageParamsGlobal.newFileName {string}; имя файла для новой html-страницы
 * @property pageParamsGlobal.pageNumber {string}; номер страницы
 * @property pageParamsGlobal.pagesLength {string}; кол-во страниц
 */
let pageParamsGlobal = {
    newFileName: null,
    pageNumber: null,
    pagesLength: null
};

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
const renderRootWrapper = (params = {}) => {
    if (!params) return;

    let templates = params.templates;
    let pageContent = params.pageContent;
    let pageParams = params.pageParams;

    if (!(templates.rootWrapper && templates.headerMenu && templates.textAndEffects && templates.page && pageContent && pageParams)) return;

    let page = renderPage(params);

    //вставляем срендеренную страницу книги в шаблон rootWrapper
    let htmlPage = templates.rootWrapper.replace('{%page}', page);

    //заменяем остальные ключевые слова на значения
    if (pageParams.pageNumber) {
        htmlPage = htmlPage.replace(/{%pageNumber}/g, pageParams.pageNumber);
    }

    if (pageParams.pagesLength) {
        htmlPage = htmlPage.replace(/{%pagesLength}/g, pageParams.pagesLength);
    }

    //удаляем параметры страницы
    let $pageParams = page.substring(page.indexOf('<params>'), page.indexOf('</params>'));

    htmlPage = htmlPage.replace($pageParams, '').replace('<params>', '').replace('</params>', '');

    //font-size-100 и data-font-size - это дефолтное значение для размеров шрифта, оно может меняться
    //поэтому задаём это здесь, а не на partial-вьюхах страниц
    htmlPage = htmlPage.replace('<div class="text">', '<div class="text font-size-100" data-font-size="100">');

    fs.writeFile(generatedFolder + pageParams.newFileName, htmlPage, function(err) {
        if (err) throw err;
    });
};

/**
 *
 * @param params {object}
 * @param params.templates[] {string}
 * @param params.pageContent {string}
 */
const renderPage = (params = {}) => {
    if (!params) return;

    let templates = params.templates;
    let pageContent = params.pageContent;

    if (!(templates.headerMenu && templates.textAndEffects && templates.page && pageContent)) return;

    let textAndEffects = renderTextAndEffects(params);

    //вставляем шаблон header-menu на страницу
    let pageWithHeader = templates.page.replace('{%header-menu}', templates.headerMenu);

    //вставляем срендеренную часть страницы "text-and-effects" и возвращаем
    return (pageWithHeader.replace('{%text-and-effects}', textAndEffects));
};

/**
 *
 * @param params {object}
 * @param params.templates[] {string}
 * @param params.pageContent {string}
 */
const renderTextAndEffects = (params = {}) => {
    if (!params) return;

    let templates = params.templates;
    let pageContent = params.pageContent;

    if (!(templates.textAndEffects && pageContent)) return;

    //вставляем переданный text-and-effects и возвращаем
    return (templates.textAndEffects.replace('{%passed-text-and-effects}', pageContent));
};

/**
 *
 * @param pages[] {string}; страницы, на основе которых должен сгенерироваться html-файл
 */
const generateHtml = (pages) => {
    if (!pages) return;

    //прочитали textAndEffects и записали его содержимое в переменную
    fs.readFile(textAndEffectsFile, function (err, data) {
        if (err) throw err;
        templates.textAndEffects = data.toString();
        renderRootWrapper({
            templates: templates,
            pageContent: pageContent
        });
    });

    //прочитали headerMenu и записали его содержимое в переменную
    fs.readFile(headerMenuFile, function (err, data) {
        if (err) throw err;
        templates.headerMenu = data.toString();
        renderRootWrapper({
            templates: templates,
            pageContent: pageContent
        });
    });

    //прочитали page и записали его содержимое в переменную
    fs.readFile(pageFile, function(err, data) {
        if (err) throw err;
        templates.page = data.toString();
        renderRootWrapper({
            templates: templates,
            pageContent: pageContent
        });
    });

    //прочитали rootWrapper и записали его содержимое в переменную
    fs.readFile(rootWrapperFile, function(err, data) {
        if (err) throw err;
        templates.rootWrapper = data.toString();
        renderRootWrapper({
            templates: templates,
            pageContent: pageContent
        });
    });

    //читаем каждую новую страницу и записали их содержимое в переменную
    pages.map(function (value) {
        fs.readFile(newPagesFolder + value, function(err, data) {
            if (err) throw err;
            pageContent = data.toString();

            let pageParams = {} = getParamsPage(pageContent);
            pageParams.newFileName = value;

            renderRootWrapper({
                templates: templates,
                pageContent: pageContent,
                pageParams: pageParams
            });
        });
    });
};

/**
 *
 * @param page {string}
 */
const getParamsPage = (page) => {
    if (!page) return;

    let pageParams = {};
    const paramsName = {
        pageNumber: 'pageNumber',
    };

    let $pageParams = page.substring(page.indexOf('<params>'), page.indexOf('</params>')).replace('<params>', '');

    pageParams.pageNumber = ($pageParams.substring($pageParams.indexOf(paramsName.pageNumber), $pageParams.indexOf(';'))
        .replace(paramsName.pageNumber, '').replace('=', ''))
        .trim();

    pageParams.pagesLength = pageParamsGlobal.pagesLength;

    return pageParams;
};

/**
 * получаем список файлов в папке и передаём их в generateHtml;
 * readdir возвращает массив из имён файлов
 */
fs.readdir(newPagesFolder, (err, files) => {
    if (err) throw err;

    pageParamsGlobal.pagesLength = files.length;

    generateHtml(files);
});