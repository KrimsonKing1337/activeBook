/**
 *
 * @param pagesCurEffects[] {object}
 * @param rootApp {string}
 * @param effectCur {object}
 * @param effectCurIndex {number}
 * @param key {string}
 */
function pathModifyByKey(pagesCurEffects, rootApp, effectCur, effectCurIndex, key) {
    effectCur[key].forEach((scrCur, scrCurIndex) => {
        const keyCur = pagesCurEffects[effectCurIndex][key][scrCurIndex];
        const pattern = /^\/book_data\//;

        if (pattern.test(keyCur) === true) {
            pagesCurEffects[effectCurIndex][key][scrCurIndex] = `${rootApp}${scrCur}`
        }
    });
}

/**
 *
 * @param pagesCurEffects[] {object}
 * @param rootApp {string}
 */
export function modifyPathForPagesCurEffects(pagesCurEffects, rootApp) {
    pagesCurEffects.forEach((effectCur, effectCurIndex) => {
        if (typeof effectCur.src !== 'undefined') {
            pathModifyByKey(pagesCurEffects, rootApp, effectCur, effectCurIndex, 'src');
        }

        if (typeof effectCur.poster !== 'undefined') {
            pathModifyByKey(pagesCurEffects, rootApp, effectCur, effectCurIndex, 'poster');
        }
    });

    return pagesCurEffects;
}