
import { GetPage } from '../../lib/methods';
import { ResolverCacheControl } from '../classes/ResolverCache_class';

const { CategoryCache, ContentCache } = ResolverCacheControl()

function CategoryCacheResolve(scope, page, expect, content) {
    let CacheResolvedContent = CategoryCache.ResolveCategory(scope, page, expect, content)
    return CacheResolvedContent
}
function ContentCacheResolve(scope, content, options) {
    let [page, { lang }] = [!options.form ? GetPage(scope.routeData) : GetPage(scope.formRouteData), scope]
    let CacheResolvedContent = ContentCache.ResolveContent(scope, page, lang, content, options)
    return CacheResolvedContent
}
function isCategoryCacheSet(page) {
    return CategoryCache.isCategoryCacheSet(page)
}
function isContentCacheSet(options) {
    return ContentCache.isContentCacheSet(options)
}
function isContentLangCacheSet(options) {
    return ContentCache.isContentLangCacheSet(options)
}
function checkIsCachedResponse(event) {
    if (Array.isArray(event)) return false
    let { isCached, category } = event
    return !!isCached ? { isCached, category } : {}
}
export {
    CategoryCacheResolve,
    ContentCacheResolve,
    isCategoryCacheSet,
    isContentCacheSet,
    isContentLangCacheSet,
    checkIsCachedResponse
};
