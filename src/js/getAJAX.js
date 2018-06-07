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