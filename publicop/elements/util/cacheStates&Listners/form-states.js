
const States = {};

function clear(editPage, editarticle) {
    States.Form = {}
    States.Langs = []
    States.Lang = ''
    States.Updated = false
    States.editPage = ''
    States.editArticle = ''
    States.articleLang = ''
    setEditPage(editPage)
    setEditArticle(editarticle)
}
function setUpStates(query, editPage, save) {
    let { editype, cachekey, editarticle, lang } = query
    if (!save) clear(editPage, editarticle)
    else savePreviousState();
    setLangState(lang)
    setEditState(editype, cachekey)
    return States;
}
function getReForm() {
    return States.ReForm
}
function setReForm(ReForm) {
    States.ReForm = ReForm;
}
function getPreviousStates() {
    return States.previous
}
function savePreviousState() {
    States.previous = { ...States.Form };
}
async function revertToPreviousState() {
    let { previous } = States;
    States.Form = previous;
    return States.Form;
}
function setEditState(editype, cachekey) {
    States.Form.cachekey = cachekey
    States.Form.EditState = !!(editype !== 'create');
    States.Form.EditType = editype;
}
function getEditArticle() {
    return States.editArticle
}
function setEditArticle(editArticle) {
    States.editArticle = editArticle;
}
function getQueryState() {
    return States.query;
}
function setQueryState(query) {
    States.query = query;
}
function getLangState() {
    return States.lang;
}
function setLangState(lang) {
    States.lang = lang;
}
function getArticleLangState() {
    return States.articleLang;
}
function setArticleLangState(articleLang) {
    States.articleLang = articleLang;
}
function getEditPage() {
    return States.editPage;
}
function setEditPage(editPage) {
    States.editPage = editPage;
}
function getFormResolver() {
    return States.FormResolver
}
function setFormResolver(FormResolver) {
    States.FormResolver = FormResolver
}
function getLangsState() {
    return States.Langs
}
function setLangsState(lang) {
    States.Langs.push(lang)
}
function getUpdatedState() {
    return States.Updated;
}
function setUpdatedState(Updated) {
    States.Updated = Updated;
}
function getEditState() {
    return States.Form;
}
export {
    getLangState,
    setLangState,
    getLangsState,
    setLangsState,
    setUpStates,
    getEditPage,
    getEditState,
    getQueryState,
    setQueryState,
    getArticleLangState,
    setArticleLangState,
    getEditArticle,
    setEditArticle,
    getUpdatedState,
    setUpdatedState,
    getFormResolver,
    setFormResolver,
    getPreviousStates,
    getReForm,
    setReForm,
    revertToPreviousState
}
