import { GetPage } from '../../lib/methods';

function getFormArticleId() {
    let [[formTool], { EditType }] = [this.formTools, this.getEditState()]
    if ((!!formTool && !!EditType) && (!!formTool.areas && !!formTool.areas[EditType]) && !!formTool.areas[EditType].articleId)
        return formTool.areas[EditType].articleId
    return 'not defined'
}
function getPreviousEditType() {
    let PreviousStates = this.getPreviousStates()
    return PreviousStates.EditType
}
function getEditArticleId() {
    return this.getEditArticle()
}
function getArticleLang() {
    return this.articleLang
}
function getAuthor() {
    return this.FormControler.getAuthor()
}
function setElementsToRender(name, id) {
    if (!this.ElementsTorender[name])
        this.setElementToRender(name, id)
    return this.ElementsTorender[name]
}
function getFormElement(formType) {
    let formElement = document.querySelector(`#${this.INFO.id}-${formType}`)
    return formElement
}
function setDefaults(query, save = false) {
    this.setUpStates(query, GetPage(this.routeData), save);
    this.setElementsToRender('renderToFormTool', `#${this.INFO.id}-form`)
    this.formToolCacheListkey = `${this.INFO.id}-${query.editype}-${query.formtype}-${query.lang}`;
    this.articleLang = query.articlelang;
    this.editArticle = query.editarticle;
    this.formtype = query.formtype;
    this.formCategory = query.view;
}
async function Validate() {
    let Validate
    await this.FormControler
        .validateSubmitForm("iron-form-submit")
        .then(Valid => Validate = Valid)
        .catch(notValid => Validate = notValid)
    return Validate
}
async function getValidation() {
    let { Valid } = await this.Validate()
    if (!!Valid) return true
    return false
}
async function setReform(ReForm, { getid, preview }) {
    if (!!this.getEditState().EditState && ReForm && (getid || preview)) {
        let articleResolver = await this.getFormResolver()
            .setReformContent(this.toQuery, this.getEditPage(), { ReForm, getid, preview })
            .catch(console.error)
        return articleResolver
    }
    return undefined
}
async function setEdit(cachekey, lang, article, newLang) {
    if (!!this.getEditState().EditState && (!~this.getLangsState().indexOf(lang))) {
        let articleResolver = await this.getFormResolver()
            .setEditContent(this.getEditPage(), { cachekey, lang, article, newLang })
            .catch(console.error)
        this.setLangsState(lang)
        return articleResolver
    }
    return undefined
}
function validateBeforeReset(valid, reform, editype, EditType) {
    if (!!valid && reform && editype !== 'preview' && EditType === 'create')
        valid = prompt('you will loose your work. do you wish to continue? y or n');
    if (!valid && EditType === 'create' && editype === 'preview') //
        valid = ~~!!alert('please edit first');
    return valid;
}
async function routeNewContent(formTools, query) {
    let { editype, reform } = query
    let { Valid, update } = await this.Validate()
    let { EditType } = this.getEditState()
    console.log(Valid, update);
    Valid = validateBeforeReset(Valid, reform, editype, EditType);
    if (EditType !== 'create' && !Valid || Valid === 'n')
        return this.FormResolver.resetLocation(['reform', 'editype'], { editype: EditType })
    this.setDefaults({ ...query }, true)
    let popupId = `${formTools.id}-form`
    let [tools, toolName, toolsKeys, toolsNames] = this.geneReformTools(formTools, editype)
    if (!this.reformedTools)
        await this.newGetCategories(formTools, popupId)
            .then(response => this.setDataSimple(response, 'reformedTools'))
            .then(() => this.setReformTools(tools, toolsKeys))
            .then(() => this.resolveToInfoData([...toolsNames]))
            .then(() => this.ReForm = query.reform)
            .catch(console.error);
    this.setFormArticle(this[toolName])
        .then(options => this.newSetContent(options))
        .catch(console.error)
}

function geneReformTools(formTools, editype) {
    let { tools } = formTools.areas,
        { toolName } = tools[editype] || formTools.areas,
        toolsKeys = Object.keys(tools),
        toolsNames = toolsKeys.map(tool => tools[tool].toolName)
    return [tools, toolName, toolsKeys, toolsNames]
}

export {
    getFormArticleId, getEditArticleId, setEdit, setDefaults, routeNewContent, setReform, Validate, geneReformTools,
    setElementsToRender, getFormElement, getArticleLang, getAuthor, getPreviousEditType, getValidation
}
