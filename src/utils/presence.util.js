import http from 'k6/http';

//Target to change by hand
const TARGET = process.env.TARGET;


const HEART_BEAT_UTL = `${TARGET}/datafeed/push/heartbeat`
const PRESENCE_UPDATE = `${TARGET}/datafeed/presence/update`

export function heartBeat(active, df, userId, csrf_token, authenticationToken) {
    // in order to clear cookies form last call
    http.cookieJar().clear()
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'x-symphony-csrf-token': csrf_token,
        "Authorization": `Bearer ${authenticationToken}`
    }
    const res = http.post(`${HEART_BEAT_UTL}?active=${active}&df=${df}&userId=${userId}`, "{}",  {headers})
    return res.status
}

export  function updatePresence(category, userId, resetAt, csrf_token, authenticationToken) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'x-symphony-csrf-token': csrf_token,
        "Authorization": `Bearer ${authenticationToken}`
    }
    const body = {
        category,
        userid: userId,
        resetAt
    }
    const res = http.asyncRequest('PUT', `${PRESENCE_UPDATE}`, JSON.stringify(body), {headers})
    return res
}