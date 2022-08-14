
import { isCacheSet, setResponseAssets } from '../classes/asset-class.js';


function getAssetsType(assetType, category) {
    let AssetsData = isCacheSet.call(this, assetType, false, category)
    if (!!AssetsData) return AssetsData.data()
    return { alert: 'set "AssetsData" first', request: { assetType, AssetsData } }
}

function getResponseInfoData(categoryType, category) {
    let AssetsInfo = isCacheSet.call(this, false, categoryType, category)
    if (!!AssetsInfo) return AssetsInfo.info()
    return { alert: 'set "AssetsInfo" first', request: { categoryType, AssetsInfo } }
}


export { getAssetsType, getResponseInfoData, setResponseAssets, isCacheSet }
