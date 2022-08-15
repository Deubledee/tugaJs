
import { assertResponse } from '../../../../js/lib/asserts';
import { _getCategories, _getPages, projectId } from '../../../lib/app_defalut_http-requests';

export function getContent(data) {
    let queries = `getPages(projectId: "${projectId}", removed: false, Published: "NP", lang: "${data}") {
                    ... on Categories {
                      path type id langs pageOrder icon styles areas toLogin permitions
                    }
                    ... on Error {
                        errorMessage
                    }
                }`
    return _getPages.call(this, queries)
        .then(res => assertResponse('singleType', 'getPages', res, res.json(), 'response returned an errorMessage'))
}
export function getCategory(view) {
    let queries = `getPageCategory(projectId: "${projectId}", removed: false, category: "${view}", Published: "NP"){
                   ...on Categories {
                        id type langs path styles areas toLogin permitions pageOrder icon
                    }
                    ...on Error {
                        errorMessage
                   }
                 }`
    return _getCategories.call(this, queries)
        .then(res => assertResponse('singleType', 'getPageCategory', res, res.json(), 'response returned an errorMessage'))
}
