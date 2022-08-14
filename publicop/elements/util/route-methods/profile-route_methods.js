import { routecallback } from './lib/layer2-route_lib'
/**
 * @this {appUserProfile}
 * @param {routeData, query} 
 */
function _routePageChanged(routeData, query) {
    if (routeData.page && routeData.page === 'user') {
        window.onbeforeunload = function () { }
        document.querySelector('title').innerHTML = localStorage['app-id'] + '-user profile'
        this.page = routeData.page
        if (this.lang !== query.lang) {
            this.lang = query.lang
            return this.setContent()
        }
        if (!this.categories) return this.getCategories('singleType', 'getPageCategories')
            .then(this.setDataSimple.bind(this))
            .then(() => void this.setPropertyContentAsInfoData('categories'))
            .catch(console.error);
        if (!!query.hasprofile && query.editprofile)
            this.setEdit(query)
    }
}
export { routecallback, _routePageChanged }
