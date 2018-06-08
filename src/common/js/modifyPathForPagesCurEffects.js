/**
 *
 * @param pagesCurEffects[] {object}
 * @param rootApp {string}
 */
export function modifyPathForPagesCurEffects(pagesCurEffects, rootApp) {
    pagesCurEffects.forEach((effectCur, effectCurIndex) => {
        if (typeof effectCur.src === 'undefined') return;

        effectCur.src.forEach((scrCur, scrCurIndex) => {
            const keyCur = pagesCurEffects[effectCurIndex].src[scrCurIndex];
            const pattern = /^\/book_data\//;

            if (pattern.test(keyCur) === true) {
                pagesCurEffects[effectCurIndex].src[scrCurIndex] = `${rootApp}${scrCur}`
            }
        });
    });

    return pagesCurEffects;
}