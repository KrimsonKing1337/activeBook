let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');

let Files = require('./Files');
let FilesInst = new Files();

module.exports = class Converter {
    /**
     *
     * @param files[] {string};
     *
     * конструктор нужен для инициализации
     * экземляра класса. сюда пишем всё,
     * что для этого нужно: пишем пропсы,
     * вызываем функции, которые должны происходить при
     * инициализации экземпляра класса и так далее
     */
    constructor (files) {
        let self = this;
        this.files = files;
    }

    /**
     *
     *
     * приватный метод,
     * удаляет ненужные файлы,
     * т.е. не .ogg и не .mp3 (или не .webm или .mp4, etc.) после отработки convert
     */
    _removeUnused () {
        let files = this.files;

        if (files.length === 0) throw 'There are no files, exit';

        FilesInst.remove(files.unUsedFiles);
    };

    /**
     *
     * @param formats[] {string};
     * @param [callback] {function};
     *
     * публичный метод,
     * конвертирует в mp3/ogg, mp4/webm
     */
    convert (formats, callback) {
        let self = this;
        let files = this.files;

        if (files.length === 0) throw 'There are no files, exit';
        if (formats.length === 0) throw 'There are no formats, exit';

        let usedFiles = files.usedFiles;

        /**
         *
         * массив файлов и форматов, которые полетят в конвертер
         * `{fileProps: fileProps, format: mp3}`
         */
        let newFiles = [];

        usedFiles.map(function (file) {
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
             * если файла с таким расширением нет,
             * добавляем его в массив новых файлов
             */
            formats.map(function (format, index) {
                if (usedFiles.indexOf(fileProps.fullNameWithoutExt + '.' + format) === -1) {
                    newFiles.push({fileProps: fileProps, format: format});
                }
            });
        });

        /**
         * пробегаемся по каждому новому файлу
         * и отправляем его в конвертер
         */
        if (newFiles.length > 0) {
            let counter = 0;

            newFiles.map(function (newFile, index) {
                counter++;

                Converter.ffmpeg(newFile.fileProps, newFile.format, function (err) {
                    if (err) throw err;

                    counter--;

                    /**
                     * все итерации были выполнены
                     */
                    if (counter === 0) {
                        /**
                         *
                         * если callback не был передан,
                         * то просто выводим Files converting done
                         */
                        callback = callback || function () {
                                console.log('Files converting done');
                            };
                        callback();

                        /**
                         * подчищаем за собой,
                         * удаляем ненужные файлы (НЕ mp3/ogg или НЕ webm/mp4, etc.)
                         */
                        self._removeUnused(files);
                    }
                });
            });
        }
    };

    /**
     *
     * @param fileProps {object}
     * @param format {string}
     * @param callback {function}
     *
     * статичный метод нужен для того,
     * чтобы не дублировать его в экземпляры класса,
     * а экзепляры класса ссылаются на одно адрессное пространство.
     *
     * статичный метод используем, когда не нужно работать с контектом класса,
     * то есть это то же самое, как если бы мы вынесли этот метод в функцию за пределы класса.
     * но поскольку нужно объединить эту функцию в один контекст, мы вносим её в класс в виде метода.
     */
    static ffmpeg (fileProps, format, callback) {
        console.log('Converting ' + fileProps.fullName + ' to ' + fileProps.dirPath + '/' + fileProps.nameWithoutExt + '.' + format);

        ffmpeg(fileProps.fullName).toFormat(format).saveToFile(fileProps.dirPath + '/' + fileProps.nameWithoutExt + '.' + format)
            .on('end', function () {
                callback(null);
            })
            .on('error', function (err) {
                callback(err);
            });
    };

    /**
     *
     * @param type {string}; audio || video
     *
     * статичный метод,
     * получаем форматы по типу файлов
     */
    static getFormatsByType (type) {
        let formats;
        if (type === 'audio') {
            formats = ['mp3', 'ogg'];
        } else if (type === 'video') {
            formats = ['mp4', 'webm']
        } else {
            throw 'There is incorrect type. Only audio or video is allowed';
        }

        return formats;
    }
};