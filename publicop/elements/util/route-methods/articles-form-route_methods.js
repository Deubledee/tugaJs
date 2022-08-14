function routecallback(route, routeData, query) {
    if (!!this.time && this.time.constructor.name === 'number') clearTimeout(this.time)
    this.time = setTimeout(() => {
        this.route = route
        this.routeData = routeData
        this.formRouteData = { page: `${query.editype}-${query.formtype}-${this.INFO.id}` }
        this.query = query
        if (!this.LayoutState) this.__InitSetup__()
        if (this.query.formpopup === 'true') return _routePageChanged.call(this, query)
        this.LayoutState.clearEvents()
    }, 60);
}

async function _routePageChanged(query) {
    if (!!this.formTools && query.reform && query.reform !== "revert-initial")
        return this.routeNewContent(this.formTools[0], query)

    if (!this.formTools || query.reform === "revert-initial") {
        this.setDefaults(query)
        if (!query.reform) await this.newGetCategories(this.INFO, 'form')
            .then(response => this.setCategories(response))
            .catch(console.error);
        this.setFormArticle(this.formTools)
            .then(options => this.newSetContent(options))
            .then(() => this.setAferLoad({ form: true }))
            .catch(console.error);
    }
}

export { routecallback }
