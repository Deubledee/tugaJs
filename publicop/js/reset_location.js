
import { urlQueryToObject, SetNewUrl } from "./urlQueryToObject";



export function getValidQueries(ignore) {
    const { queries, href } = urlQueryToObject();
    const validQueries = Object.keys(queries).filter((queryKey) => !~ignore.indexOf(queryKey));
    return { queries, validQueries, newHref: href };
}

function resetLocation(queries, validQueries, newHref) {
    newHref = SetNewUrl(queries, validQueries, newHref);
    history.pushState({}, null, newHref);
    return newHref.split(location.origin)[1]
}

export function resetIgnoreQueries(ignore) {
    let { queries, validQueries, newHref } = getValidQueries(ignore)
    return resetLocation(queries, validQueries, newHref)
}
