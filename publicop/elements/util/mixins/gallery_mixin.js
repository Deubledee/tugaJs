import { getCredentials } from '../../../js/login_lib';
import { getBlob } from '../../lib/app_defalut_http-requests';
import { extention, mixInScope, resolveToInfoData, setDataWithTools, setElementToRender, toggleSpinner, setReformTools, setDataSimple } from '../../lib/methods';
import * as States from '../cacheStates&Listners/gallery-form-states';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import { GalleryFormControl } from '../classes/gallery-form-control';
import { setElementsToRender, getFormElement } from '../libs/article-form_lib';
import * as libMixin from '../libs/gallery_lib';
import * as resolvers from '../resolvers/gallery_resolver';
import * as route_methods from '../route-methods/gallery-route_methods';
import * as mouseDownEventControler from '../cacheStates&Listners/mouseDownEventControler';

const usergallery = { Name: '' },
    methodsToInclude = {
        ...mouseDownEventControler, ...States, ...libMixin, ...route_methods,
        setPropertyContentAsInfoData, resolveToInfoData, setLayoutState, setDataSimple,
        setDataWithTools, setElementsToRender, setElementToRender, setReformTools, getFormElement
    }

export const Methods = (appGalleryPage) =>
    class GalleryMethods extends extention(appGalleryPage) {
        constructor(...args) {
            super(...args);
            let { UserRecord } = getCredentials()
            usergallery.Name = `${UserRecord.name.replaceAll(' ', '')}-${UserRecord.uid}`
            this.resolvers = {}
            mixInScope.call(this, methodsToInclude)
            mixInScope.call(this, resolvers, this.resolvers)
            this.ElementsTorender = {}
            this.GalleryFormControler = GalleryFormControl();
            this.userGallery = usergallery.Name
            this.galleryRoot = localStorage['app-id']
            this.activeLayout = 'column'
            this._resetImagesChecked()
            this._resetGalleriesChecked()
            this.UPDATE = 0
        }
        get galleriesChecked() {
            return this.getGalleriesCheckedState()
        }
        set galleriesChecked(galleriesChecked) {
            this.setGalleriesCheckedState(galleriesChecked)
        }
        get imagesChecked() {
            return this.getImagesCheckedState()
        }
        set imagesChecked(imagesChecked) {
            this.setImagesCheckedState(imagesChecked)
        }
        get PreviedImage() {
            return this.getCheckedPreviedImageState()
        }
        set PreviedImage(PreviedImage) {
            this.setCheckedPreviedImageState(PreviedImage)
        }
        get userGallery() {
            return this.getUserGalleryState()
        }
        set userGallery(userGallery) {
            this.setUserGalleryState(userGallery)
        }
        get clicked() {
            return this.getClickedState()
        }
        get mouseDown() {
            return this.getMouseDownState()
        }
        set clicked(clicked) {
            this.setClickedState(clicked)
        }
        set mouseDown(mouseDown) {
            this.setMouseDownState(mouseDown)
        }
        get UPDATE() {
            return this.getUpdateState()
        }
        set UPDATE(UPDATE) {
            this.setUpdateState(UPDATE)
        }
        get AssetType() {
            return this.getAssetTypeState()
        }
        set AssetType(AssetType) {
            this.setAssetTypeState(AssetType)
        }
        get activeLayout() {
            return this.getFormLayoutState()
        }
        set activeLayout(activeLayout) {
            this.setFormLayoutState(activeLayout)
        }
        get ReFormGallery() {
            return this.getReFormGallery()
        }
        set ReFormGallery(ReFormGallery) {
            this.setReFormGallery(ReFormGallery)
        }
        get FormResolver() {
            return this.getFormResolver()
        }
        set FormResolver(FormResolver) {
            this.setFormResolver(FormResolver)
        }
        get formRequestKey() {
            return this.getRequestKeyState()
        }
        set formRequestKey(formRequestKey) {
            this.setRequestKeyState(formRequestKey)
        }
        get AssetType() {
            return this.getAssetTypeState()
        }
        set AssetType(AssetType) {
            this.setAssetTypeState(AssetType)
        }
        get query() {
            return this.getQueryState()
        }
        set query(query) {
            this.setQueryState(query)
        }
        get Updated() {
            return this.getUpdatedState()
        }
        set Updated(Updated) {
            this.setUpdatedState(!!Updated)
        }
        async setCategories(Response) {
            this.setDataWithTools(Response, ['tools', 'form', 'media'])
            this.resolveToInfoData(['tools', 'mediaTools', 'formTools'])
        }
        async setPage(query) {
            this.setGalleryPermitionType(query);
            this.formRequestKey = this.galleryPermitionType
            this.setDefaults(query)
            return this.setFormArticle(this.mediaTools, query)
        }
        setGalleryPermitionType(query) {
            if (!query.galleryreform) {
                window.onbeforeunload = function () { return ''; };
                let { UserRecord } = getCredentials();
                let { requestsPermitions } = this.areas.tools;
                this.galleryPermitionType = Object.keys(requestsPermitions)
                    .find(Permitions => UserRecord.checkCredentials(requestsPermitions[Permitions]));
            }
        }
        async setFormArticle(customTool, query) {
            this.toQuery = customTool
            this.setAssetType(query, this.getEditState())
            let options = this.getOptions("form-article", customTool)
            return options
        }
        getOptions(requestKey, ToQuery) {
            toggleSpinner(true)
            return { requestKey, ToQuery }
        }
        setForm() {
            this.setUpStates(this.query, this.query.galleryeditype)
            if (this.AssetType === 'preview') return this.setPreview(this.query)
            if (this.AssetType === 'local') return this.setLocal(this.query)
            this.setStandart(this.AssetType)
        }
        openImageViewer({ Table: { resetLocation: { reset, reform } }, formData: { index } }) {
            this.savePreviousLayoutState(this.activeLayout)
            this.FormResolver.resetLocation(reset, { ...reform, index })
        }
        async setStandart(AssetType) {
            let { EditState } = this.getEditState()
            this.savePreviousLayoutState(this.activeLayout)
            if (AssetType !== 'create')
                await this.setMediaContent(this.ReFormGallery, this.formRequestKey, !!this.UPDATE)
            this.setFormInProgress(AssetType, EditState)
                .then(({ FormElements }) => this.IsPreviewedImageChecked(FormElements, this.activeLayout))
                .catch(valid => console.log(valid))
            this.Updated = false
        }
        setPreview({ imageeditype: AssetType }) {
            this.setFormInProgress(AssetType, false)
                .catch(valid => console.log(valid))
        }
        setLocal({ localformtype: AssetType }, table2 = false) {
            this.setFormInProgress(AssetType, table2)
                .then(() => toggleSpinner(false))
                .catch(valid => console.log(valid))
        }
        setLocalList({ Table: { table2: { assetType: AssetType } }, files: { resolvedUrls } }) {
            this.FormResolver.contentToEdit = resolvedUrls
            this.setLocal({ localformtype: AssetType }, true)
        }
        setLayout({ formData: { layout } }) {
            this.setFormLayoutState(layout)
            this.getFormInProgress(layout)
                .then(inProcess => this.resolvers.setForm(inProcess, true, this.AssetType, layout, this.query))
                .then(({ FormElements }) => this.IsPreviewedImageChecked(FormElements, layout))
                .catch(valid => console.log(valid))
        }
        _openTrash(evt) {
            let { eventType, Table } = evt
            let resetLocation = Table.trash ? Table.trash.resetLocation : Table.galleryTrash.resetLocation
            let { reset, reform } = resetLocation
            this.clicked = true;
            if (eventType !== 'mousedown') this.FormResolver.resetLocation(reset, { ...reform })
            setTimeout(() => this.resetMouseEventsState(), 500);
        }

        ResolveOrigin(evt) {
            let { origin, Table } = evt
            console.log(origin);
            let Checked = this.getCheckedType(origin);
            if (origin === 'trash' || origin === 'galleryTrash')
                return this.Trash(this.AssetType, Checked, Table, origin);
            if (origin === 'delete' || origin === 'recycle' || origin === 'galleryDelete' || origin === 'rgalleryRecycle')
                this.deleteOrRecycle(this.AssetType, Checked, Table[origin]);
        }

        getCheckedType(origin) {
            let isImageType = (origin === 'trash' || origin === 'delete' || origin === 'recycle');
            let Checked = isImageType ? this.imagesChecked : this.galleriesChecked;
            return Checked;
        }

        async Validate(Validate = undefined) {
            Validate = await this.GalleryFormControler
                .validateSubmitForm("iron-form-submit")
                .catch(notValid => Validate = notValid)
            return Validate
        }


        async createGallery({ Table: { create } }) {
            if (!!this.Created) return
            let { Valid } = await this.Validate()
            if (!Valid) return Valid
            let [formTools] = this.galleriesCreateTools
            let Created = await this.GalleryFormControler
                .saveCreatedGallery(formTools, create)
                .catch(valid => console.log(valid))
            if (!Created) return
            this.UPDATE = Created
            this.setAferLoad({ form: true, noInview: true })
        }


        submit({ Table: { submit: { warnings: { nocontent: warning } } } }) {
            if (!!this.handleWarnings(warning, this.query)) return console.log(warning);
            this.statusmethod(this.imagesChecked)
            this._resetImagesChecked()
        }

        async GalleryChecked(evt) {
            console.log(evt);
            let { formData, target: { checked } } = evt
            if (!checked) return this.galleriesChecked = this.galleriesChecked
                .filter(image => (image.title || image.name) !== (formData.title || formData.name))
            this.galleriesChecked.push(formData) /* */
        }

        async ImageChecked({ Table: { multiimage, warnings }, formData, target }) {
            let { index } = formData
            let { checked } = target
            if (!checked) return this.removeUnchecked(formData)
            await getBlob(formData.url).then(blob => formData.blob = blob)
            let MultiImage = multiimage ? { multiimage } : this.query
            if (!this.checkMultiImage(MultiImage, warnings, target)) return
            this.PreviedImage = !!target.checked ? parseInt(index) : 'n/a'
            this.imagesChecked.push(formData)
        }
        checkPreviedImage(evt) {
            let { Table: { classList: { checkedClass, checkElementAboveClass }, checkElementAbove }, target } = evt
            target.classList.toggle(checkedClass)
            document.querySelector(checkElementAbove).classList.toggle(checkElementAboveClass)
            if (!!target.classList.contains(checkedClass)) target.checked = true
            else target.checked = false
            evt.target = target
            this.ImageChecked(evt)
        }
    }
