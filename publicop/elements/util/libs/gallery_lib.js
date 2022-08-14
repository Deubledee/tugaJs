
function getFormData() {
    return this.FormData
}
function getFormDataProperty(Property) {
    return this.FormData[Property]
}
function getGalleryByType(Property) {
    let main = this.FormData[Property[1]]
    let user = this.getUserGallery(this.FormData[Property[1]])
    let gallery = this.FormData[Property[0]] === 'main' ? main : user
    return gallery
}
function getGalleryRoot() {
    return this.galleryRoot
}
function getGallery() {
    let { gallery } = this.query
    return gallery
}
function getUserGallery(galleryName) {
    return `${galleryName}-${this.userGallery}`
}
function userGalleryID() {
    return this.userGallery
}
function getSellected() {
    return this.Sellected
}
function getLang() {
    return this.lang
}
function uncheckTarget(target, warning) {
    if (warning[this.lang] && warning.type === 'alert') alert(warning[this.lang])
    target.removeAttribute('checked')
    return false
}
function checkMultiImage({ multiimage }, { multiImage: warning }, target) {
    if (multiimage === 'false' && !!this.imagesChecked.length)
        return uncheckTarget.call(this, target, warning)
    return true
}
function removeUnchecked(formData) {
    this.PreviedImage = 'n/a'
    return this.imagesChecked = this.imagesChecked.filter(image => (image.title || image.name) !== (formData.title || formData.name));
}
function _resetImagesChecked() {
    this.imagesChecked = []
    this.PreviedImage = 'n/a'
}
function _resetGalleriesChecked() {
    this.galleriesChecked = []
}

function setDefaults(query, save = false) {
    this.lang = query.lang
    this.formCategory = query.view;
    this.setUpStates(query, save);
    this.setElementsToRender('renderToFormTool', `#${this.INFO.id}-form`)
}
function getPreviousLayout() {
    let layout = this.getPreviousLayoutState()
    return layout
}
function getAssetType(EditType) {
    return !!this.query.galleryreform &&
        this.query.galleryreform !== 'form' &&
        this.query.galleryreform !== 'revert-initial' ?
        this.query.galleryreform : EditType;
}
function setAssetType({ imageeditype, galleryeditype }, { EditType }) {
    this.AssetType = !imageeditype && !galleryeditype ? this.getAssetType(EditType) : imageeditype || galleryeditype
}
function setRequestFormKey({ getid }) {
    this.formRequestKey = getid ? getid : this.formRequestKey;
}
function handleWarnings(Checked, warning, { multiimage }) {
    let Warning = false
    if (Checked.length > 1 && multiimage === 'false' || !Checked.length)
        Warning = warning.type === 'alert' && !alert(warning[this.lang])
    else Warning = warning.type === 'prompt' && prompt(warning[this.lang])
    return Warning
}
async function Trash(AssetType, Checked, { assetTypeData }, origin) {
    console.log(AssetType, Checked, assetTypeData, origin)
    this.UPDATE = AssetType;
    let { resetLocation, linkCategory, warnings } = assetTypeData
    let [formTools] = this[linkCategory] || this.toQuery;
    let { reset, reform } = resetLocation
    let { nocontent, saveconfirm } = warnings
    if (!!this.handleWarnings(Checked, nocontent, this.query) ||
        this.handleWarnings(Checked, saveconfirm, this.query) === 'n') return
    await this.GalleryFormControler
        .saveUpdated(AssetType, Checked, formTools, assetTypeData, true)
        .catch(valid => console.log(valid));
    this.FormResolver.resetLocation(reset, { ...reform });/**/
}

function checkForScroll({ scrollbasis, index }) {
    if (!scrollbasis) return false
    let [left, top, behavior] = [0, (parseInt(index) * parseInt(scrollbasis)), "smooth"]
    return { left, top, behavior }
}
function IsPreviewedImageChecked({ contentElement }, layout) {
    if (!!this.PreviedImage.toFixed && !!contentElement && contentElement.children.length && this.query.index) {
        this.checkIndex = this.query.index ? parseInt(this.query.index) : this.PreviedImage
        if (!!contentElement.children[1] && layout === 'column')
            contentElement.children[1].children[this.checkIndex].children[2].children[0].checked = true;
        if (!!contentElement.children[0] && layout === 'row')
            contentElement.children[0].children[this.checkIndex].children[2].children[0].checked = true;
    }
}
async function deleteOrRecycle(Checked, origin, Table) {
    let { linkCategory, warnings } = Table
    let { saveconfirm, nocontent } = warnings
    let [formTools] = this[linkCategory] || this.toQuery;
    if (!!this.handleWarnings(nocontent, this.query) || this.handleWarnings(Checked, saveconfirm, this.query) === 'n') return
    await this.GalleryFormControler
        .saveUpdated(origin, this.imagesChecked, formTools, Table)
        .then(() => setTimeout(() => this.resetMouseEventsState(), 500))
        .then(() => this._resetImagesChecked())
        .catch(valid => console.log(valid));
}

async function setFormInProgress(AssetType, EditState) {
    return await this.GalleryFormControler
        .setcontent(this, EditState, AssetType, this.getFormResolver(), this.formCategory, this.query)
        .then(inProcess => this.resolvers.setForm(inProcess, false, AssetType, this.activeLayout, this.query))
        .catch(valid => console.log(valid))/**/
}

async function getFormInProgress() {
    return this.GalleryFormControler.getFormInProcess()
}
async function setMediaContent(ReForm, getid, update) {
    let EditPage = `gallery-${this.query.gallery}-Asset-${this.AssetType}-ReForm-${ReForm}`
    if (ReForm && getid)
        return await this.getFormResolver()
            .setReformContent(this.toQuery, EditPage, { ReForm, getid, update })
            .catch(console.error)
}
export {
    setMediaContent, getGalleryRoot, checkForScroll, getGalleryByType, getFormDataProperty,
    setRequestFormKey, setAssetType, IsPreviewedImageChecked, handleWarnings, Trash,
    setDefaults, getSellected, getGallery, getAssetType, getPreviousLayout, setFormInProgress, _resetImagesChecked,
    getUserGallery, getLang, getFormData, checkMultiImage, removeUnchecked, getFormInProgress, deleteOrRecycle, _resetGalleriesChecked, userGalleryID
};
