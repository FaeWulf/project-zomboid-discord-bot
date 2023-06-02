import fetch from 'node-fetch'

export function checkURL (string : string) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(string);
}

export function humanizeTime(ms : number) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / 1000 / 60 % 60);
    return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':');
}
