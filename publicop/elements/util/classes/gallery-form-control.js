import { GalleryFormFactory } from './GalleryForm_class';


export class GalleryFormControlClassFactory {
    constructor() {
        this.InProcess = undefined
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
    async setcontent(scope, edit, assetType, formResolver, category, { index, imageeditype, galleryeditype }) {
        let setImages = !!imageeditype ? imageeditype : !galleryeditype
        if (!formResolver) return { error: { formResolver } }
        if (imageeditype === 'preview') return this.setPreview(assetType, index, imageeditype, setImages)
        return this.createInProcess(scope, formResolver, edit, assetType, category, setImages)
    }
    setPreview(assetType, index, galleryeditype) {
        this.InProcess.setPreviewContent(assetType, index, galleryeditype)
        return this.InProcess
    }
    async createInProcess(scope, formResolver, edit, assetType, category, setImages) {
        this.InProcess = GalleryFormFactory();
        await this.InProcess.setInitState(scope, formResolver, edit, assetType, category, setImages)
        return this.InProcess
    }
    async reset() {
        await this.InProcess.Reset()
        return this.InProcess
    }
    async saveCreated(formTools, Table) {
        return this.InProcess.saveCreated(formTools, Table)
    }
    async saveCreatedGallery(formTools, Table) {
        return this.InProcess.saveCreatedGallery(formTools, Table)
    }

    async saveUpdated(assetType, content, formTools, Table, remove = false) {
        return this.InProcess.saveUpdated(assetType, content, formTools, Table, remove)
    }

    async trashGallery(formTools, Table) {
        return this.InProcess.saveTrashed(formTools, Table)
    }
    async recycleGallery(articleId) {
        return this.InProcess.recycle(articleId)
    }
    async validateSubmitForm(submitEvent) {
        if (!!this.InProcess) return this.InProcess.validateSubmitForm(submitEvent)
        return { Valid: true }
    }
    async preSubmitForm(submitEvent) {
        return this.InProcess.preSubmitForm(submitEvent)
    }
    async getFormInProcess() {
        return this.InProcess
    }
    isInProgress() {
        return !!this.InProcess;
    }
}

const FormControler = {}

function GalleryFormControl() {
    if (!FormControler.instance) FormControler.instance = new GalleryFormControlClassFactory()
    return FormControler.instance
}
export { GalleryFormControl }
