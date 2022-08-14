import { ArticleFormFactory } from './ArticleForm_class';

const Langs = {}

function reseLangsState() {
    Langs.State = []
    return this
}

export class FormControlClassFactory {
    constructor() {
        reseLangsState()
        this.InProcess = undefined
    }
    get Langs() {
        return Langs.State;
    }
    set Langs(Langs) {
        Langs.State.push(Langs);
    }
    get InProcess() {
        return this._articleInProcess;
    }
    set InProcess(InProcess) {
        this._articleInProcess = InProcess;
    }
    get InPreview() {
        return this._articleInPreview || false;
    }
    set InPreview(InPreview) {
        this._articleInPreview = InPreview;
    }
    togglePreview() {
        this.InPreview = !this.InPreview
        return this.InProcess
    }
    async setcontent(scope, articleLang, edit, assetType, formResolver, category) {
        if (!formResolver || !articleLang) return { error: { articleLang, formResolver } }
        if (assetType === 'preview' || this.InPreview) return this.togglePreview()
        return reseLangsState.call(this)
            .createInProcess(scope, formResolver, articleLang, edit, assetType, category)
    }
    async createInProcess(scope, formResolver, articleLang, edit, assetType, category) {
        this.InProcess = ArticleFormFactory();
        await this.InProcess.setInitState(scope, formResolver, articleLang, edit, assetType, category)
        return this.InProcess
    }
    async reset() {
        await this.InProcess.Reset()
        return this.InProcess
    }
    async addContenLang(articleLang, formResolver, edit, assetType) {
        await this.InProcess.changeLang(articleLang, formResolver, edit, assetType);
        return this.InProcess
    }
    async saveCreatedArticle(formTools, Table) {
        return this.InProcess.saveCreated(formTools, Table)
    }
    async saveUpdatedArticle(formTools, Table) {
        return this.InProcess.saveUpdated(formTools, Table)
    }
    async trashArticle(formTools, Table) {
        return this.InProcess.saveTrashed(formTools, Table)
    }
    async recycleArticle(articleId) {
        return this.InProcess.recycle(articleId)
    }
    async draftArticle(articleId) {
        return this.InProcess.draft(articleId)
    }
    async validateSubmitForm(submitEvent) {
        if (!!this.InProcess) return this.InProcess.validateSubmitForm(submitEvent)
        return { Valid: true }
    }
    async preSubmitForm(submitEvent) {
        return this.InProcess.preSubmitForm(submitEvent)
    }
    isInProgress() {
        return !!this.InProcess;
    }
}

const FormControler = {}

function articleFormControl() {
    if (!FormControler.instance) FormControler.instance = new FormControlClassFactory()
    return FormControler.instance
}
export { articleFormControl }
