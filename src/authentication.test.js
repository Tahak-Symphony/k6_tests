import { callIdmToken, callUsernamePassword } from "./utils/connection.util.js";
import { bootstrap } from "./utils/bootstrap.util.js";
import { updatePresence } from "./utils/presence.util.js";
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
  
  const skey = loginResponseCookies.skey[0].value
  console.log('skey', skey)
  
  const anti_csrf_cookie = loginResponseCookies["anti-csrf-cookie"][0].value
  console.log('anti csrf cookie', anti_csrf_cookie)

  const access_token = callIdmToken(skey, anti_csrf_cookie)
  console.log("access token", access_token)

  const bootstrapResult = bootstrap(anti_csrf_cookie, access_token)

  const userId = Number(bootstrapResult?.account.id)
  
  const presenceUpdateResult = updatePresence("BE_RIGHT_BACK", userId, null, anti_csrf_cookie, access_token)
  console.log(presenceUpdateResult)
}