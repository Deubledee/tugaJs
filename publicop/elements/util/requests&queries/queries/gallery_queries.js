import { getCredentials } from '../../../../js/login_lib';

function getGqlRequestMethod() {
    let gqlRequestMethod = Object.keys(this.areas.tools.requestsPermitions)
        .filter(Permitions => this.areas.tools.requestsPermitions[Permitions]
            .find(role => role === getCredentials().UserRecord.role)).pop()
    return gqlRequestMethod
}

export function articlesQueries(data = []) {
    if (data.length) {
        this.activeGalleryMethod = getGqlRequestMethod.call(this)
        let media = `${this.activeGalleryMethod}(projectId: "${localStorage['app-id']}", galleryRoot:"${this.galleryRoot}", removed: false) {
                ... on Gallery {
                        galleryName
                        imageCount
                        permitions
                        ownerID                        
                        type
                        id
                        lastUpdated {
                            timeStamp
                            imageUpated {
                            title
                            url
                            size
                            }
                        }
                        author {
                            uid
                            name
                        }
                    }
                ... on EMPTY {  empty }
                ... on Error { errorStatus errorMessage }
                }`

        let articles = data.map(category => {
            let name = category.type.split('')
            name[0] = name[0].toUpperCase()
            name = name.join('')
            if (name !== 'Tools')
                return `getArticle${name}(projectId: "tugajs", removed: false, lang: "${this.lang}", Published: "NP", category: "${category.path}") {
                  ... on Articles {
                       categories id articleName description type lang  permitions images { title url imageOrder imageLang}
                    }
                    ... on Error {  errorMessage }
                  }`
        })
        return { articles, media }
    }
}

export function categoriesQueries() {
    if (this.INFO.type === 'media') {
        return `getPageCategories(projectId: "tugajs", page: "${this.INFO.id}", removed: false, Published: "NP", toArticle: "A") {
                        ... on Categories {
                            id type langs path styles areas permitions
                        }
                        ... on Error {
                            errorMessage
                        }            
                    }
                getPageCategoriesByType(projectId: "tugajs", page: "${this.INFO.id}", removed: false, Published: "NP", type: "tools") {
                    ...on Categories {
                        id type langs path styles areas pageOrder icon toLogin permitions
                    }
                    ...on Error {
                        errorMessage
                    }
                }`
    }
    console.error('type error: ' + this.INFO.type)
}

