let fs = require('fs');
let path = require('path');
let sass = require('node-sass');

module.exports = class SassToCss {
    constructor () {

    }

    /**
     *
     * @param cssDir {string}
     */
    static render (cssDir) {
        let files = SassToCss.getFiles(cssDir);

        files.forEach(function (file) {
            SassToCss._render(file);
        });
    }

    /**
     *
     * @param file {object}
     * @param file.fullName {string}
     * @param file.name {string}
     * @param file.nameWithoutExt {string}
     * @param file.dirPath {string}
     * @private
     */
    static _render (file) {
        sass.render({
                file: file.fullName,
                outFile: file.dirPath + '/' + file.nameWithoutExt + '.css',
                sourceMap: true
            },
            function (err, result) {
                if (err) throw  err;

                fs.writeFile(file.dirPath + '/' + file.nameWithoutExt + '.css', result.css.toString(), function (err) {
                    if (err) throw  err;
                });

                fs.writeFile(file.dirPath + '/' + file.nameWithoutExt + '.css.map', result.map.toString(), function (err) {
                    if (err) throw  err;
                });
            });
    }

    /**
     *
     * @param cssDir {string}
     */
    static getFiles (cssDir) {
        let files = fs.readdirSync(cssDir);
        let filteredFiles = SassToCss._filteredFiles(files);
        let filteredFilesWithFullPaths = [];

        filteredFiles.forEach(function (file) {
            filteredFilesWithFullPaths.push(cssDir + file);
        });

        return SassToCss._getFilesProps(filteredFilesWithFullPaths);
    }

    /**
     *
     * @param files[] {string}
     * @private
     */
    static _filteredFiles (files) {
        let filteredFiles = [];

        files.forEach(function (file) {
            if (path.extname(file) === '.scss') {
                filteredFiles.push(file);
            }
        });

        return filteredFiles;
    }

    static _getFilesProps (files) {
        let filesWithProps = [];

        files.forEach(function (file) {
            filesWithProps.push(SassToCss._getFileProps(file));
        });

        return filesWithProps;
    }

    /**
     *
     * @param file {string}
     * @private
     */
    static _getFileProps (file) {
        let fileProps = {
            name: path.basename(file),
            fullName: file,
            ext: path.extname(file),
            dirPath: path.dirname(file)
        };

        fileProps.nameWithoutExt = path.basename(fileProps.name, fileProps.ext);

        return fileProps;
    }
};