function ieVersion() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0)
        return 11;
    else if (ua.indexOf("Trident/6.0") > 0)
        return 10;
    else if (ua.indexOf("Trident/5.0") > 0)
        return 9;
    else
        return 0;  // not IE9, 10 or 11
}

!(window.ActiveXObject) && "ActiveXObject"
function isIE11(){
    return !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
}

function isWebkit() {
    if(!!window.webkitURL) {
        return true;
    } else {
        return false;
    }
}

function isIos() {
    if(['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0) {
        return true;
    } else {
        return false;
    }
}

function isIpad() {
    if(['iPad'].indexOf(navigator.platform) >= 0) {
        return true;
    } else {
        return false;
    }
}

function isRetina(){
    if(window.devicePixelRatio > 1) {
        return true;
    } else {
        return false;
    }
}
//
// var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
// var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
