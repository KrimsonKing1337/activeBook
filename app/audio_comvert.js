/**
 * Created by K on 15.04.2017.
 */

let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
let path = require('path');
let async = require('async');

const audiosFolder = 'book_data/audios/';
const videosFolder = 'book_data/videos/';

/**
 *
 * @param audiosFolder {string}; папка с аудиофайлами
 */
const convertAudios = (audiosFolder) => {
    function getFiles (dirPath, callback) {
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
    }

    getFiles(audiosFolder, function (err, files) {
        console.log(err || files);
    });
};

//ffmpeg('test/test.ogg').toFormat('mp3').saveToFile('test/test.mp3');

convertAudios(audiosFolder);