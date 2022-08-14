import { infoDataFactory } from '../classes/infoData_class'

const contentInfo2 = { viewsInfo: [], toolsInfo: [] }

function setInfoData(infoObject, infoType) {
    let infoID = infoType !== 'toolsInfo' ? infoObject.id : infoObject.path
    let infoexists = infoExists(infoType, infoID)
    if (!infoexists) contentInfo2[infoType].push(infoDataFactory(infoObject, infoType, infoID))
    return infoID
}
function getInfo(infoType, infoID) {
    let infoexists = infoExists(infoType, infoID)
    if (!!infoexists) return infoexists
    return { alert: 'set "info" data first', request: { infoType, infoID } }
}
function setInfo(infoType, data) {
    if (data && infoType && data.constructor.name === 'Array')
        return data.map(infoObject => infoObject && setInfoData(infoObject, infoType))
    if (data && infoType && data.constructor.name === 'Object')
        return setInfoData(data, infoType)
    throw `expected typeof Array or Object got: typeof ${infoType} ${data.constructor.name}`
}
function infoExists(infoType, infoID) {
    let info = contentInfo2[infoType].find(info => info.checkIfInfoExists(infoID))
    return info
}
async function setPropertyContentAsInfoData(property, infoType = 'toolsInfo') {
    if (!this[property]) return
    setInfo(infoType, this[property])
    setTypePropertyInfoData.call(this, property, this[property], infoType)
    return
}
function setFormToolInfo({ category, article }, property = 'categories', infoType = 'toolsInfo') {
    setInfo(infoType, category)
    return { category: setTypePropertyInfoData.call(this, property, category, infoType), article }
}
function setTypePropertyInfoData(property, category, infoType = 'toolsInfo') {
    if (category.constructor.name === 'Object')
        return this[property].push(getInfo('toolsInfo', category.path))
    if (category.constructor.name === 'Array')
        return this[property] = category.map(typeCategory => typeCategory && getInfo(infoType, typeCategory.path))
}

export { setPropertyContentAsInfoData, setFormToolInfo, getInfo, setInfo, infoExists }
