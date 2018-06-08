/**
 *
 * @param url {string}
 * @param dataType {string}
 *
 * dataType нужен только для совместимости с cordova,
 * только там проблемы, если не указать тип данных
 */
export function getAJAX(url, dataType = 'text') {
    return new Promise(((resolve, reject) => {
        $.ajax({
            dataType,
            url,
            success(data) {
                resolve(data);
            },
            error(err) {
                reject(err);
            }
        });
    }));
}