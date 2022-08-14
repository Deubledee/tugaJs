import { getInfoDataByProperty } from '../../lib/methods';
import { mixInScope } from '../../lib/methods';
import getAreaAssetsInfo from './libs/asset-class_lib';

const _AssetCache_ = [];

class Asset {
    constructor(scope, assetType, areas) {
        let assets = getAreaAssetsInfo.call(scope, assetType, areas)
        let checkUndefinedAssets = Object.keys(assets).find(asset => assets[asset] === undefined)
        if (!checkUndefinedAssets) mixInScope.call(this, assets);
    }
}
class AssetsInfo {
    constructor(category, assets) {
        let { rootStyles, rootDefaultStyles } = category;
        this.category = category;
        this.rootStyles = rootStyles;
        this.rootDefaultStyles = rootDefaultStyles;
        if (!!assets.rowMethods)
            this.rowMethods = assets.rowMethods;
    }
}
class AssetCache {
    //,this  assetType, this.INFO.id, categoryType, Category
    constructor(scope, assetType, assetId, categoryType, category) {
        this.AssetId = assetId;
        this.AssetType = assetType;
        this.categoryType = categoryType;
        this.AssetsData = new Asset(scope, assetType, category.areas);
        this.AssetsInfo = new AssetsInfo(category, this.AssetsData);
    }
    data() {
        return this.AssetsData;
    }
    info() {
        return this.AssetsInfo;
    }
    AssetsDataExists(AssetId, AssetType) {
        if (this.AssetId !== AssetId || this.AssetType !== AssetType)
            return false;
        return true;
    }
    AssetsInfoExists(AssetId, categoryType) {
        if (AssetId !== this.AssetId || this.categoryType !== categoryType)
            return false;
        return true;
    }
}
function AssetCacheFactory(assetType, assetId, categoryType, category) {
    return new AssetCache(this, assetType, assetId, categoryType, category);
}
function isCacheSet(assetType, categoryType, category) {
    if (!!assetType)
        return _AssetCache_.find(Cache => Cache.AssetsDataExists(category.id, assetType));
    if (!!categoryType)
        return _AssetCache_.find(Cache => Cache.AssetsInfoExists(category.id, categoryType));
}
function setResponseAssets(assetType, { categoryType, category }) {
    let Category = category || categoryType && getInfoDataByProperty.call(this, categoryType);
    if (!Category) throw 'no category or categoryType was provided';
    let assetId = category.id
    _AssetCache_.push(AssetCacheFactory.call(this, assetType, assetId, categoryType, Category));
}

export { isCacheSet, setResponseAssets }
