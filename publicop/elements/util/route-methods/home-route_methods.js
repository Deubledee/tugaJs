import { routecallback } from './lib/layer1-route_lib'

if (module.hot) module.hot.accept();

/**
 * @this {appHomePage}
 * @param {routeData, query} 
 */
async function _routePageChanged(routeData, query) {
    if (routeData.page && routeData.page === 'home') {
        window.onbeforeunload = function () { }
        document.querySelector('title').innerHTML = localStorage['app-id'] + '-' + this.routeData.page
        this.page = routeData.page
        if (this.lang !== query.lang) {
            this.lang = query.lang
            this.newSetContent({ requestKey: 'articles' })
            return
        }
        if (!this.categories)
            this.newGetCategories(this.INFO)
                .then(this.setDataSimple.bind(this))
                .then(() => this.setElementsToRender())
                .then(() => this.resolveToInfoData(false))
                .then(() => this.newSetContent({ requestKey: 'articles' }))
                .then(() => this.setInviewTrue([]))
                .catch(console.error);
    }
}

export { routecallback, _routePageChanged }
