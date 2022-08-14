import { infoExists } from '../../cacheStates&Listners/infoCache';

function _routePageChanged(page) {
    this.page2 = ''
    this.page = page
}

function _routePage2Changed(page2) {
    if (this.page2 === page2) return
    this.page2 = page2
    let info = infoExists('toolsInfo', page2)
    if (!!info) return this.categorySetter([info], true)
    this.getCategory(this.page2)
        .then(this.categorySetter)
        .catch(console.error)/**/
}

const routeLayers = {
    layer1(route, routeData, query) {
        let page = routeData.page
        setRoute1.call(this, route, routeData, query)
        if (this.views[page] === query.type) return this.views[page]
        return '404'
    },
    layer2(route, routeData, query) {
        let page = routeData.page2
        setRoute2.call(this, route, routeData, query)
        setRoute1.call(this, route, routeData, query)
        if (this.categoryViews[page] === query.view) return this.categoryViews[page]
        return '404'
    }
}
function setRoute1(route, routeData, query) {
    this.route = route
    this.routeData = routeData
    this.query = query
}

function setRoute2(route, routeData, query) {
    this.route2 = route
    this.routeData2 = routeData
    this.query2 = query
}

function resolveLayer(route, routeData, query, views, layer) {
    if (layer in routeLayers) return routeLayers[layer].call(this, route, routeData, query, views)
}

export { resolveLayer, _routePageChanged, _routePage2Changed }
