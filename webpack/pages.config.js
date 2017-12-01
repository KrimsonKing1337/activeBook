/**
 * для удобства, во время дебагга страниц в dev-окружении
 */

/**
 * @param page {string};
 * @return {{}}
 */
pageConfig = (page) => {
    const pageConfig = {
        title: 'activeBook 2.0 demo',
        context: '',
    };

    switch (page) {
        case 'page-1':
            pageConfig.context = 'page-1';
            break;
        case 'page-2':
            pageConfig.context = 'page-2';
            break;
        case 'page-3':
            pageConfig.context = 'page-3';
            break;
        case 'page-4':
            pageConfig.context = 'page-4';
            break;
        case 'page-5':
            pageConfig.context = 'page-5';
            break;
        case 'page-6':
            pageConfig.context = 'page-6';
            break;
        case 'page-7':
            pageConfig.context = 'page-7';
            break;
        case 'page-8':
            pageConfig.context = 'page-8';
            break;
        case 'page-9':
            pageConfig.context = 'page-9';
            break;
        case 'page-10':
            pageConfig.context = 'page-10';
            break;
        case 'page-11':
            pageConfig.context = 'page-11';
            break;
        case 'page-12':
            pageConfig.context = 'page-12';
            break;
    }

    return pageConfig;
};

const pagesConfig = [];

for (let i = 1; i <= 12; i++) {
    pagesConfig.push({
        title: 'activeBook 2.0 demo',
        context: `page-${i}`,
    });
}

module.exports = pagesConfig;

