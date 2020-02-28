import Cookies from "universal-cookie";

export default function () {
    var cookies = new Cookies();
    var user = cookies.get('user') != undefined ? cookies.get('user_name') : '';

    return user;
}
