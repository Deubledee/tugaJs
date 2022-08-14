import { CategoryResolverCache } from './CategoryResolverCache_class';
import { ContentResolverCache } from './ContentResolverCache_class';


export function ResolverCacheControl() {
    return {
        CategoryCache: new CategoryResolverCache(),
        ContentCache: new ContentResolverCache()
    }
}
