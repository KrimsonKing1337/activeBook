/**
 * Created by K on 15.04.2017.
 */

let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
let path = require('path');
let async = require('async');

//const audiosFolder = 'book_data/audios/';
const audiosFolder = 'test/';
const videosFolder = 'book_data/videos/';
const gitkeepFileName = 'gitkeep';

/**
 * в этом классе мы работаем с файлами
 */
class Files {
    /**
     *
     * @param dirPath {string};
     *
     * конструктор нужен для инициализации
     * экземляра класса. сюда пишем всё,
     * что для этого нужно: пишем пропсы,
     * вызываем функции, которые должны происходить при
     * инициализации экземпляра класса и так далее
     */
    constructor(dirPath) {
        let self = this;
        this.dirPath = dirPath;
    }

    /**
     *
     * @param dirPath {string}
     * @param callback (function)
     *
     * рекурсивное получение файлов в папке
     * приватный метод, асинхронная функция
     */
    _get (dirPath, callback) {
    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        let filePaths = [];

        async.eachSeries(files, function (fileName, eachCallback) {
            let filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    this._get(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile()) {
                        filePaths.push(filePath);
                    }

                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });

    });
};

    /**
     *
     * @param callback {function};
     *
     * публичный метод, возвращает массив из файлов,
     * в него мы передаём callback, который выполнится по завершению
     * _get (она асинхронная)
     */
    get(callback) {
        this._get(this.dirPath, function (err, files) {
            if (err) throw err;

            callback(files);
        });
    };

    /**
     *
     * @param [callback] {function};
     *
     * публичный метод,
     * удаляет ненужные файлы,
     * т.е. не .ogg и не .mp3
     * todo: добавить выбор между video и audio
     */
    removeUnused(callback) {
        this._get(this.dirPath, function (err, files) {
            if (err) throw err;

            if (files.length === 0) throw 'There are no files, exit';

            /**
             *
             * счётчик итераций.
             * когда требуемое условие для начала выполнения асинхронной функции выполнилось,
             * счётчик инкрементируем.
             * асинхронная функция отработала, счётчик декриментируем
             * и тут же проверяем на ноль.
             * если равен нулю - значит все итерации были выполнены, выполняем callback.
             *
             * то есть, сначала всё идёт синхронно, друг за другом,
             * поэтому после выполнения условия производится операция counter++;
             * далее запускается асинхронная функция, которая выполняется параллельно другим,
             * поэтому в её callback-е выполняется counter--,
             * и производится сравнение с нулём.
             */
            let counter = 0;

            files.map(function (file) {
                let fileProps = {
                    fullName: file,
                    name: path.basename(file),
                    ext: path.extname(file),
                    dirPath: path.dirname(file)
                };

                if (fileProps.ext !== '.ogg' && fileProps.ext !== '.mp3') {
                    if (fileProps.name === gitkeepFileName) return;

                    counter++;

                    fs.unlink(fileProps.fullName, function (err) {
                        if (err) throw err;

                        console.log('File ' + fileProps.fullName + ' was deleted');

                        counter--;

                        if (counter === 0) {
                            /**
                             *
                             * если callback не был передан,
                             * то просто выводим Files deleting done
                             */
                            callback = callback || function () {
                                    console.log('Files deleting done');
                                };
                            callback();
                        }
                    });
                }
            });
        });
    };

    /**
     *
     * @param [callback] {function};
     *
     * публичный метод,
     * конвертирует в mp3/ogg,
     * todo: добавить выбор между video и audio
     */
    convert (callback) {
        this._get(this.dirPath, function (err, files) {
            if (err) throw err;

            if (files.length === 0) throw 'There are no files, exit';

            files.map(function (file) {
                let fileProps = {
                    fullName: file,
                    name: path.basename(file),
                    ext: path.extname(file),
                    dirPath: path.dirname(file)
                };

                fileProps.fullNameWithoutExt = file.substring(0, file.indexOf(fileProps.ext));
                fileProps.nameWithoutExt = fileProps.name.substring(0, fileProps.name.indexOf(fileProps.ext));

                if (fileProps.ext === '.ogg') {
                    if (files.indexOf(fileProps.fullNameWithoutExt + '.mp3') === -1) Files.ffmpeg(fileProps, 'mp3');
                } else if (fileProps.ext === '.mp3') {
                    if (files.indexOf(fileProps.fullNameWithoutExt + '.ogg') === -1) Files.ffmpeg(fileProps, 'ogg');
                }
            });

            /**
             *
             * если callback не был передан,
             * то просто выводим Files converting done
             */
            callback = callback || function () {
                    console.log('Files converting done');
                };
            callback();
        });
};

    /**
     *
     * @param fileProps {object}
     * @param format {string}
     *
     * статичный метод нужен для того,
     * чтобы не дублировать его в экземпляры класса,
     * а экзепляры класса ссылаются на одно адрессное пространство.
     *
     * статичный метод используем, когда не нужно работать с контектом класса,
     * то есть это то же самое, как если бы мы вынесли этот метод в функцию за пределы класса.
     * но поскольку нужно объединить эту функцию в один контекст, мы вносим её в класс в виде метода.
     */
    static ffmpeg (fileProps, format) {
        ffmpeg(fileProps.fullName).toFormat(format).saveToFile(fileProps.dirPath + '/' + fileProps.nameWithoutExt + '.' + format);
    };
}

/**
 *
 * создаём новый экземпляр класса.
 * в него передаём требуемую директорию.
 * класс можно вызвать только через
 * конструкцию new
 */
let files = new Files(audiosFolder);

files.get(function (files) {
    console.log(files);
});

files.convert();

files.removeUnused();