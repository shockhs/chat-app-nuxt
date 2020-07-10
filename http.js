const restApi = function () {
    return window.location.host.includes('gitpod.io') ?
        "https://" + window.location.host.replace('4200', '3000') :
        window.location.protocol + '://' + window.location.host + ':3000';
}

