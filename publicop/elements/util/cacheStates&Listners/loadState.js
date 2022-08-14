

/**
 * @param {LoadState}
 * * cahce response arrival
 * @return {Promise} 
 * * when loaded meets expected count
 */

const loadState = { complete: false, count: 0, expected: 0, onLoaded: [], loaded: [], after: [] }

function updateLoadState(response) {
    loadState.loaded.push(response)
    loadState.count = loadState.loaded.length
    if (loadState.expected === loadState.count)
        loadState.complete = true
}
function filterAfter(Expected) {
    return loadState.after.filter(afterExpected => !!afterExpected[Expected])
}
function _LOAD_(Expected, onLoaded, after) {
    if (!loadState.complete && (!!(!!after && loadState.loaded[after]) || !!onLoaded)) return loadState.onLoaded.push(onLoaded)
    let resolveAfter = filterAfter(Expected)
    if (!!resolveAfter.length) resolveAfter.forEach(afterExpected => afterExpected[Expected]())
    if (loadState.complete) {
        if (!!loadState.onLoaded.length) loadState.onLoaded.forEach(OnLoaded => OnLoaded())
        if (!!onLoaded && !after) onLoaded()
    }
}
function loadControl(response) {
    updateLoadState(response)
    return {
        onLoaded() {
            return new Promise((resolve) => {
                _LOAD_(response, resolve)
            })
        },
        onArrival() {
            return new Promise(function (resolve) {
                resolve()
                _LOAD_(response)
            })
        },
        onAfter(afterExpected) {
            return new Promise(function (resolve) {
                loadState.after.push({ [afterExpected]: resolve })
                _LOAD_(response, resolve, afterExpected)
            })
        }
    }
}

loadControl.set = function reset(expected) {
    loadState.expected = expected
    loadState.loaded = []
    loadState.after = []
    loadState.count = 0
}
export { loadControl }
