import { routecallback } from './lib/layer1-route_lib'

/**
 * @this {appBlogPage}
 * @param {routeData, query} 
 */
async function _routePageChanged(routeData, query) {
    window.onbeforeunload = function () { }
    document.querySelector('title').innerHTML = localStorage['app-id'] + '-' + this.type
    if (routeData.page && routeData.page === 'blog' && !this.ignore) {
        this.page = routeData.page
        let StateChange = this.checkChangeState(query)
        if (StateChange) return this.setStateChange(StateChange, query)
            .catch(console.error)
        if (!this.categories || query.resetview === 'true') {
            if (!!(!query.resetview)) {
                await this.newGetCategories(this.INFO)
                    .then(response => this.setCategories(response))
                    .catch(console.error)/**/
                await this.setPage(query)
                    .then(options => this.newSetContent(options))
                    .then(() => this.setAferLoad({}))
                    .catch(console.error)/**/
            }
            if (!(query.resetview) || query.resetview === 'true')
                this.setArticles()
                    .then(options => this.newSetNoLangContent(options))
                    .catch(console.error)/**/
        }
    }
}

export { routecallback, _routePageChanged }
