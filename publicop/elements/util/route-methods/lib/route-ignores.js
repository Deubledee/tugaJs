const ignores = ['galleries', 'formpopup']

function ToIgonoreOrNotToIgnore(query) {
    let ignore = ignores.find(ignore => query[ignore] === 'true'),
        dontIgnore = ignores.find(ignore => query[ignore] === 'false')
    return { ignore, dontIgnore }
}

export { ToIgonoreOrNotToIgnore }
