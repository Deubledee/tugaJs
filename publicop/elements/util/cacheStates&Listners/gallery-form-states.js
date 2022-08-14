
const States = {};

function clear(editarticle) {
    States.Form = {}
    States.Updated = false
    setEditGallery(editarticle)
}
function setUpStates(query, save) {
    let { galleryeditype, editarticle, layout, update } = query
    if (!save) clear(editarticle)
    else savePreviousState();
    setSates({ galleryeditype, states: { update, layout } })
    return States;
}

function setSates({ galleryeditype, states }) {
    setEditState(galleryeditype)
    Object.keys(states)
        .filter(state => !!states[state])
        .forEach(state => States[state] = states[state])
}

function getGalleriesCheckedState() {
    return States.galleriesChecked
}
function setGalleriesCheckedState(galleriesChecked) {
    States.galleriesChecked = galleriesChecked
}
function getImagesCheckedState() {
    return States.imagesChecked
}
function setImagesCheckedState(imagesChecked) {
    States.imagesChecked = imagesChecked
}
function getClickedState() {
    return States.clicked
}
function getMouseDownState() {
    return States.mouseDown
}
function setClickedState(clicked) {
    States.clicked = clicked
}
function setMouseDownState(mouseDown) {
    States.mouseDown = mouseDown
}


function getUserGalleryState() {
    return States.UserGallery
}
function setUserGalleryState(UserGallery) {
    States.UserGallery = UserGallery
}
function getUpdateState() {
    return States.update
}
function setUpdateState(update) {
    States.update = update
}
function getCheckedPreviedImageState() {
    return States.PreviedImage
}
function setCheckedPreviedImageState(PreviedImage) {
    States.PreviedImage = PreviedImage
}
function getFormLayoutState() {
    return States.layout
}
function setFormLayoutState(layout) {
    States.layout = layout
}
function getAssetTypeState() {
    return States.AssetType
}
function setAssetTypeState(AssetType) {
    States.AssetType = AssetType
}
function getEditState() {
    return States.Form;
}
function setEditState(galleryeditype) {
    States.Form.EditState = !(galleryeditype.includes('create'));
    States.Form.EditType = galleryeditype;
}
function getRequestKeyState() {
    return States.formRequestKey
}
function setRequestKeyState(formRequestKey) {
    States.formRequestKey = formRequestKey
}
function getReFormGallery() {
    return States.ReForm
}
function setReFormGallery(ReForm) {
    States.ReForm = ReForm;
}
function getPreviousStates() {
    return States.previous
}
function savePreviousState() {
    States.previous = { ...States.Form };
}
function savePreviousLayoutState(layout) {
    States.previousLayout = layout;
}
function getPreviousLayoutState() {
    return States.previousLayout
}
async function revertToPreviousState() {
    let { previous: { EditState, EditType } } = States;
    States.Form = { EditState, EditType };
    return States;
}
function getEditGallery() {
    return States.editGallery
}
function setEditGallery(editGallery) {
    States.editGallery = editGallery;
}
function getQueryState() {
    return States.query;
}
function setQueryState(query) {
    States.query = query;
}
function getGalleryLangState() {
    return States.articleLang;
}
function setGalleryLangState(articleLang) {
    States.articleLang = articleLang;
}
function getFormResolver() {
    return States.FormResolver
}
function setFormResolver(FormResolver) {
    States.FormResolver = FormResolver
}
function getUpdatedState() {
    return States.Updated;
}
function setUpdatedState(Updated) {
    States.Updated = Updated;
}

export {
    getFormLayoutState, getCheckedPreviedImageState, setCheckedPreviedImageState,
    setAssetTypeState, getFormResolver, setUpStates, getUpdateState, getGalleriesCheckedState,
    getQueryState, setQueryState, getGalleryLangState, setGalleryLangState, getImagesCheckedState,
    getAssetTypeState, setFormResolver, getPreviousStates, getReFormGallery, setImagesCheckedState,
    getClickedState, getMouseDownState, setClickedState, setMouseDownState, setGalleriesCheckedState,
    getEditGallery, setEditGallery, getUpdatedState, setUpdatedState, getEditState, getUserGalleryState,
    setReFormGallery, revertToPreviousState, getRequestKeyState, setRequestKeyState, setUserGalleryState,
    savePreviousState, savePreviousLayoutState, getPreviousLayoutState, setFormLayoutState, setUpdateState
}
