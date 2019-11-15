
// 操作 Cookie
export function getCookie(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}

export function setCookie(name, value) {
  document.cookie = name + "=" + encodeURIComponent(value);
}

export function delCookie(name) {
  if (getCookie(name)) {
    // document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' +
    //   path + '; domain=' +
    //   domain;
    setCookie(name, ' ', -1);
  }
}

export function getAuthHeader(token) {
  const sso_token = token === null?'':token;
  return ({
    headers: {
      'Authorization': 'Bearer ' + sso_token,
    },
  });
}
