let pageInfoGlobal;

export function pageInfo(info) {
    if (arguments.length > 0) {
        pageInfoGlobal = info;
    }

    return pageInfoGlobal;
}