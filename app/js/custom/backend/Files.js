let fs = require('fs');
let path = require('path');
let async = require('async');

/**
 * в этом классе мы работаем с файлами
 * в общем случае (получить файлы рекурсивно из директории,
 * удалить файлы по списку, получить свойства файла и так далее
 */
module.exports = class Files {
    /**
     *
     * @param [gitkeepFileName] {string};
     *
     * конструктор нужен для инициализации
     * экземляра класса. сюда пишем всё,
     * что для этого нужно: пишем пропсы,
     * вызываем функции, которые должны происходить при
     * инициализации экземпляра класса и так далее
     */
    constructor(gitkeepFileName) {
        let self = this;
        this.gitkeepFileName = gitkeepFileName || 'gitkeep';
    }

    /**
     *
     * @param dirPath {string}
     * @param callback (function)
     *
     * рекурсивное получение файлов в папке
     * приватный метод, асинхронная функция
     */
    _get(dirPath, callback) {
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
     * @param dirPath {string}
     * @param callback {function};
     *
     * публичный метод, возвращает массив из файлов,
     * в него мы передаём callback, который выполнится по завершению
     * _get (она асинхронная)
     */
    get(dirPath, callback) {
        this._get(dirPath, function (err, files) {
            if (err) throw err;

            callback(files);
        });
    };

    /**
     *
     * @param dirPath {string}
     * @returns {Array}
     *
     * возвращает список файлов и папок в директории,
     * синхронно;
     * аналогично команде ls в bash
     */
    static ls(dirPath) {
        return fs.readdirSync(dirPath);
    }

    /**
     *
     * @param filePaths[] {string}
     * @param mask[] {string}; files || dirs || extension
     *
     * Фильтр для списка файлов.
     * В случае, если фильтруется по расширению файла - точка обязательна!
     * т.е.: ```Files.filterFiles(filePaths, ['.mp3, .mp4'])```
     */
    static filterFiles(filePaths, mask) {
        let filteredFilesPaths = [];

        filePaths.forEach(function (filePath) {
            let fileProps = Files.getFileProps(filePath);

            mask.forEach(function (item) {
                if (item === 'files') {
                    if (fileProps.isFile === true) {
                        filteredFilesPaths.push(filePath);
                    }
                } else if (item === 'dirs') {
                    if (fileProps.isDir === true) {
                        filteredFilesPaths.push(filePath);
                    }
                } else {
                    if (fileProps.ext === item) {
                        filteredFilesPaths.push(filePath);
                    }
                }
            });
        });

        return filteredFilesPaths;
    }

    /**
     * @param files[] {string}
     * @param [callback] {function}
     *
     * публичный метод, удаляет файлы.
     * в него передаём файлы массивом
     * и callback, который выполнится по завершению
     * всех итераций
     */
    remove(files, callback) {
        let gitkeepFileName = this.gitkeepFileName;
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

        files.forEach(function (file) {
            let fileProps = {
                fullName: file,
                name: path.basename(file),
                ext: path.extname(file),
                dirPath: path.dirname(file)
            };

            if (fileProps.name === gitkeepFileName) return;

            counter++;

            fs.unlink(fileProps.fullName, function (err) {
                if (err) throw err;

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
        });
    }

    /**
     *
     * @param file {string}
     * @returns {{fullName: *, name: *, ext: *, dirPath: *}}
     *
     * публичный метод,
     * возвращает свойства переданного файла
     */
    static getFileProps(file) {
        let stat = fs.statSync(file);
        let fileProps = {
            isDir: stat.isDirectory(),
            isFile: stat.isFile(),
            fullName: file,
            name: path.basename(file),
            ext: path.extname(file),
            dirPath: path.dirname(file)
        };

        fileProps.fullNameWithoutExt = file.substring(0, file.indexOf(fileProps.ext));
        fileProps.nameWithoutExt = fileProps.name.substring(0, fileProps.name.indexOf(fileProps.ext));

        return fileProps;
    }
};