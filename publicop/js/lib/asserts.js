import { assertMethods } from './assert_methods'

const PrefixTypes = ['update', 'create', 'get', 'set', 'addImage']

async function assertResponse(queryMethodType, expect, res, json, msg) {
    let assertion, responseData;
    if (res.status == 200) {
        await json.then(res => responseData = res.data)
        assertion = assert(queryMethodType, expect, responseData)
        if (assertion.errorMessage && assertion.errorStatus === 'true')
            return Promise.reject(`${msg}: ${assertion.errorMessage}`)
        return Promise.resolve(assertion)
    }
    return Promise.reject(res)
}
function assert(queryMethodType, expect, responseData) {
    let assertion = { errorMessage: '' }
    if (queryMethodType in assertMethods)
        return assertMethods[queryMethodType](assertion, expect, responseData)
    return assertMethods.defaultAssert(assertion, queryMethodType, expect, responseData)
}

export { PrefixTypes, assertResponse }
