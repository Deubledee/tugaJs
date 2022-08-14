export function articlesQueries(data = []) {
    if (data.length) {
        let articles = data.map(item => {
            let name = item.type.split('')
            name[0] = name[0].toUpperCase()
            name = name.join('')
            return `getArticle${name}(projectId: "tugajs", removed: false, lang: "${this.lang}", Published: "NP", category: "${item.path}") {  
                 ... on Articles {
                    categories id articleName description type permitions images { title url imageOrder imageLang }
                 }
                 ... on Error {
                     errorMessage
                 }
               } `
        })
        let users = [`getUserProfile(projectId: "tugajs", uid: "${atob(this.query.profile).split('-')[1]}") {
            ... on userProfile { 
                name userScreenID email avatar address ocupation phoneNumber bio uid linkedAccounts
                updatedArticles { dateUpdated article } publishedArticles { datePublished article } metadata { creationTime } 
            }
            ... on Error { errorStatus errorMessage }  }`]
        return { articles, users }
    }
}

export function categoriesQueries() {
    if (!!this.type && this.type === this.query.type) {
        return `getPageCategories(projectId: "tugajs", page: "${this.INFO.id}", removed: false, Published: "NP", toArticle: "A") {
                        ... on Categories {
                            id type langs path permitions areas styles
                        }
                        ... on Error {
                            errorMessage
                        }            
                    }`
    } else {
        throw 'types do not match: ' + this.type + ' ' + this.query.type
    }
}
