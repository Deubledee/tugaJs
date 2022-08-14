import { headers, graphQlUrl, httpGet, httpPost } from '../../../../js/lib/http-handler';
import { assertResponse } from '../../../../js/lib/asserts';

async function getChecksum(checksum, projectId = "tugajs") {
    let query = `getChecksum(projectId: "${projectId}", gallery: "${projectId}", checksum: "${checksum}") {
                    ... on checksums {
                        fileName
                        filepath                        
                    }
                     ... on EMPTY {
                        empty
                    }
                    ... on Error {
                        errorStatus,
                        errorMessage
                    }
                }`
    return await httpGet(query, `${graphQlUrl}media`, headers(false))
        .then(res => assertResponse('singleType', 'getChecksum', res, res.json(), 'getChecksum response returned an errorMessage'))
        .catch(error => { throw error })
}

async function setChecksum(checksum, data) {
    let query = `setChecksum(projectId: "tugajs", gallery: "tugajs", checksum: "${checksum}", checksumData:"${data}") {
                    ... on Error {
                        errorStatus,
                        errorMessage,
                        okMessage
                    }
                }`
    return await httpPost(query, `${graphQlUrl}media`, headers(false))
        .then(res => assertResponse('singleType', 'setChecksum', res, res.json(), 'setChecksum response returned an errorMessage'))
        .catch(error => console.log(error))
}
export { setChecksum, getChecksum }
