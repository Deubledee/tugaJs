import { mixInScope } from '../../lib/methods';

class AssetEvent {
    constructor(eventType, target, table, formData, property = false, origin) {
        let Table = table
        mixInScope.call(this, { origin, eventType, formData, assetName: property })
        this.target = target
        this.Table = Table
    }
}
function AssetEventFactory(evt, table, formData, property, origin) {
    let [{ target }, eventType] = [evt, evt.type]
    if (!eventType) eventType = 'n/a'
    return new AssetEvent(eventType, target, table, formData, property, origin);
}

class localDataEvent {
    constructor(AssetEvent, target) {
        mixInScope.call(this, { ...AssetEvent })
        this.target = target
    }
}
function localDataEventFactory(localEeventData, target) {
    return new localDataEvent(localEeventData, target);
}

export { AssetEventFactory, localDataEventFactory }
