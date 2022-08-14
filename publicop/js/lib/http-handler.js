/**
 ** graphQl urls
 */
//? 'http://localhost:5010/tugajs-t6-app/europe-west2/',
//? "https://europe-west2-tugajs-t6-app.cloudfunctions.net/",
//? "https://europe-west2-tysix-cms.cloudfunctions.net/"
//? "http://localhost:5000/tysix-cms/europe-west2/"

const graphQlUrl = "http://localhost:5000/tysix-cms/europe-west2/"

const _HEADERS_ = new Headers({
    'Access-Control-Allow-Origin': "http://localhost:5000/tysix-cms/europe-west2",
    'Content-Type': 'application/json',
    "Accept": "application/json",
    "tysix-env": "development",
    'Access-Control-Allow-Methods': 'POST',
    'Tysix-licence-Origin-Control': "waSyAApWxIz5IhAZ4-tySix-CMS_@Copyright",
    "tysix-api-origin-control": "AIzaSyDUuOAz-4Tl8iGD3UgtlXurPxYH8tAVmMY"
})

function headers(customOptions = undefined) {
    if (!!customOptions) Object.keys(customOptions).forEach(header => _HEADERS_.append(header, customOptions[header]))
    return _HEADERS_
}

function request(url, method, headers, query) {
    var req = { method: method, headers }
    if (!!query) req.body = JSON.stringify({ query })
    return fetch(url, req)
}

function httpGet(queries, ulr, headers, method = 'POST') {
    let formData = `{${!!queries.join ? queries.join("\n") : queries}}`
    return request(ulr, method, headers, formData)
}
function httpPost(queries, url, headers) {
    let formData = `mutation {${!!queries.join ? queries.join("\n") : queries}}`
    return request(url, 'POST', headers, formData)
}

async function getBlob(url) {
    return request(url, 'GET', {}, false).then(req => req.blob())
}
export { request, httpGet, httpPost, getBlob, headers, graphQlUrl };
