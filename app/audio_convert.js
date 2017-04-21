/**
 * Created by K on 15.04.2017.
 */

let Files = require('./files');
let Converter = require('./converter');

//const audiosFolder = 'book_data/audios/';
const audiosFolder = 'test/';
const videosFolder = 'book_data/videos/';
const gitkeepFileName = 'gitkeep';

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
        ConverterInit.init(files);
    }

    static init (files)  {
        converter = new Converter(files);
        converter.convert();
    }
}

files.get(audiosFolder, function (files) {
    console.log(files);

    new ConverterInit(files);
});