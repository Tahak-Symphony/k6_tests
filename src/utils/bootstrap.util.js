import http from 'k6/http';

//Target to change by hand
const TARGET = process.env.TARGET;


const BOOTSTRAP_URL = `${TARGET}/client-bff/v1/bootstrap`

export function bootstrap(csrf_token, authorization) {
    const headers = {
        'x-symphony-csrf-token': csrf_token,
        "Authorization": `Bearer ${authorization}`
    }
    const res = http.get(BOOTSTRAP_URL, {headers}).json()
    return res
}