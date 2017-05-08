/**
 * Created by k on 18.03.17.
 */

let GeneratorBookPages = require('./GeneratorBookPages');

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


let templatesPaths = {
    'templatesFolder': 'templates/',
    'newPagesFolder': 'pages_partial/',
    'generatedFolder': 'pages/'
};

templatesPaths.rootWrapperFile = templatesPaths.templatesFolder + 'root_wrapper.html';
templatesPaths.pageFile = templatesPaths.templatesFolder + 'page.html';
templatesPaths.headerMenuFile = templatesPaths.templatesFolder + 'header_menu.html';
templatesPaths.textAndEffectsFile = templatesPaths.templatesFolder + 'text_and_effects.html';

GeneratorBookPages.init(templatesPaths);