/**
 *
 * @param pagesCurEffects[] {object}
 * @param rootApp {string}
 */
export function modifyPathForPagesCurEffects(pagesCurEffects, rootApp) {
    pagesCurEffects.forEach((effectCur, effectCurIndex) => {
        if (typeof effectCur.src === 'undefined') return;

        effectCur.src.forEach((scrCur, scrCurIndex) => {
            pagesCurEffects[effectCurIndex].src[scrCurIndex] = `${rootApp}${scrCur}`
        });
    });

    return pagesCurEffects;
}