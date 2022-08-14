"use strict";
import { formResolverFactory } from './formResolver_class';
import { ContentResolverFactory } from './ContentResolver_class';
import { CategoryResolverFactory } from './CategoryResolver_class';

export function ContentResolver(scope, lang, content, options) {
    return new ContentResolverFactory(scope, lang, content, options);
}

export function formResolver(scope, page, content, ContentResolverCache, options) {
    return new formResolverFactory(scope, page, content, ContentResolverCache, options);
}

export function CategoryResolver(scope, page, content) {
    return new CategoryResolverFactory(scope, page, content);
}

