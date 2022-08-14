"use strict";
import { mixInScope } from '../../lib/methods';

export class CategoryResolverFactory {
    constructor(scope, page, content, expect) {
        mixInScope.call(this, { page, content, expect });
        this.scope = scope;
    }
    get() {
        return this.content;
    }
    match(page) {
        return !!(this.page === page);
    }
}
