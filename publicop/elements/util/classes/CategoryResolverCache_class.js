import { mixInScope } from '../../lib/methods';
import { CategoryResolver } from './Resolver_class-factory';

export class CategoryResolverCache {
    constructor() {
        this.setUp();
    }
    ResolveCategory(scope, page, expect, content) {
        let resolver = CategoryResolver(scope, page, content, expect);
        this._set_Category(page, resolver);
        return resolver;
    }
    _set_Category(page, resolver) {
        if (!this.CategoryResponseCached[page])
            this.CategoryResponseCached[page] = {};
        this.CategoryResponseCached[page] = resolver;
        return false;
    }
    Dump() {
        this.setUp();
        return false;
    }
    isCategoryCacheSet(page) {
        if (!this.CategoryResponseCached[page])
            return false;
        return { control: this, content: this.CategoryResponseCached[page] };
    }
    setUp() {
        mixInScope.call(this, { CategoryResponseCached: {} });
    }
}
