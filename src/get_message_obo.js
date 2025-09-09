import http from 'k6/http';
import { check } from 'k6';

// things to change manually on script
const username = "taha"
const threadID = "imlT9eav7vYcU9Vwj7UksX%2F%2F%2FmbXRDlHdA%3D%3D"

const APP_JWT_TOKEN = "eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJhcHBfaWQiLCJleHAiOjE3NTczMjU3Nzl9.hmfZJFu4UEJ5QXGWSbBuBRbQHQpUhGeffn51WnaF8IkRzZkf7J14PFtcIvcRqqGBKqwNnkFlckCHS96f39xhfT9L_bO603D0lNIE4EM7KBufrMnf3YLD9kSAmD_pWAkDwxSmgLO4m3BNHxhfuEFGFeTv34OIt-UhBcHYrlvtxpB5A5ti8BZDmd2NeT0W_Pz-tZhHhnMv2d7JHVFvWm2HGHDimpfO17KF1jcYMJbB4lBC0GZYps7W7mdcsW34lg_uYi1pndbcxP-ehLbmFr0J2i-YAufsFWNukJEzmi0D5TSdlQXkSGUL_ng_NOe6iZo-3j-En1R9g4586tG1Hfb3eS4wpOqqcPLPRCgDBYflPXs5nrqaIoOVf3TzBLxwPvvH5rClj7fDlC45-GrwlY-tkFTnALGUWPHAdCJLLLV7ChlykyB-eoH1fhaVYunwz8a2yNkuy9M1TBTHzK5Bz3iSw2ajPGWRPcHNXHPmrbIjTjG97tf1N7DIwG1wR49VpWlvXEtkrCiee2AYQ2X0Q02ciz4CQwFoRchWk85zkhtg1cAAt0v0AoJ2r5w6T_QxGE_v5s0BvuM1dBdz2nEsX9uJL_Vy0fpm_k6-plfElNvQ4g5gYQOipjDWrvLE5xLE6H0qG9F8_RuSwTwN7kednKPi8CTkU8c3_sixNTn_DxzH7QI"

////////////////////////////////////////////////////

const TARGET = "https://taha-mobileport.on.dev.symphony.com";
const APP_AUTH_URL = `${TARGET}/login/pubkey/app/authenticate`;
const APP_USER_AUTH_URL = `${TARGET}/login/pubkey/app/username/${username}/authenticate`;
const GET_MESSAGE_OBO = `${TARGET}/webcontroller/api/v3/messages/thread?ischronological=true&limit=50&id=${threadID}&from=1495602948940`;

const LOGIN_URL = `${TARGET}`


function getAppAuthToken(appJwtToken) {
  console.log("token app:" +appJwtToken)
  const payload = JSON.stringify({ token: appJwtToken });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(APP_AUTH_URL, payload, params);
  return res.json('token'); 
}

function getUserAuthToken(appSessionToken) {
  const payload = JSON.stringify({ token: appSessionToken });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'sessionToken': appSessionToken
    }
  };
  const res = http.post(APP_USER_AUTH_URL, payload, params);
  console.log(res.json('token'))
  return res.json('token');
}

export default function () {

  const appSessionToken = getAppAuthToken(APP_JWT_TOKEN);
  if (!appSessionToken) {
    console.error("Failed to get app session token");
    return; // Stop this iteration if authentication fails
  }

  const userSessionToken = getUserAuthToken(appSessionToken);
  if (!userSessionToken) {
    console.error("Failed to get user session token");
    return;
  }


  const params = {
    headers: {
      'Content-Type': 'application/json',
      'sessionToken': userSessionToken
    }
  };
  const res = http.get(GET_MESSAGE_OBO, params);
  console.log("get obo message result")
  console.log(res.body)
  check(res, {
    'GET messages response code was 200': (r) => r.status == 200,
  });
}

//r2kMPxKdZR+PZqG8k7BTdg