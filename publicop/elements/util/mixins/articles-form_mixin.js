import {
    createCategoryPropertyFrom, extention, getInfoDataByProperty, mixInScope, setDataSimple,
    resolveToInfoData, setCustomToolsAsInfoData, setDataWithTools, setCustomToolFrom,
    setElementToRender, showToolArticle, toggleSpinner, setReformTools
} from '../../lib/methods';
import * as States from '../cacheStates&Listners/form-states';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import { articleFormControl } from '../classes/article-form-control';
import * as libMixin from '../libs/article-form_lib';
import * as resolvers from '../resolvers/articles-form_resolver';
import * as route_methods from '../route-methods/articles-form-route_methods';
import * as mouseDownEventControler from '../cacheStates&Listners/mouseDownEventControler';


const methodsToInclude = {
    ...mouseDownEventControler, ...States, ...route_methods, ...libMixin, toggleSpinner, setLayoutState, setDataSimple,
    createCategoryPropertyFrom, showToolArticle, resolveToInfoData, setDataWithTools,
    setCustomToolsAsInfoData, setPropertyContentAsInfoData,
    getInfoDataByProperty, setElementToRender, setCustomToolFrom, setReformTools
}

export const Methods = appBlogSubjectsForm => class extends extention(appBlogSubjectsForm) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        mixInScope.call(this, methodsToInclude)
        mixInScope.call(this, resolvers, this.resolvers)
        this.activeLayout = 'column'
        this.showActiveFormTitle = false
        this.articleLang = this.lang
        this.SubjectsChecked = []
        this.setListners = true
        this.ElementsTorender = {}
        this.FormControler = articleFormControl();
    }
    get ReForm() {
        return this.getReForm()
    }
    set ReForm(ReForm) {
        this.setReForm(ReForm)
    }
    get FormResolver() {
        return this.getFormResolver()
    }
    set FormResolver(FormResolver) {
        this.setFormResolver(FormResolver)
    }
    get query() {
        return this.getQueryState()
    }
    set query(query) {
        this.setQueryState(query)
    }
    get lang() {
        return this.getLangState()
    }
    set lang(lang) {
        this.setLangState(lang)
    }
    get articleLang() {
        return this.getArticleLangState()
    }
    set articleLang(articleLang) {
        this.setArticleLangState(articleLang)
    }
    get Updated() {
        return this.getUpdatedState()
    }
    set Updated(Updated) {
        this.setUpdatedState(!!Updated)
    }

    setCategories(response) {
        this.setDataWithTools(response, ['form'])
        this.resolveToInfoData(['tools', 'formTools'])
    }
    async setFormArticle(customTool) {
        window.onbeforeunload = function () { return '' }
        this.toQuery = customTool
        let options = this.getOptions(this.toQuery, "form-article")
        return options
    }
    getOptions(ToQuery, requestKey) {
        return { ToQuery, requestKey }
    }
    Close() {
        this.Updated = false
        window.onbeforeunload = function () { }
        this.FormControler.reset()
        this.defaultcancel()
    }
    setForm() {
        this.assetType = this.getEditState().EditType
        this.showActiveFormTitle = false
        this.setFormControl()
        toggleSpinner(false)
    }
    async setFormControl() {
        let lang = this.articleLang || this.lang, articleResolver
        let { EditType, EditState } = this.getEditState()
        if (EditType !== 'preview' && EditType !== 'create' && this.query.reform !== "revert-initial")
            articleResolver = await this.CheckFormMethod(lang, EditType, this.query)
        let options = { formOnly: false, layout: this.activeLayout }
        this.FormControler
            .setcontent(this, lang, EditState, EditType,
                this.getFormResolver(), this.formCategory)
            .then(inProcess => this.resolvers.setForm(inProcess, lang, options))
            .catch(valid => console.log(valid))
    }
    async _setArticleLang({ formData }) {
        let { createLang, Valid } = await this.Validate(), articleResolver
        if (createLang) return alert('save lang first close and open.')
        if (!Valid) return
        let [lang, articleLang] = [this.lang, formData.value]
        this.lang = this.articleLang = articleLang
        if (!!this.getEditState().EditState)
            articleResolver = await this.CheckFormMethod(articleLang, this.getEditState().EditType, this.query, true)
        let options = { formOnly: true, layout: this.activeLayout }
        this.FormControler
            .addContenLang(articleLang, this.getFormResolver(), this.getEditState().EditState, articleResolver)
            .then(inProcess => this.resolvers.setForm(inProcess, articleLang, options))
            .then(() => this.lang = lang)
            .catch(valid => console.log(valid))
        this.lang = lang
    }
    async CheckFormMethod(lang, EditType, { reform, cachekey, getid, preview }, newLang = false) {
        if (EditType !== 'edit')
            await this.setReform(reform, { getid, preview })
                .catch(valid => console.log(valid))
        if (EditType === 'edit' && lang && this.getEditArticle())
            await this.setEdit(cachekey, lang, this.getEditArticle(), newLang)
                .catch(valid => console.log(valid))
        return
    }
    async Validate() {
        let Validate
        await this.FormControler
            .validateSubmitForm("iron-form-submit")
            .then(Valid => Validate = Valid)
            .catch(notValid => Validate = notValid)
        return Validate
    }
    async _CREATE_({ Table }) {
        if (!!this.Created) return
        let { Valid } = await this.Validate()
        if (!Valid) return Valid
        let [formTools] = this.formTools
        let Created = await this.FormControler
            .saveCreatedArticle(formTools, Table)
            .catch(valid => console.log(valid))
        if (!Created) return
        this.Updated = Created
        this.setAferLoad({ form: true, noInview: true })
    }
    async _UPDATE_({ Table: { update } }) {
        if (!!this.Updated) return
        let { Valid } = await this.Validate()
        if (!Valid) return Valid
        let [formTools] = this.formTools
        let Updated
        await this.FormControler.saveUpdatedArticle(formTools, update)
        this.Updated = Updated
        this.setAferLoad({ form: true, noInview: true })
    }
    //_Origin_Resolver_
    async ResolveOrigin({ Table, origin }) {
        let res = prompt(`do you wish to ${origin} this ${this.query.type}? y/n`)
        if (!res || res === 'n') return setTimeout(() => { this.mouseDown = false }, 120);
        setTimeout(() => { this.mouseDown = false }, 120);
        let Res, [formTools] = this.toQuery,
            ResolveOrigin = `${origin}Article`
        this.FormControler[ResolveOrigin](formTools, Table[origin])
            .then(Res => Res = Res)
        this.Updated = Res
        this.setAferLoad({ form: true, noInview: true })
    }
    _onCheckboxPressed({ formData }) {
        let exists = this.SubjectsChecked.find(formDataId => formDataId === formData.id)
        if (!!exists) this.SubjectsChecked = this.SubjectsChecked
            .filter(formDataId => formDataId !== formData.id)
        else this.SubjectsChecked.push(formData.id)
    }
    async _DELETE_() {
        this.SubjectsChecked
        let validate = await this.Validate()
        if (validate.notValid) return
    }
    _recycleOrDeleteArticles({ origin }) {
        this.SubjectsChecked.forEach(subject => this._trashRecycleOrDelete_(origin, subject.id));
    }
}
