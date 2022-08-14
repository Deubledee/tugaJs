//"use strict"
import { removeLastCaracter } from '../elements/lib/methods'

function urlQueryToObject() {
    try {
        const Parts = checkUrlForDefaultSetup()
        let href = `${Parts[0]}?`
        let finalHref = Parts[1].split('=').join(' ').split('&'),
            queries = {};
        finalHref.forEach(href => queries[href.split(' ')[0]] = href.split(' ')[1]);
        return { queries, href };
    } catch (error) {
        window.history.pushState({}, null, `/home?type=home&lang=pt&inview=true`);
    }
}
function checkUrlForDefaultSetup() {
    try {
        let isUrlCorrect = (location.href.split('?').length > 1)
        if (!isUrlCorrect) window.history.pushState({}, null, `/home?type=home&lang=pt&inview=true`);
        return location.href.split('?')
    } catch (error) {
        window.history.pushState({}, null, `/home?type=home&lang=pt&inview=true`);
    }
}
function SetNewUrl(queries, validQueryKey, toUrlString) {
    validQueryKey.forEach(validQueryKey => toUrlString += `${validQueryKey}=${queries[validQueryKey]}&`)
    return removeLastCaracter(toUrlString)
}
function getProcessed(parsedQuery, NewUrls, localProperty) {
    return parsedQuery.processedlink ?
        NewUrls.push(parsedQuery.processedlink) :
        NewUrls.push(localProperty);
}
function getProperties(links, localProperty) {
    return [links[localProperty], links[localProperty].queries];
}
function ParseQuery(parsedQuery, allowed, strings, computed) {
    let ParsedQuery = {};
    let filtered = Object.keys(parsedQuery).filter(query => allowed.find(allow => allow === query));
    filtered.forEach(allow => ParsedQuery[allow] = !!parsedQuery[allow] ? parsedQuery[allow] : '_unset_14');
    if (strings)
        strings.map(queryString => Object.keys(queryString))
            .forEach((string, idx) => ParsedQuery[string] = strings[idx][string]);
    if (computed)
        computed.forEach(computedProperty => Object.keys(computedProperty)
            .forEach((property) => {
                if (!!this[computedProperty[property].method] && this[computedProperty[property].method].call)
                    return ParsedQuery[property] = this[computedProperty[property].method](computedProperty[property].arguments);
            }));
    return ParsedQuery;
}

function setArticleLinks(links, parsedQuery) {
    let NewUrls = []
    Object.keys(links)
        .forEach(localProperty => {
            if (links[localProperty] === 'PROCESSED') return getProcessed(parsedQuery, NewUrls, localProperty)
            let [{ path }, { strings, computed, allowed }] = getProperties(links, localProperty)
            if (!allowed) return
            let ParsedQuery = ParseQuery.call(this, parsedQuery, allowed, strings, computed);
            let queryKeys = Object.keys(ParsedQuery)
            if (path === '*') path = `${location.pathname}?`
            this[localProperty] = SetNewUrl(ParsedQuery, queryKeys, path)
            NewUrls.push(localProperty)
        })
    return NewUrls
}
function setHrefs(query, category, id, FormData) {
    if (query) {
        let [parsedQuery, { links }] = [{ ...query }, category.areas]
        if (!links || !links[id]) return 'no links'
        setFormdataIfNeeded.call(this, FormData);
        let resolved = setArticleLinks.call(this, links[id], parsedQuery)
        return resolved
    }
}
function getLink(methods, Property) {
    let { link, linkCategory } = methods[Property]
    if (link && linkCategory && this[linkCategory]) {
        let [category] = this[linkCategory]
        let linkProperty = setHrefs.call(this, this.query, category, link, methods[Property])
        return { linkProperty, resolvedLink: this[linkProperty], category }
    }
    return {}
}

function setFormdataIfNeeded(FormData) {
    if (FormData) this.FormData = FormData;
}

export { removeLastCaracter, SetNewUrl, setHrefs, urlQueryToObject, setArticleLinks, getLink }


