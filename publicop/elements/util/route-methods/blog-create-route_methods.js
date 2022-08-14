import { routecallback } from './lib/layer2-route_lib'
/**
 * @this {appBlogCreate}
 * @param {*} 
 */
function _routePageChanged(...args) {
    let query = args[1]
    let [{ view, lang }, edit, preview] = [query, query.edit ? query.edit : false, query.preview ? query.preview : false]
    this.edit = edit
    this.lang = lang
    this.page = view
    if (!!preview) this.setEditPreview()
    document.querySelector('title').innerHTML = localStorage['app-id'] + '-' + this.page
    this.getCategories('singleType', 'getPageCategories')
        .then(getPageCategories => this.setData.call(this, getPageCategories))
        .catch(console.error);
    window.onbeforeunload = function () { return '' }
}

export { routecallback, _routePageChanged }
