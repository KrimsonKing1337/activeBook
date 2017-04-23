let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');

let Files = require('./files');
let filesInst = new Files();

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
     * @param type {string};
     * @param [callback] {function};
     *
     * приватный метод,
     * удаляет ненужные файлы,
     * т.е. не .ogg и не .mp3 (или не .webm или .mp4, etc.) после отработки convert
     */
    _removeUnused (type, callback) {
        let files = this.files;

        if (files.length === 0) throw 'There are no files, exit';

        let formats;
        if (type === 'audio') {
            formats = ['mp3', 'ogg'];
        } else if (type === 'video') {
            formats = ['mp4', 'webm']
        } else {
            throw 'There is incorrect type. Only audio or video is allowed';
        }

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
             * добавляем его в массив нужных файлов
             */
            formats.map(function (format, index) {
                if (fileProps.ext === '.' + format) {
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

        filesInst.remove(unUsedFiles);
    };

    /**
     *
     * @param type {string}; audio || video;
     * @param [callback] {function};
     *
     * публичный метод,
     * конвертирует в mp3/ogg, mp4/webm
     */
    convert (type, callback) {
        let self = this;
        let files = this.files;

        if (files.length === 0) throw 'There are no files, exit';

        let formats;
        if (type === 'audio') {
            formats = ['mp3', 'ogg'];
        } else if (type === 'video') {
            formats = ['mp4', 'webm']
        } else {
            throw 'There is incorrect type. Only audio or video is allowed';
        }

        let filesAllowed = [];

        files.map(function (file) {
            let fileProps = Files.getFileProps(file);

            formats.map(function (format, index) {
                if (fileProps.ext === '.' + format) {
                    filesAllowed.push(file);
                }
            });
        });

        /**
         *
         * массив файлов и форматов, которые полетят в конвертер
         * `{fileProps: fileProps, format: mp3}`
         */
        let newFiles = [];

        filesAllowed.map(function (file) {
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
                if (files.indexOf(fileProps.fullNameWithoutExt + '.' + format) === -1) {
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
                        self._removeUnused(type);
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
        ffmpeg(fileProps.fullName).toFormat(format).saveToFile(fileProps.dirPath + '/' + fileProps.nameWithoutExt + '.' + format)
            .on('end', function () {
                callback(null);
            })
            .on('error', function (err) {
                callback(err);
            });
    };
};