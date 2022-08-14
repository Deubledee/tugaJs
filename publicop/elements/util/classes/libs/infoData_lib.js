import { removeLastCaracter, _getNoCarigeReturn } from '../../../lib/methods';

function resolveQueryBooleans(queryBoolean) {
    return queryBoolean
        .map(Boolean => Object.keys(Boolean)
            .map(query => ` ${query}: ${Boolean[query]},`)).join('');
}
function resolveQueryStrings(queryStrings) {
    return queryStrings
        .map(strings => Object.keys(strings)
            .map(query => ` ${query}: "${strings[query]}",`)).join('');
}
function resolveQueryComputed(queryComputed, Args, scope) {
    return queryComputed
        .map(Computed => Object.keys(Computed)
            .map(query => {
                let args = !!Args && [...Args[Computed[query]]] || [];
                return !!scope[Computed[query]] && !!scope[Computed[query]].call ?
                    ` ${query}: "${scope[Computed[query]](...args)}",` : '';
            }
            )).join('');
}
function resolveQueryFormComputed(queryComputed, scope) {
    return !!scope[queryComputed.method] && !!scope[queryComputed.method].call ?
        scope[queryComputed.method](queryComputed.resolve) : '';
}
function ResolveQlQuery(ResolvedKey, Qlquery, QlMethod, scope) {
    if (!this.resolvedQlQueries[ResolvedKey])
        this.resolvedQlQueries[ResolvedKey] = [];
    this.resolvedQlQueries[ResolvedKey].push(QlMethod);
    let { strings, booleans, computed, computedArgs, formComputed } = Qlquery[QlMethod].arguments;
    return `${QlMethod}(${removeLastCaracter(
        `${!!formComputed && resolveQueryFormComputed(formComputed, scope) || ''}
        ${!!strings && resolveQueryStrings.call(this, strings) || ''}
        ${!!booleans && resolveQueryBooleans.call(this, booleans) || ''} 
        ${!!computed && resolveQueryComputed.call(this, computed, computedArgs, scope) || ''}`)}){
            ${!!Qlquery[QlMethod].getproperties.length ? `
                ... on ${Qlquery[QlMethod].QLtype} {
                    ${Qlquery[QlMethod].getproperties.join(' ')}                           
                }` : ''}
            ${QlMethod === "Images" ? `
                ... on EMPTY { empty }` : ''}
                ... on Error {
                    errorStatus
                    errorMessage
                 ${formComputed && 'okMessage' || ''}                  
                }            
            }`;
}

function resolveEndpoint2(requestKey, MethodType, scope) {
    let endpoints = {};
    MethodType.forEach(Qlquery => Object.keys(Qlquery)
        .forEach(QlMethod => {
            if (!endpoints[Qlquery[QlMethod].endpoint])
                endpoints[Qlquery[QlMethod].endpoint] = '';
            endpoints[Qlquery[QlMethod].endpoint] += ResolveQlQuery.call(this, requestKey, Qlquery, QlMethod, scope);
        })); /* */
    return endpoints;
}

function resolvePageEndpoint(requestKey, { request }, scope) {
    return request.map(Qlquery => Object.keys(Qlquery)
        .map(QlMethod => ResolveQlQuery.call(this, requestKey, Qlquery, QlMethod, scope))).join();
}

function ParseHttp() {
    this.http = { ...this.areas.http };
    Reflect.deleteProperty(this.areas, 'http');
    let { categories } = this.http;
    if (!!categories && !!categories.request.length) {
        let { assert } = this.http.categories;
        setAssert.call(this, "categories", assert);
        this.request["categories"] = resolvePageEndpoint.call(this, "categories", this.http.categories);
    }
}

function ParseAreaInfo() {
    let { areaInfo } = this.areas
    this.areaInfo = { ...areaInfo };
    Reflect.deleteProperty(this.areas, 'areaInfo');
}

function setAssert(request, assert) {
    this.assert[request] = assert;
}
function ParseLangs(infoObject) {
    return !!Array.isArray(infoObject.langs) && infoObject.langs[0].constructor.name === 'String' ?
        JSON.parse(infoObject.langs[0]) : infoObject.langs.constructor.name === 'Object' ?
            infoObject.langs : undefined;
}
function ParseSimple(infoObject, property, typeUndefined) {
    if (!!infoObject[property] && infoObject[property].constructor.name === 'String' && infoObject[property].length > 1)
        return JSON.parse(infoObject[property]);
    return typeUndefined;
}
function _setStyles() {
    resolveStyles.call(this, 'globalStyles');
    resolveStyles.call(this, 'rootStyles');
}
function resolveStyles(styleType) {
    let [DefaultStyles, MediaQueries] = generateStyleDataType(styleType);
    let MEDIAS = generateMedias(this.styles, styleType);
    this[DefaultStyles] = {};
    this[MediaQueries] = {};
    this[styleType] = {};
    if (!!MEDIAS.length) MEDIAS.forEach(({ scope, Layout, mediaQuery, style }) => {
        if (Layout === 'default') return this[DefaultStyles] = { [scope]: style };
        this[MediaQueries][mediaQuery] = mediaQuery;
        if (!this[styleType][scope]) return this[styleType][scope] = { [Layout]: { [mediaQuery]: style } };
        this[styleType][scope][Layout] = { [mediaQuery]: style };
    });
}
function generateStyleDataType(styleType) {
    let areaTypeScope = styleType === 'rootStyles' ? 'root' : 'global', DefaultStyles = `${areaTypeScope}DefaultStyles`, MediaQueries = `${areaTypeScope}MediaQueries`;
    return [DefaultStyles, MediaQueries];
}
function generateMedias(styles, styleType) {
    let medias, splitEnds = styles[styleType].split('/*scope end*/'), splitMedia = splitEnds.map(scope => scope.split('@media'));
    splitMedia = splitMedia.filter(media => media.length === 4);
    medias = splitMedia.map(resolveMedias);
    return medias;
}
function resolveMedias(media) {
    let [scope, Layout, mediaQuery, style] = media;
    scope = scope.split('scope')[1];
    style = style.split('L*/')[1];
    return { scope, Layout, mediaQuery, style };
}

export {
    resolveEndpoint2,
    ParseHttp,
    setAssert,
    ParseLangs,
    ParseSimple,
    _setStyles, ParseAreaInfo
}
