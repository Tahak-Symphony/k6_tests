
import http from 'k6/http';
import CryptoJS from "crypto-js";

function derivePbkdf2Key(password, saltBase64, iterations, keyLengthBits) {
    const salt = CryptoJS.enc.Base64.parse(saltBase64);
    const config = {
        keySize: keyLengthBits / 32,
        hasher: CryptoJS.algo.SHA256,
        iterations: iterations
    };
    const derivedKey = CryptoJS.PBKDF2(password, salt, config);
    return CryptoJS.enc.Base64.stringify(derivedKey);
}

//Target to change by hand
const TARGET = process.env.TARGET;


const LOGIN_URL = `${TARGET}/login/v2/username_password`
const SALT_URL = `${TARGET}/login/salt`
const TOKEN_URL = `${TARGET}/login/idm/tokens?scope=rtc-cs%20df2-feeder%20profile`

export const options = {
  vus: 1,
  duration: '5000s',
  iterations: 1
};

function callSalt(username){
    const headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
    const res = http.post(SALT_URL, `userName=${username}`, {headers})
    return res.json("salt")
}

export function callUsernamePassword(username, password) {
  const salt = callSalt(username)
  const derivedKey = derivePbkdf2Key(password, salt, 10000, 256)

  const body = {
      userName: username,
      hPassword: derivedKey
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  const res = http.post(LOGIN_URL, body, {headers} )
  return res.cookies
}

export function callIdmToken(skeyCookie, csrf_token){
  const headers = {
    'x-symphony-csrf-token': csrf_token
  }
  const cookies = {
    skey: skeyCookie
  }
  const res = http.post(TOKEN_URL, null, {headers, cookies})
  return res.json("access_token")
}
