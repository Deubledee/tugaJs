import { assertResponse } from '../../../../../js/lib/asserts';
import { _getArticles, _getCategories } from '../../../../lib/app_defalut_http-requests';

async function getCategory(category) {
    let query = `getPageCategory(projectId: "${localStorage['app-id']}", removed: false, category: "${category}", Published: "NP"){
                   ...on Categories {
                        id
                        type
                        path
                        langs
                        areas
                        styles
                        toLogin
                        permitions
                    }
                    ...on Error {
                        errorMessage
                   }
                 }`;
    let result = await _getCategories.call(this, query)
        .then(res => assertResponse('singleType', 'getPageCategory', res, res.json(), 'getPageCategory response returned an errorMessage'))
        .catch(error => { throw error; });
    return result;
}
async function getArticle(category) {
    let query = `getArticleByCategory(projectId: "tugajs", lang: "${this.lang}", category: "${category}", removed: false, Published: "NP" ) {
                    ... on Articles {
                        id
                        type
                        lang
                        permitions
                        articleName
                        description
                        images { title url imageOrder imageLang }
                    }
                    ... on Error { errorMessage }
                  }`;
    let result = await _getArticles(query)
        .then(res => assertResponse('singleType', 'getArticleByCategory', res, res.json(),
            'getArticleByCategory response returned an errorMessage'))
        .catch(error => { throw error; });
    return result;
}

async function getArticleAndCategory(cat) {
    let category, article
    category = await getCategory.call(this, cat)
    article = await getArticle.call(this, cat)
    return { article, category }
}

export { getArticleAndCategory, getCategory, getArticle }
