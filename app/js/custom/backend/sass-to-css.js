let fs = require('fs');
let sass = require('node-sass');

sass.render({
    file: './new_view/styles/css/css.scss',
    sourceMap: './new_view/styles/css/css.map'
}, function(err, result) {
    if (err) throw err;

    fs.writeFile('./new_view/styles/css/css.css', result.css, function (err) {
        if (err) throw err;
    });
});