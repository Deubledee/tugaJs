import { html, render } from 'lit-html';
import { mixInScope } from '../../lib/methods';
import { checkListFormTemplate, ironFormTemplate, methodsTemplate, previewFormTemplate } from '../../templates/form-templates';
import { getAssetsType } from '../cacheStates&Listners/assetsCache'
import { setResponseAssets } from './asset-class.js.js'
import { setListnersControl } from '../cacheStates&Listners/Listners';
import { ContentResolverFactory } from "./ContentResolver_class";
import { _getArticles2 } from '../../lib/app_defalut_http-requests';
import { onLog } from 'firebase/app';

/** */

export class formResolverFactory extends ContentResolverFactory {
    constructor(scope, lang, content, ContentResolverCache, options) {
        super(scope, lang, content, options);
        mixInScope.call(this, {
            langs: [],
            Assets: {},
            FormTypes: {},
            editState: {},
            formTemplates: { methodsTemplate, checkListFormTemplate, ironFormTemplate, previewFormTemplate }
        });
        this.ContentResolverCache = ContentResolverCache;
    }
    getAssets(assetType) {
        return this.Assets[assetType] ? this.Assets[assetType] : { [assetType]: 'no assets found' };
    }
    setAssets(Assets, Category = false) {
        let assets = Array.isArray(Assets) ? Assets : [Assets];
        let category = Category || this.category
        assets.forEach(asset => this._SetGetAsset(asset, category));
        return this;
    }
    _SetGetAsset(asset, category) {
        setResponseAssets.call(this.scope, asset, { category });
        this.Assets[asset] = getAssetsType.call(this.scope, asset, category);
    }
    setAssetType(AssetType) {
        this.formArticle = !!this.FormTypes[AssetType] ? this.FormTypes[AssetType] : false;
        this.activeAsset = AssetType;
        return this;
    }
    async _requestArticle(toQuery, getid) {
        let queries = this.scope.contentQueries(toQuery, getid);
        let response = await _getArticles2.call(this.scope, queries);
        let result = await this.scope.defaultAssert(response[0]);
        return result;
    }
    async setReformContent(toQuery, EditPage, { ReForm, getid, update }) {
        if (!!getid && toQuery || !!getid && toQuery && !!update) {
            let result = await this._requestArticle(toQuery, getid);
            this.editResolver = this.ContentResolverCache.
                ResolveContent(this.scope, `${EditPage}ReForm`, this.scope.lang, Object.values(result).pop(), {
                    responseName: 'ReFormRequest' + EditPage,
                    element: 'form', form: true, ReForm, update
                })
            this.contentToEdit = this.editResolver.content;
        }
        return this.contentToEdit
    }
    async setNewContentToEditCache(page, article, lang) {
        let { category, scope } = this.editResolver
        let result = await this._requestArticle(category, 'edit-article');
        return this.ContentResolverCache.
            ResolveContent(scope, page, lang, Object.values(result).pop(), {
                responseName: 'formRequest' + article,
                element: 'form', form: true,
            })
    }
    async setEditContent(page, { cachekey, lang, article, newLang }) {
        let finalResolver = undefined
        if (!cachekey) throw new Error(`not cachekey: ${cachekey}`)
        if (this.editResolver && this.contentToEdit && newLang)
            finalResolver = await this.setNewContentToEditCache(page, article, lang)
        if (!finalResolver) finalResolver = this.ContentResolverCache.filterCache({ lang, page, cachekey });
        this.editResolver = finalResolver
        if (!this.editResolver) throw new Error(`no Resolver found: ${this.editResolver}`)
        this.contentToEdit = this.editResolver.filterContentById(article);
        if (!this.contentToEdit && newLang) this.contentToEdit = 'createLang'
        return this.contentToEdit
    }

    async renderForm(permitionType, assetType, article, { formOnly, scrollby, delay, layout }) {
        this.assetType = assetType
        let [assets, waitForRender] = [{ ...this.getAssets(assetType), layout }, 500]
        let [contentTemplate, { methodsTemplate }, { methodsElement, contentElement }] =
            [this.formTemplates[assets.formTemplate], this.formTemplates, await this._setElements()]
        this.permitionType = permitionType
        this.formTable = assets.formTable
        return await this.Formulate(formOnly, assets, methodsTemplate, contentTemplate, methodsElement, contentElement, permitionType, article, scrollby, delay, waitForRender);
    }
    async Formulate(formOnly, assets, methodsTemplate, contentTemplate, methodsElement, contentElement, permitionType, article, scrollby, delay, waitForRender) {
        await this.resetFreeToolTemplate(formOnly);
        if (!formOnly) render(methodsTemplate.call(this.scope, assets, this, permitionType, article), methodsElement);
        render(contentTemplate.call(this.scope, assets, this, article), contentElement);
        this._setAfterFormRender(contentElement, scrollby, delay, waitForRender);
        return this;
    }

    _setListnersControl(waitForRender) {
        let time = setTimeout(() => {
            setListnersControl.call(this)
            clearTimeout(time)
        }, waitForRender);
    }
    _setAfterFormRender(contentElement, scrollby, delay, waitForRender) {
        this._setListnersControl(waitForRender);
        if (!scrollby || scrollby && (!contentElement.children || !contentElement.children[1])) return
        let time = setTimeout(() => {
            contentElement.children[1].scrollBy(scrollby)
            clearTimeout(time)
        }, delay + 120)
    }
    async resetFreeToolTemplate(formOnly) {
        let { methodsElement, contentElement } = this.FormElements;
        if (!formOnly) render(this.resetTemplate(), methodsElement);
        render(this.resetTemplate(), contentElement);
        return
    }
    resetTemplate(message = `loading`) {
        return html`${message}`;
    }
    async _setElements() {
        this.FormElements = {};
        let { methodsElement, contentElement } = await this._getElements();
        this.FormElements = { methodsElement, contentElement };
        return this.FormElements;
    }
    _getElements() {
        return new Promise((resolve, reject) => {
            let tryCount = 0, waitForRender = 120;
            var waitForRenderInterval = setInterval(() => {
                let methodsElement = document.querySelector(`#${this.scope.INFO.id}-methods-slot`),
                    contentElement = document.querySelector(`#${this.scope.INFO.id}-slot`);
                if (tryCount === 1000 && !methodsElement || !contentElement)
                    return reject('count exeeded no elements found') && clearInterval(waitForRenderInterval);
                if (methodsElement && contentElement) {
                    resolve({ methodsElement, contentElement });
                    return clearInterval(waitForRenderInterval);
                }
                ++tryCount;
            }, waitForRender);
        });
    }
}
