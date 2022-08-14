import { mixInScope } from '../../lib/methods';
import { ContentResolver, formResolver } from './Resolver_class-factory';

export class ContentResolverCache {
    constructor() {
        this.setUp();
        this.cachedError = {}
    }
    setUp() {
        mixInScope.call(this, { Cache: {}, ContentLangCached: {}, ContentResponseCached: {} });
        return this.Cache;
    }
    ResolveContent(scope, page, lang, content, options) {
        if (!content) throw new Error(`"No content" - responseName: ${options.responseName}, page: ${page}, lang: ${lang}, content: ${content}`);
        let ErrorStatus = this.checkErrorStatus(scope, page, content, { lang, ...options })
        if (ErrorStatus.hasError) return ErrorStatus
        let isCached = !options.noLang ?
            this.langContentCached(page, options.responseName, lang, options.update) :
            this.contentCached(page, options.responseName, options.update);
        if (!!isCached && !options.update) return isCached;
        if (!!options.update) this.UpdateCache(page, options.responseName)
        let resolver = this.cacheContent(scope, lang, content, options);
        this._SetupCache(page, lang, options, resolver);
        return resolver;
    }
    cacheContent(scope, lang, content, options) {
        let resolver = !options.form ?
            ContentResolver(scope, lang, content, options) :
            formResolver(scope, lang, content, this, options);
        return resolver;
    }
    checkErrorStatus(scope, page, content, options) {
        let CachedError = this.hasCachedError(page, options)
        if (CachedError.hasError) return CachedError
        let Res = Array.isArray(content), hasError = false
        if (Res) hasError = !!content.length ? content[0].errorStatus === 'true' : !!content.length
        if (!!hasError) return this.hasError(scope, page, content, options)
        return hasError
    }
    hasCachedError(page, { articleName }) {
        let cachedError = false
        if (!!this.cachedError[page])
            cachedError = this.cachedError[page].find(errorCached => errorCached.articleName === articleName)
        if (!cachedError) return !!cachedError
        let { resolver } = cachedError
        return { hasError: () => resolver }
    }
    hasError(scope, page, content, options) {
        let { noLang, lang, responseName, articleName } = options
        if (!this.cachedError[page]) this.cachedError[page] = [];
        let resolver = this.cacheContent(scope, lang, content, {
            responseName: `hasError-${responseName}-${articleName}`,
            articleName, noLang
        });
        this.cachedError[page].push({ resolver, articleName })
        return { hasError: () => resolver }
    }
    UpdateCache(page, responseName) {
        let UpdatedCache
        if (!!this.Cache[page])
            UpdatedCache = this.Cache[page].filter(Resolver => !Resolver.match({ responseName }))
        this.Cache[page] = UpdatedCache
        return false
    }
    langContentCached(page, responseName, lang, update) {
        let isSet = false;
        if (!!this.Cache[page] &&
            !!this.ContentLangCached[page] &&
            !!this.ContentLangCached[page][lang]) {
            if (!update) isSet = this.Cache[page].find(Resolver => Resolver.match({ lang, responseName }));
        }
        return isSet;
    }
    contentCached(page, responseName, update) {
        let isSet = false;
        if (this.Cache[page]) {
            if (!update) isSet = isSet = this.Cache[page].find(Resolver => Resolver.match({ responseName }));
        }
        return isSet;
    }
    UpdateCache(page, responseName, lang) {
        let UpdatedCache
        if (!!this.Cache[page]) UpdatedCache = this.Cache[page].filter(Resolver => !Resolver.match({ lang, responseName }))
        this.Cache[page] = UpdatedCache
        return false
    }
    _SetupCache(page, lang, { responseName, category }, resolver) {
        this._presetIfNeeded(page);
        this._setCacheContent({ page, Resolver: resolver });
        this._setContentLangCached({ page, lang });
        this._setContentResponseCached({ page, responseName, category });
        return false;
    }
    _presetIfNeeded(page) {
        if (!!this.Cache[page]) return;
        this.Cache[page] = [];
        this.ContentLangCached[page] = {};
        this.ContentResponseCached[page] = {};
    }
    _setContentResponseCached({ page, responseName, category }) {
        this.ContentResponseCached[page][responseName] = { isCached: true, category };
    }
    _setCacheContent({ page, Resolver }) {
        this.Cache[page].push(Resolver);
    }
    _setContentLangCached({ lang, page }) {
        this.ContentLangCached[page][lang] = true;
    }
    assertCached(ResolvedRequests, MethodType, page, ...args) {
        let cached = ResolvedRequests.map(responseName => this[MethodType](page, responseName, ...args));
        let assertion = cached.find(defined => !!defined);
        let content = this.getEfetiveRequests(page, ResolvedRequests);
        return !assertion ? !!assertion : { control: this, content };
    }
    getEfetiveRequests(page, ResolvedRequests) {
        let EfectiveRequests = {};
        let cachedResponses = this.ContentResponseCached[page];
        if (!!cachedResponses) ResolvedRequests.
            forEach(response => EfectiveRequests[response] = cachedResponses[response]);
        return EfectiveRequests;
    }
    isContentCacheSet({ page, ResolvedRequests, update }) {
        let cached = !update ? this.assertCached(ResolvedRequests, 'contentCached', page) : false;
        return cached;
    }
    isContentLangCacheSet({ lang, page, ResolvedRequests, update }) {
        let cached = !update ? this.assertCached(ResolvedRequests, 'langContentCached', page, lang) : false;
        return cached;
    }
    filterCache({ lang, page, cachekey }) {
        let ResolvedRequests = [cachekey]
        let cache = this.getCachedContent({ lang, page, ResolvedRequests })
        if (!!cache && !!cache.length)
            return cache.find(ContentResolver => ContentResolver.getMatch(lang, cachekey));
        return cache
    }
    getCachedContent({ lang, page, ResolvedRequests }) {
        if (this.isContentLangCacheSet({ lang, page, ResolvedRequests }))
            return this.Cache[page];
        return false
    }
    Dump() {
        this.setUp();
        return false;
    }
}
