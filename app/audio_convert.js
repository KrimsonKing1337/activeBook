/**
 * Created by K on 15.04.2017.
 */

let Files = require('./files');
let Converter = require('./converter');

//const audiosFolder = 'book_data/audios/';
const audiosFolder = 'test/';
const videosFolder = 'book_data/videos/';
const gitkeepFileName = 'gitkeep';

//todo: вынести глобальные переменные в отдельный класс, который будет их возвращать
//todo: разобраться с функцией map, я её щас юзаю тупо как forEach, нужно с её помощью трансформировать массив, а не просто перебирать
/**
 *
 * создаём новый экземпляр класса.
 * в него передаём требуемую директорию.
 * класс можно вызвать только через
 * конструкцию new.
 * если нужно обработать другую директорию
 * то переопределяем переменную files:
 * `files = new Files(dirPath)`
 */

let files = new Files(gitkeepFileName);

let converter;

/**
 * класс-обёртка для Converter,
 * инициализируем конвертер после
 * отработки асинхронной функции files.get
 */
class ConverterInit {
    constructor(files) {
        let self = this;
        this.files = files;
        ConverterInit._init(files);
    }

    static _init (files)  {
        let parsedFiles = ConverterInit._parseFilesForConvert(files, 'audio');
        converter = new Converter(parsedFiles);
        converter.convert(Converter.getFormatsByType('audio'));
    }

    /**
     *
     * @param files[] {string}
     * @param type {string}
     * @returns {*}
     * @private
     *
     * Формируем массив из переданных файлов,
     * но без gitkeep
     */
    static _parseFilesForConvert(files, type) {
        let formats = Converter.getFormatsByType(type);

        /**
         *
         * массив нужных файлов,
         * его мы потом используем для формирования
         * массива ненужных файлов
         */
        let usedFiles = [];

        /**
         * массив ненужных файлов,
         * приравниваем его к общему списку файлов,
         * потом из него будем удалять элементы,
         * которые есть в массиве нужных файлов
         */
        let unUsedFiles = files;

        files.map(function (file) {
            /**
             *
             * вызываем статический метод через название класса,
             * а не экземпляра класса.
             * то есть `ClassName.staticMethod()`,
             * а не `new ClassName.staticMethod()`
             */
            let fileProps = Files.getFileProps(file);

            /**
             * пробегаемся по каждому формату.
             * если расширение файла = формату
             * добавляем его в массив нужных файлов,
             * исключая gitkeep
             */
            formats.map(function (format, index) {
                if (fileProps.ext === '.' + format && fileProps.name !== gitkeepFileName) {
                    usedFiles.push(file);
                }
            });
        });

        /**
         * пробегаемся по массиву нужных файлов.
         * ищем значение каждого элемента массива
         * в общем списке файлов.
         * если таковой есть - удаляем его из массива ненужных файлов.
         * в конечном счёт у нас окажуются только ненужные файлы,
         * которые мы потом отправляем на удаление
         */
        usedFiles.map(function (file) {
            for (let i = 0; i < unUsedFiles.length; i++) {
                if (unUsedFiles[i] === file) {
                    unUsedFiles.splice(i, 1);
                }
            }
        });

        return {usedFiles: usedFiles, unUsedFiles: unUsedFiles, allFiles: files};
    }
}

files.get(audiosFolder, function (files) {
    //console.log(files);

    new ConverterInit(files);
});