export function getJSON(url) {
    return new Promise(((resolve, reject) => {
        $.ajax({
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