import { callIdmToken, callUsernamePassword } from "./utils/connection.util.js";
import { bootstrap } from "./utils/bootstrap.util.js";
import { updatePresence } from "./utils/presence.util.js";
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const USERS_ACCOUNT_CSV_FILE = '../resources/users.csv';


const PRESENCE_STATUS = ["BUSY", "AWAY", "BE_RIGHT_BACK", "AVAILABLE", "OUT_OF_OFFICE"]

const usersAccounts = new SharedArray('users accounts', function () {
  return papaparse.parse(open(USERS_ACCOUNT_CSV_FILE), { header: true }).data;
});



export const options = {
  vus: 1,
  duration: '60s',
  iterations: 10
};


export function setup() {
  const authenticatedUsers = []
  usersAccounts.forEach(userAccount =>{
    let authenticatedUser = {...userAccount}
    const loginResponseCookies = callUsernamePassword(authenticatedUser.username, authenticatedUser.password)

    const skey = loginResponseCookies.skey[0].value
    authenticatedUser.skey = skey

    const anti_csrf_cookie = loginResponseCookies["anti-csrf-cookie"][0].value
    authenticatedUser.anti_csrf_cookie = anti_csrf_cookie

    const access_token = callIdmToken(skey, anti_csrf_cookie)
    authenticatedUser.access_token = access_token

    const bootstrapResult = bootstrap(anti_csrf_cookie, access_token)

    const userId = Number(bootstrapResult?.account.id)
    authenticatedUser.userId = userId

    authenticatedUsers.push(authenticatedUser)
  })
  return {authenticatedUsers: authenticatedUsers}
}

export default function (data) {
    const authenticatedUsers = data.authenticatedUsers
    const vuIndex = __VU - 1;
    if (vuIndex >= authenticatedUsers.length) {
      console.error(`VU ${__VU} is trying to access user data index ${vuIndex}, but there are only ${authenticatedUsers.length} users.`);
      return;
    }
    const userAccount = authenticatedUsers[vuIndex]
    const presenceStatus = PRESENCE_STATUS[Math.floor((Math.random()*PRESENCE_STATUS.length))]
    updatePresence(presenceStatus, userAccount.userId, null, userAccount.anti_csrf_cookie, userAccount.access_token)
}