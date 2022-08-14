import { graphQlUrl, headers, httpGet, httpPost, getBlob } from '../../js/lib/http-handler';



function _getPages(queries, header = false) {
    this.langs[this.lang] = {}
    return _getCategories(queries, header)
}
function _getCategories(queries, header = false) {
    return httpGet(queries, `${graphQlUrl}pages`, headers(header))
}

function _getArticles2(queries) {
    let result = Promise.all(Object.keys(queries)
        .map(async endpoint => await httpGet(queries[endpoint], `${graphQlUrl}${endpoint}`, headers())))
    return result
}
function _postArticles2(queries) {
    let result = Promise.all(Object.keys(queries)
        .map(async endpoint => await httpPost(queries[endpoint], `${graphQlUrl}${endpoint}`, headers())))
    return result
}

function _getArticles(queries, endpoints, header = false) {
    if (!!endpoints) return Promise.all(Object.keys(queries)
        .map(async endpoint => await httpGet(queries[endpoint], `${graphQlUrl}${endpoint}`, headers())))
    return httpGet(queries, `${graphQlUrl}articles`, headers(header))
}

/**old */
function _postArticles(query, header = false) {
    return httpPost(query, `${graphQlUrl}articles`, headers(header))
}
function _getMedia(query, header = false) {
    return httpGet(query, `${graphQlUrl}media`, headers(header))
}
function _postMedia(query, header = false) {
    return httpPost(query, `${graphQlUrl}media`, headers(header))
}
function _getUsers(queries, header = false) {
    return httpGet(queries, `${graphQlUrl}users`, headers(header))
}
function _postUsers(query, header = false) {
    return httpPost(query, `${graphQlUrl}users`, headers(header))
}

export {
    _getPages,
    _getCategories,
    _getArticles2, _postArticles2,
    _getArticles,
    _postArticles,
    _getMedia,
    _postMedia,
    _getUsers,
    _postUsers
    , getBlob
}
