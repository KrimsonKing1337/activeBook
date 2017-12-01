let generateBookPages = require('./generateBookPages');
let svg = require('./svg');

//todo: промисифицировать, функции асинхронные, поэтому запись ниже не прокатывает

//render pages
generateBookPages();

//svg img to obj
svg();