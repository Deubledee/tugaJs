import { ToIgonoreOrNotToIgnore } from "./route-ignores";

function routecallback(route, routeData, query) {
    this.route = route
    this.routeData = routeData
    this.query = query
    if (!this.LayoutState) this.__InitSetup__()
    let { ignore, dontIgnore } = ToIgonoreOrNotToIgnore(query)
    if (!!ignore) return this.ignore = true
    if (!!dontIgnore || query.resetview === 'true') this.ignore = false
    if (query.view === this.INFO.path)
        return this._routePageChanged(routeData, query)
    this.LayoutState.clearEvents()
}

export { routecallback }
