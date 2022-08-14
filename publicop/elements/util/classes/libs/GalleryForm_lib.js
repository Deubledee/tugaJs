import { getCredentials, signInWithToken } from "../../../../js/login_lib";
import { _postArticles2, _getArticles2 } from "../../../lib/app_defalut_http-requests";
import { _getNoCarigeReturn } from "../../libs/blog-list-article_lib";

async function getSudo(formResolver) {
    let { queries: sudoQuery } = formResolver.RequestArticles(this, "get-sudo");
    let [response] = await _getArticles2(sudoQuery);
    let { getSudoCredentials } = await this.scope.defaultAssert(response);
    if (!getSudoCredentials || !getSudoCredentials.token) return
    let { user } = await signInWithToken(getSudoCredentials)
    let { claims, token } = await user.getIdTokenResult()
    this.token = token
    return claims
}

class GalleryFormLib {
    async preSubmitForm(submitEvent) {
        return new Promise((resolve) => {
            let formElement = this.setFormEventCallback(submitEvent);
            this.ValiationsReturn = resolve;
            formElement.submit();
        });
    }
    async checkComputedProperties(formResolver, formTable) {
        await Promise.all(Object.values(formTable)
            .filter(Table => Table.computed)
            .map(tableToCompute => this.setComputed(formResolver, formTable, tableToCompute)))
        return
    }
    async setComputed(formResolver, formTable, tableToCompute) {
        if (!this[tableToCompute.computed.method] || !this[tableToCompute.computed.method].call)
            throw `not a method: ${tableToCompute.computed.method}`
        let ComputedResult = await this[tableToCompute.computed.method](formResolver, { ...tableToCompute.computed.arguments })
        formTable[tableToCompute.property][tableToCompute.computed.property] = ComputedResult.map(this.unifyComputedResult)
        return
    }
    unifyComputedResult(item) {
        let unifiedResult = {}
        item.forEach(obj => Object.keys(obj).forEach(key => unifiedResult[key] = obj[key]))
        return unifiedResult
    }
    async GET_TableContent(formResolver, { postID, requestName, responseValues }) {
        let { category } = formResolver
        if (postID && requestName && category && category.http && category.http[postID]) {
            let { queries } = category.RequestArticles(this, postID);
            let [response] = await _getArticles2(queries);
            let Resolved = await this.scope.defaultAssert(response);
            let values = Resolved[requestName].map(res => responseValues
                .map(responseValue => ({ [responseValue]: res[responseValue] })))
            return values
        }
        throw { postID, requestName, responseValues, category, http: category.http, httpRequest: category.request[postID] }
    }
    async _setUserAndToken() {
        let UserRecord = await getCredentials(true);
        let { name, email, uid, role, sudo } = UserRecord;
        this.author = { name, email, uid, role, sudo };
    }
    setFormEventCallback(submitEvent) {
        let formElement;
        formElement = this.scope.getFormElement("popup-form");
        formElement.addEventListener(submitEvent, this.SubmitEventMethod.bind(this));
        return formElement;
    }
    async validateSubmitForm(submitEvent) {
        return new Promise((resolve, reject) => {
            let formElement = this.setFormEventCallback(submitEvent);
            let Valid = formElement.validate();
            if (!Valid)
                return reject({ Valid });
            this.ValiationsReturn = resolve;
            formElement.submit();
        });
    }
    SubmitEventMethod({ detail }) {
        let article = detail,
            [content] = this.create
        let update = Object.keys(article)
            .filter((key) => article[key] && article[key].split &&
                _getNoCarigeReturn(content[key]) !== _getNoCarigeReturn(article[key]));
        this.Update(update, article, content);
        this.ValiationsReturn({ Valid: true, update });
    }
    async saveCreatedGallery(formResolver, { createPostID, createRequestName }, attempts = 0) {//       
        let claims = await getSudo.call(this, formResolver);
        if (!claims && attempts < 5) return setTimeout(() =>
            this.saveCreatedGallery(formResolver, { createPostID, createRequestName }, ++attempts), 250);
        else if (!claims || !claims.sudo && attempts >= 2) throw false;
        let { queries } = formResolver.CreateArticles(this, createPostID);
        return this._ResolveHttpPost(queries, createRequestName);
    }

    async _ResolveHttpPost(queries, queryName) {
        let [response] = await _postArticles2(queries);
        let res = await this.scope.defaultAssert(response);
        this.formElements = {};
        if (res[queryName] && res[queryName].okMessage)
            return true;
        throw res;
    }

    Update(update, article, content) {
        update.forEach((updt) => {
            content[updt] = article[updt];
            if (!this.Updated[updt]) return (this.Updated[updt] = true);
            this.Updated[updt] = true;
        });
        this.create = [content]
    }

    async saveUpdated(assetType, content, formTools, { http: { checksums, gallery } }, attempts = 0) {
        console.log(assetType, content, formTools, gallery, remove);
        let claims = await getSudo.call(this, formTools);
        if (!claims && attempts < 5) return setTimeout(() =>
            this.saveUpdated(assetType, content, formTools, { http: { checksums, gallery } }, ++attempts), 250);
        else if (!claims || !claims.sudo && attempts >= 2) throw false;
        if (assetType === 'images')
            return await this.UpdateImages(content, formTools, checksums, gallery);
        if (assetType === 'galleries')
            return await this.UpdateGalleries(content, formTools, gallery);/**/
    }

    async UpdateGalleries(content, formTools, gallery) {
        this.Updated.gallery = true;
        this.gallery = content;
        let { queries: queries2 } = formTools.UpdateArticles(this, gallery.editPostID);
        let res = this._ResolveHttpPost(queries2, gallery.editRequestName);
        return res;
    }
    async UpdateImages(content, formTools, checksums, gallery) {
        this.Updated.images = true;
        let res = await Promise.all(content.map((img) => {
            let { checksum, checksumData, originalChecksum } = img;
            this.ChecksumData = checksumData;
            this.image = img;
            this._resolveChecksum(checksum, originalChecksum, formTools, checksums);
            let { queries: queries2 } = formTools.UpdateArticles(this, gallery.editPostID);
            return this._ResolveHttpPost(queries2, gallery.editRequestName);
        }));
        this.originalChecksum = undefined
        return res;
    }
    async saveTrashed(formResolver, postID) {
        let claims = await getSudo.call(this, formResolver);
        if (!claims || !claims.sudo)
            throw false;
        let { queries } = formResolver.UpdateArticles(this, postID);
        return this._ResolveHttpPost(queries, 'updateArticle');
    }
    async saveRecycled(formResolver, postID) {
        let claims = await getSudo.call(this, formResolver);
        if (!claims || !claims.sudo)
            throw false;
        let { queries } = formResolver.UpdateArticles(this, postID);
        return this._ResolveHttpPost(queries, 'updateArticle');
    }
    _resolveChecksum(checksum, originalChecksum, formTools, checksums) {
        if (checksum) [checksum, originalChecksum].forEach((cs, idx) => {
            if (this.originalChecksum && idx === 1)
                return;
            if (idx === 1)
                this.originalChecksum = cs;
            this.Checksum = cs;
            let { queries } = formTools.CreateArticles(this, checksums.createPostID);
            this._ResolveHttpPost(queries, checksums.createRequestName);
        });
    }
}

export { GalleryFormLib, _getNoCarigeReturn }
