import { mixInScope } from '../../lib/methods';
import { ParseAreaInfo, ParseHttp, ParseLangs, ParseSimple, _setStyles, resolveEndpoint2 } from './libs/infoData_lib';

class infoData {
    constructor(infoObject, infoType, infoID) {
        infoObject;
        mixInScope.call(this, {
            ...infoObject,
            areas: ParseSimple(infoObject, 'areas', {}),
            styles: ParseSimple(infoObject, 'styles', undefined),
            langs: ParseLangs(infoObject),
            infoType, infoID, assert: {},
            request: {}, create: {}, update: {},
            resolvedQlQueries: {}, endpoints: {}
        });
        if (!!this.styles) _setStyles.call(this);
        if (!!this.areas.http) ParseHttp.call(this);
        if (!!this.areas.areaInfo) ParseAreaInfo.call(this)
    }
    ResolveCategories() {
        return this.ResolveQueries("categories", 'request')
    }
    RequestArticles(scope, requestKey) {
        this.request[requestKey] = resolveEndpoint2.call(this, requestKey, this.http[requestKey].request, scope)
        return this.ResolveQueries(requestKey, 'request')
    }
    CreateArticles(scope, requestKey) {
        this.create[requestKey] = resolveEndpoint2.call(this, requestKey, this.http[requestKey].create, scope)
        return this.ResolveQueries(requestKey, 'create')
    }
    UpdateArticles(scope, requestKey) {
        this.update[requestKey] = resolveEndpoint2.call(this, requestKey, this.http[requestKey].update, scope)
        return this.ResolveQueries(requestKey, 'update')
    }
    ResolveQueries(requestKey, httpType) {
        try {
            if (requestKey in this.resolvedQlQueries)
                return {
                    assert: this.assert[requestKey],
                    queries: this[httpType][requestKey],
                    expect: this.resolvedQlQueries[requestKey]
                }
        } catch (error) {
            console.log(error);
        }
    }
    checkIfInfoExists(infoID) {
        if (this.infoID !== infoID)
            return false;
        return this;
    }
}

function infoDataFactory(infoObject, infoType, infoID, areas) {
    return new infoData(infoObject, infoType, infoID, areas)
}

export { infoDataFactory };

