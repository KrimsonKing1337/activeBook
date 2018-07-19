/**
 *
 * @param value {string}
 */
function ifNeedToModify(value) {
    const pattern = /^\/book_data\//;

    return (pattern.test(value) === true);
}

/**
 *
 * @param pagesCurEffects[] {object}
 * @param rootApp {string}
 * @param effectCur {object}
 * @param effectCurIndex {number}
 * @param key {string}
 */
function pathModifyByKey(pagesCurEffects, rootApp, effectCur, effectCurIndex, key) {
    if (typeof effectCur[key] !== 'string') {
        effectCur[key].forEach((valueCur, valueCurIndex) => {
            if (ifNeedToModify(valueCur) === true) {
                pagesCurEffects[effectCurIndex][key][valueCurIndex] = `${rootApp}${valueCur}`;
            }
        });
    } else {
        const value = effectCur[key];

        if (ifNeedToModify(value) === true) {
            pagesCurEffects[effectCurIndex][key] = `${rootApp}${value}`;
        }
    }
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