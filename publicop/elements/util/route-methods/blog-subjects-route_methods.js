"use strict";
import { routecallback } from './lib/layer2-route_lib'
/**
 * @this {appBlogSubjects}
 * @param {routeData, query} 
 */
async function _routePageChanged(routeData, query) {
    if (routeData.page2 && routeData.page2 === 'subjects' && !this.ignore) {
        this.page = routeData.page2
        if (this.checkChangeState(query)) return this.setStateChange(query)
            .catch(console.error)
        if (!this.categories || query.resetview === 'true') {
            if (!query.resetview)
                await this.newGetCategories(this.INFO)
                    .then(response => this.setCategories(response))
                    .catch(console.error)
            if (!query.resetview || query.resetview === 'true')
                await this.setPage(query)
                    .then(options => this.newSetContent(options))
                    .then(() => this.setAferLoad({}))
                    .catch(console.error)
        }
        if (query.subject && this.subject !== query.subject)
            this.setArticles(query)
                .then(options => this.newSetNoLangContent(options))
                .then(() => this.resolvers.updateSubject({ resetview: !!this.subject }))
                .catch(console.error)
    }
}

export { routecallback, _routePageChanged }


