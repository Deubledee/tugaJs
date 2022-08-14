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

class ArticleFormLib {
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
        let { name, email, uid, role } = UserRecord;
        this.author = { name, email, uid, role };
    }
    SetUpdatedLangContent(filteredLangs, Content, content) {
        filteredLangs.forEach((lang) => {
            Content[lang] = {};
            Object.keys(this.Updated[lang])
                .forEach(key => (Content[lang][key] = _getNoCarigeReturn(content[lang][key])));
        });
    }
    setFormEventCallback(submitEvent) {
        let formElement;
        formElement = this.scope.getFormElement("popup-form");
        formElement.addEventListener(submitEvent, this.SubmitEventMethod.bind(this));
        return formElement;
    }
    async preSubmitForm(submitEvent) {
        return new Promise((resolve) => {
            let formElement = this.setFormEventCallback(submitEvent);
            this.ValiationsReturn = resolve;
            formElement.submit();
        });
    }
    async validateSubmitForm(submitEvent) {
        return new Promise((resolve, reject) => {
            if (this.createLang) return reject({ createLang });
            let formElement = this.setFormEventCallback(submitEvent);
            let Valid = formElement.validate();
            if (!Valid)
                return reject({ Valid });
            this.ValiationsReturn = resolve;
            formElement.submit();
        });
    }
    SubmitEventMethod({ detail }) {
        let article = detail, content = this.content[this.lang],
            update = Object.keys(article)
                .filter((key) => article[key] && article[key].split &&
                    _getNoCarigeReturn(content[key]) !== _getNoCarigeReturn(article[key]));
        this.Update(update, article);
        this.ValiationsReturn({ Valid: true, update });
    }
    Update(update, article) {
        if (!this.Updated[this.lang])
            this.Updated[this.lang] = {};
        update.forEach((updt) => {
            if (updt === "images")
                return this._UpdateImages(article, updt);
            if (updt === "permitions")
                return this._UpdateProperty(article, updt);
            if (updt === "subject")
                return this._UpdateSubject(article, updt);
            this.content[this.lang][updt] = article[updt];
            this.formResolver[this.lang].contentToEdit[updt] = article[updt];
            if (!this.Updated[this.lang][updt])
                return (this.Updated[this.lang][updt] = true);
            this.Updated[updt] = true;
        });
    }
    _UpdateImages(article, updt) {
        let { images } = article;
        let parsedImage = JSON.parse(images);
        let changed = !this.images.find((image) => image.url === parsedImage.url);
        if (changed)
            this._setUpdate(updt, parsedImage);
    }
    _UpdateProperty(article, updt) {
        let update = article[updt];
        let content = this.content[this.lang];
        let changed = !content[updt].find((Update) => Update === update);
        if (changed)
            this._setUpdate(updt, update);
    }
    _UpdateSubject(article, updt) {
        let update = article[updt];
        let Updated = update.constructor.name === 'Object' ? JSON.parse(update) : update
        let { langs: subjectLangs, id: subject } = Updated;
        let neSubject = { subjectLangs, subject };
        Object.keys(neSubject).forEach(update => this._setUpdate(update, neSubject[update]));
    }
    _setUpdate(updt, update) {
        this[updt] = [update];
        this.langs.forEach(lang => (this.content[lang][updt] = this[updt]));
        this.formResolver[this.lang].contentToEdit[updt] = this[updt];
        this.Updated[updt] = true;
    }
    async saveCreated(formResolver, { createPostID, createRequestName }) {
        if (!Object.keys(this.Updated).find(key => Object.values(this.Updated[key]).length)) { alert("nothing created"); throw false; }
        if (!(await this.checkClaims(formResolver))) throw false;
        let { queries } = formResolver.CreateArticles(this, createPostID);
        return this._ResolveHttpPost(queries, createRequestName);
    }
    async saveUpdated(formResolver, { editPostID, editRequestName, createPostID, createRequestName }) {
        if (!!this.createLang) return this.saveCreated(formResolver, { createPostID, createRequestName });
        if (!Object.keys(this.Updated).find(key => Object.values(this.Updated[key]).length)) { alert("nothing updated"); throw false; }
        return this.UpdateArticle(formResolver, editPostID, editRequestName) /* */
    }
    async saveTrashed(formResolver, postID) {
        return this.UpdateArticle(formResolver, postID, 'updateArticle')
    }
    async saveRecycled(formResolver, postID) {
        return this.UpdateArticle(formResolver, postID, 'updateArticle')
    }
    async saveDrafted(formResolver, postID) {
        return this.UpdateArticle(formResolver, postID, 'updateArticle')
    }
    async UpdateArticle(formResolver, postID, editRequestName) {
        if (!(await this.checkClaims(formResolver))) throw false;
        let { queries } = formResolver.UpdateArticles(this, postID);
        return this._ResolveHttpPost(queries, editRequestName);
    }
    async checkClaims(formResolver) {
        let claims = await getSudo.call(this, formResolver);
        if (!claims || !claims.sudo || this.author.uid !== claims.sudo) return false;
        return true
    }
    async _ResolveHttpPost(queries, queryName) {
        let [response] = await _postArticles2(queries);
        let res = await this.scope.defaultAssert(response);
        this.formElements = {};
        if (res[queryName] && res[queryName].okMessage)
            return true;
        throw res;
    }
}

export { ArticleFormLib, _getNoCarigeReturn }
