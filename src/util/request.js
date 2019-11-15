import {getAuthHeader, getCookie} from "./auth";
// import router from 'umi/router';

function checkStatus(response) {
  if (response && response.status === 401) {
    console.log('用户Token过期');
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }else{
    // router.push('/index');
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const sso_token = getCookie(getCookie('userName'));
  const authHeader = getAuthHeader(sso_token);
  const headers = {...options.headers,...authHeader.headers};
  const response = await fetch(url, {...options,headers});
  checkStatus(response);
  return await response.json();
}
