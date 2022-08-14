import { shouldRequestCategories, ReformNewContentType, getGalleriesReformTools, resolveGaleriesReforms } from "./lib/gallery-route_lib"

/**
 * @this {appGalleryPage}
 * @param {route, routeData, query} 
 */
function routecallback(route, routeData, query) {
    this.route = route
    this.routeData = { page: 'galleries' }
    this.formRouteData = { page: `galleries-${this.INFO.id}` }
    this.callerRouteData = routeData
    this.query = query
    if (!this.LayoutState) this.__InitSetup__()
    if (this.query.galleries === 'true')
        return _routePageChanged.call(this, query)
    this.LayoutState.clearEvents()
}
/**
 * @this {appGalleryPage}
 * @param {query} 
 * 
 */
async function _routePageChanged(query) {
    if (!!this.categories && query.galleryreform !== "revert-initial")
        return ReformNewContentType.call(this, query).catch(console.error)
    if (shouldRequestCategories.call(this, query)) {
        if (!query.galleryreform) await this.newGetCategories(this.INFO)
            .then(response => this.setCategories(response))
            .then(() => getGalleriesReformTools.call(this))
            .then(({ response: r, reformeToolsID: i, Options: o }) => resolveGaleriesReforms.call(this, r, i, o))
            .catch(console.error)
        if (!query.galleryreform || query.galleryreform === "revert-initial")
            return await this.setPage(query)
                .then(options => this.newSetContent(options))
                .then(() => this.setAferLoad({}))
                .then(() => this.ReFormGallery = query.galleryeditype)
                .catch(console.error)
        this._routePageChanged(query)
    }
}
async function routeNewContent(formTools, query, Options) {
    let { reformTools, popupId, reformeToolsID } = Options;
    let ToolName = reformTools.at(1)
    this.setRequestFormKey(query);
    this.setDefaults({ ...query }, true);
    if (!this[reformeToolsID])
        await this.newGetCategories(formTools, popupId)
            .then(response => resolveGaleriesReforms.call(this, response, reformeToolsID, Options))
            .catch(console.error);
    if (ToolName && !!this[ToolName])
        this.setFormArticle(this[ToolName], query)
            .then(options => this.newSetContent(options))
            .catch(console.error);
}
export { routecallback, routeNewContent }
