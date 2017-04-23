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
        let allowedFiles = ConverterInit._audioFilesForConvert(files);
        converter = new Converter(allowedFiles);
        converter.convert('audio');
    }

    /**
     *
     * @param files[] {string}
     * @returns {*}
     * @private
     *
     * Формируем массив из переданных файлов,
     * но без gitkeep
     */
    static _audioFilesForConvert(files) {
        let allowedFiles = files;

        allowedFiles.map(function (file, index) {
            if (file.indexOf(gitkeepFileName) !== -1) {
                allowedFiles.splice(index, 1);
            }
        });

        return allowedFiles;
    }
}

files.get(audiosFolder, function (files) {
    //console.log(files);

    new ConverterInit(files);
});