// import Cookies from "universal-cookie";

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

export function isEquivalent(a, b) {
    if (a != undefined && b != undefined) {
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];
            if (a[propName] != b[propName]) {
                return false;
            }
        }
        return true;
    } else {
        return true;
    }
}

export function addCookie(name, val, time) {
    console.log("AddCookie", name, val, time)
    setCookie(name, val, 1 );
}

export function removeCookie(name) {
    eraseCookie(name)
}

export function getUser() {
    // let cookies = new Cookies();
    // console.log(cookies.get('user'), "===================++++++++++++++++++")
    return getCookie('user') != undefined ? getCookie('user_name') : '';
}

export function logOut() {
    removeCookie('user');
    removeCookie('user_name')
}

export function reload() {
    window.location.reload(false);
}
