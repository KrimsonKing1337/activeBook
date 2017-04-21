let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
let path = require('path');

let Files = require('./files');
let filesInst = new Files();

/**
 * не работал кодер ogg,
 * я для теста сделал wav, не забыть потом вернуть обратно
 * todo: добавить передачу параметра что именно конвертить
 * (видео/аудио/etc.)
 */
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
    constructor(files) {
        let self = this;
        this.files = files;
    }

    /**
     *
     * @param [callback] {function};
     *
     * приватный метод,
     * удаляет ненужные файлы,
     * т.е. не .ogg и не .mp3 после отработки convert
     * todo: добавить выбор между video и audio
     */
    _removeUnused(callback) {
        let files = this.files;

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

        let unusedFiles = [];

        files.map(function (file) {
            let fileProps = filesInst.getFileProps(file);

            if (fileProps.ext !== '.wav' && fileProps.ext !== '.mp3') {
                unusedFiles.push(file);
            }
        });

        filesInst.remove(unusedFiles);
    };

    /**
     *
     * @param [callback] {function};
     *
     * публичный метод,
     * конвертирует в mp3/wav,
     * todo: добавить выбор между video и audio
     */
    convert (callback) {
        let files = this.files;

        if (files.length === 0) throw 'There are no files, exit';

        files.map(function (file) {
            let fileProps = filesInst.getFileProps(file);

            /**
             * если файл уже есть в одном из форматов,
             * то не форматируем заново в этот формат.
             * соотвественно, если оба нужных формата есть,
             * то не делаем ничего.
             */
            if (fileProps.ext === '.wav') {
                if (files.indexOf(fileProps.fullNameWithoutExt + '.mp3') === -1) Converter.ffmpeg(fileProps, 'mp3');
            } else if (fileProps.ext === '.mp3') {
                if (files.indexOf(fileProps.fullNameWithoutExt + '.wav') === -1) Converter.ffmpeg(fileProps, 'wav');
            }
        });

        /**
         * подчищаем за собой,
         * удаляем ненужные файлы (НЕ mp3/ogg)
         */
        this._removeUnused();

        /**
         *
         * если callback не был передан,
         * то просто выводим Files converting done
         */
        callback = callback || function () {
                console.log('Files converting done');
            };
        callback();
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
};