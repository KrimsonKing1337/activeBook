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

/**
 *
 * @param dirPath {string}
 * @param callback (function)
 *
 * рекурсивное получение файлов в папке
 */
const getFiles = (dirPath, callback) => {
    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        let filePaths = [];

        async.eachSeries(files, function (fileName, eachCallback) {
            let filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile() && path.extname(filePath).length > 0) {
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
 * @param files[] {string}
 */
const prepareToConvert = (files = []) => {
    if (files.length === 0) throw 'There are no files, exit';

    files.map(function (file) {
        let fileProps = {
            fullName: file,
            name: path.basename(file),
            ext: path.extname(file),
            dirName: path.dirname(file)
        };

        fileProps.fullNameWithoutExt = file.substring(0, file.indexOf(fileProps.ext));
        fileProps.nameWithoutExt = fileProps.name.substring(0, fileProps.name.indexOf(fileProps.ext));

        if (fileProps.ext === '.ogg') {
            if (files.indexOf(fileProps.fullNameWithoutExt + '.mp3') === -1) convertFiles(fileProps, 'mp3');
        } else if (fileProps.ext === '.mp3') {
            if (files.indexOf(fileProps.fullNameWithoutExt + '.ogg') === -1) convertFiles(fileProps, 'ogg');
        }
    });
};

/**
 *
 * @param fileProps {object}
 * @param format {string}
 */
const convertFiles = (fileProps, format) => {
    ffmpeg(fileProps.fullName).toFormat(format).saveToFile(fileProps.dirName + '/' + fileProps.nameWithoutExt + '.' + format);
};

/**
 *
 * @param files[] {string}
 */
const removeFiles = (files = []) => {
    if (files.length === 0) throw 'There are no files, exit';

    let counter = 0;

    files.map(function (file) {
        let fileProps = {
            fullName: file,
            name: path.basename(file),
            ext: path.extname(file),
            dirName: path.dirname(file)
        };

        if (fileProps.ext !== '.ogg' && fileProps.ext !== '.mp3') {
            counter++;

            fs.unlink(fileProps.fullName, function (err) {
               if (err) throw err;

               console.log('File ' + fileProps.fullName + ' was deleted');

               counter--;

               if (counter === 0) console.log('Files deleting done');
            });
        }
    });
};

/**
 *
 * @param audiosFolder {string}; папка с аудиофайлами
 */
const convertAudios = (audiosFolder) => {
    getFiles(audiosFolder, function (err, files) {
        if (err) return err;

        prepareToConvert(files);
    });
};

//convertAudios(audiosFolder);

getFiles(audiosFolder, function (err, files) {
    if (err) return err;

    removeFiles(files);
});
