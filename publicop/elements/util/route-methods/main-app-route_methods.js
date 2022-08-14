import { revertTo } from '../../lib/methods';
import { resolveLayer, _routePageChanged, _routePage2Changed } from './lib/main-app-router_lib';
import { getCredentials } from '../../../js/login_lib';

/**
 * @this {mainApp}
 * @param {route, routeData, query, layer} 
 */

async function routecallback(route, routeData, query, layer) {
    if (routeData.page === '404' || routeData.page === '204') return
    if (!!query.galleries) return
    if (!this.views) return firstSetup.call(this, route, routeData, query, layer)
    if (this.lang === query.lang && (query.inview === 'false' && (!query.logedin || query.logedin))) this.resetAppStyles(true)
    if (this.lang !== query.lang) {
        this.setAppLanguage(query)
        await this.getAndSetContent(this.lang)
    }
    setRoute.call(this, route, routeData, query, layer)
}

/**
 * @this {mainApp}
 * @param {route, routeData, query, layer} 
 */
function certifyRoute(route, routeData, query, layer) {
    if (!!this.views) return new Promise((resolve, reject) => {
        if (!!this.views) {
            let layerPage = resolveLayer.call(this, route, routeData, query, this.views, layer)
            let { UserRecord } = getCredentials()
            this.resetAppToolbar(UserRecord.name ? UserRecord : 0)
            if (!!layerPage && layerPage !== '404' && layer === 'layer1')
                return resolve([0, layerPage])
            if (!!layerPage && layerPage !== '404' && layer === 'layer2')
                return resolve([1, layerPage])
            if (layerPage === '404' || routeData.page === '/' || (!routeData.page && !this.views) || query.lang === 'undefined') {
                revertTo('DefaultPage', 'pt')
                reject('reset page ' + layerPage)
            }
        }
    })
}
function setRoute(route, routeData, query, layer) {
    certifyRoute.call(this, route, routeData, query, layer)
        .then(([layer2, layerPage]) => {
            if (!layer2) return _routePageChanged.call(this, layerPage)
            return _routePage2Changed.call(this, layerPage)
        })
        .catch(console.info)
}
async function firstSetup(route, routeData, query, layer) {
    this.setAppLanguage(query)
    this.routeData = routeData
    this.query = query
    let views = await this.getAndSetContent(this.lang)
    if (!!views) {
        this.firstLoad = false
        setRoute.call(this, route, routeData, query, layer)
    }
    this._setMediaMatches()
}

export { routecallback };

