import { routecallback } from './lib/layer2-route_lib'

async function _routePageChanged(routeData, query) {
    if (this.debounce) clearTimeout(this.debounce)
    this.debounce = setTimeout(async () => {
        if (routeData.page2 && routeData.page2 === 'article' && !this.ignore) {
            this.page = routeData.page2
            let StateChange = this.checkChangeState(query)
            if (StateChange)
                return this.setStateChange(StateChange, query).catch(console.error)
            if (!this.categories || query.resetview === 'true') {
                if (!!(!query.resetview)) {
                    await this.newGetCategories(this.INFO)
                        .then(response => this.setCategories(response))
                        .catch(console.error)
                    await this.setPage(query)
                        .then(options => this.newSetContent(options))
                        .then(() => this.setAferLoad({}))
                        .catch(console.error)
                }
                if (!(query.resetview) || query.resetview === 'true')
                    this.setArticle(query)
                        .then(options => this.newSetNoLangContent(options))
                        .catch(console.error)
            }
        }
    }, 60);
}
export { routecallback, _routePageChanged }

