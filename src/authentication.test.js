import { callIdmToken, callUsernamePassword } from "./connection.util.js";

// element to change by hand
const username = process.env.USERNAME
const password = process.env.PASSWORD


export const options = {
  vus: 1,
  duration: '5s',
  iterations: 1
};

export default function () {
  const loginResponseCookies = callUsernamePassword(username, password)
  console.log("login response : ",loginResponseCookies.skey, loginResponseCookies["anti-csrf-cookie"])
  console.log("access token", callIdmToken(loginResponseCookies.skey[0].value, loginResponseCookies["anti-csrf-cookie"][0].value))
  console.log("access token", callIdmToken(loginResponseCookies.skey[0].value, loginResponseCookies["anti-csrf-cookie"][0].value))
}