
const _GetTypes_ = {
    WithAssets: {
        arr: [
            "preview",
            'edit',
            'create',
            'recycle',
            'trash',
            'previewer',
            'draft',
            'galleries'
        ],
        method: getTypeWithFormTable
    },
    dubleTable: {
        arr: [
            "dropover",
            "list"
        ],
        method: getTypeDubleTable
    },
    NoAssets: {
        arr: [0],
        method: getTypeNoAssets
    },
    ChooseImage: {
        arr: ['images'],
        method: getTypeChooseImage
    }
}

function getAreaAssetsInfo(assetType, category) {
    let getTypeMethod = Object.keys(_GetTypes_)
        .filter(getType => filterGetType(getType, assetType))
        .map(getType => _GetTypes_[getType].method)
    for (let TypeMethod of getTypeMethod) return TypeMethod.call(this, category, assetType)
}
function getTypeWithFormTable(category, assetType) {
    let Listners = getListners(category);
    if (!category[assetType]) return { ...category, ...Listners };
    if (!category[assetType].formTable) return { formTable: category.formTable, ...category[assetType], ...Listners };
    return { ...category[assetType], ...Listners };
}
function getTypeDubleTable(category, assetType) {
    let Listners = getListners(category);
    let newCategory = {}
    Object.keys(category)
        .filter(param => param !== 'dubleTable' && param !== 'methods' && param !== 'formTemplates')
        .forEach(param => newCategory[param] = category[param])
    if (category.dubleTable[assetType] && category.methods[assetType] && category.formTemplates[assetType])
        return { ...newCategory, formTemplate: category.formTemplates[assetType], methods: { ...category.methods[assetType] }, formTable: category.dubleTable[assetType], ...Listners };
    return { ...category, ...Listners };
}

function filterGetType(getType, assetType) {
    return !!~_GetTypes_[getType].arr.indexOf(assetType)
}
function getTypeChooseImage(category, assetType) {
    let { chooseImage } = !!this.requestcategory
        && this.requestcategory.areas.constructor.name === "Object" ? this.requestcategory.areas : {};
    return getTypeWithFormTable({ ...chooseImage, ...category }, assetType);
}

function getTypeNoAssets(category, assetType) {
    let Listners = getListners(category);
    if (category[assetType]) return { ...category[assetType], ...Listners };
    return { ...category, ...Listners };
}
function getListners(category) {
    let Listners = { listners: category.listners ? category.listners : '_unset_' };
    return Listners;
}

export default getAreaAssetsInfo
