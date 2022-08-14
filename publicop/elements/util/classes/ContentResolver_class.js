"use strict";
import { html, render } from 'lit-html';
import { resetIgnoreQueries } from "../../../js/reset_location";
import { callLocationEvent, getInfoDataByProperty, mixInScope } from '../../lib/methods';
import { ResolveElement } from '../../templates/elements-template';
import { setStylesToInclude } from '../cacheStates&Listners/styles_to_include';
import { setInputsMethod } from '../../templates/form-table-templates';


function _setStyles2_(id, category, elementName) {
    let { rootStyles, rootDefaultStyles } = category;
    let TypeStyles = Array.isArray(elementName) ? elementName : [elementName];
    TypeStyles.forEach(StyleToInclude => setStylesToInclude.call(this, id, StyleToInclude, rootStyles, rootDefaultStyles));
}
/* The ContentResolver class is used to resolve the content of a page */
export class ContentResolverFactory {
    constructor(scope, lang, content, options) {
        this.setLang(lang);
        mixInScope.call(this, { Template: {}, contentList: [], _content: [], _stylesSet: [], content, ...options });
        this.scope = scope;
        this._setCategoryPath();
        this._setTemplateName();
    }
    get content() {
        return this._content;
    }
    set content(content) {
        if (!content.isCached)
            this._content = content;
    }
    setLang(lang) {
        this.lang = lang;
        return this;
    }
    _setCategoryPath() {
        this.categoryPath = !!Array.isArray(this.content) &&
            !!this.content.length && this.content[0].categories &&
            !!Array.isArray(this.content[0].categories) ?
            this.content[0].categories[0] : this.content.category ?
                this.content.category : !this.content;
    }
    _setTemplateName() {
        this.TemplateName = !!this.category && !!this.category.areas &&
            this.category.areas.template ? this.category.areas.template : `${this.element}Template`;
    }
    setDefaultResolve() {
        this.setStylesAndTemplate({});
        return this;
    }
    setCategory(category) {
        this.category = !!category ? category : this.categoryPath &&
            getInfoDataByProperty.call(this.scope, this.categoryPath, 'path') || undefined;
        this._setTemplateName();
        return this;
    }
    setMethodFromCategory({ Category, area }) {
        let MethodTable, Area = Category.areas[area || this.area]
        if (!Area) return this
        let MethodFromId = Object.keys(Area).find(asset => asset === 'formCategoryId' || asset === 'methodToolId')
        let MethodFromArea = Object.keys(Area).find(asset => asset === 'method')
        if (!!MethodFromId) MethodTable = Area[Area[MethodFromId]]
        if (!!MethodFromArea) MethodTable = Area
        let InputsMethod = setInputsMethod.call(this.scope, MethodTable)
        this.setMethod(InputsMethod)
        return this;
    }
    setMethod(method) {
        if (!method) throw new Error(method)
        this.method = method.bind && method.bind(this.scope)
        return this;
    }
    setStylesAndTemplate({ elementName, TemplateId }) {
        this.setStyles(elementName);
        if (!TemplateId)
            return this.setTemplate();
        return this.setTemplateId(TemplateId);
    }
    setStyles(element = false) {
        let Category = this.stylesCategory || this.category;
        let Elements = element || this.element;
        if (!Array.isArray(Elements)) Elements = [Elements];
        Elements.forEach(Element => {
            this._stylesSet.push({ id: Category.id, Element });
            _setStyles2_(Category.id, Category, Element);
        });
        return this;
    }
    setContentList(listItem, content) {
        let isListSet = this.isContentListSet(listItem);
        if (!isListSet) this.contentList.push({ [listItem]: content });
        return this;
    }
    setContentListAsContent(TemplateId) {
        let content = this.getContentList(TemplateId);
        this.content = content[TemplateId];
        return this;
    }
    _ResolveElement() {
        let Options = {}
        return ResolveElement.call(this, this.TemplateName, Options);
    }
    setTemplate() {
        if (!this.Template.strings) this.Template = this._ResolveElement();
        return this;
    }
    setTemplateId(TemplateId) {
        this.setContentListAsContent(TemplateId);
        if (!this.Template[TemplateId])
            this.Template[TemplateId] = {};
        return this.resetTemplateId(TemplateId);;
    }
    getTemplate(TemplateId = 'Default') {
        let Template = this.Template.call ? this.Template : undefined;
        return { Template, TemplateId: TemplateId, Resolver: this };
    }
    resetTemplate(TemplateId) {
        if (TemplateId) return (this.Template[TemplateId] = {}) && this.setTemplateId(TemplateId);
        return (this.Template = {}) && this.setTemplate();
    }
    resetTemplateId(TemplateId) {
        if (!!this.Template[TemplateId]) {
            this.Template[TemplateId] = this._ResolveElement();
        }
        return this;
    }
    resetLocation(ignolres, resets) {
        let time = setTimeout(() => {
            let newUrl = resetIgnoreQueries(ignolres)
            let newUrl2 = newUrl
            if (resets)
                for (let reset in resets)
                    newUrl2 = `${newUrl2}&${reset}=${resets[reset]}`;
            callLocationEvent(newUrl2)
            clearTimeout(time)
        }, 60 * 5);
        return this;
    }
    resetTemplateRenderArea(element, { styles, spinner, message }) {
        let template = spinner ?
            html`<div style="${styles}">
                    ${spinner ? html`<app-spinner active> </app-spinner>` : message}           
                </div>`:
            html`<div> </div>`
        render(template, element);
        return this;
    }
    RenderTemplate(element, options = {}) {
        let { TemplateId, delay, scrollby } = options;
        let { Template } = TemplateId ?
            this.getTemplateByContentID(TemplateId) : this.getTemplate();
        if (delay) return setTimeout(() => requestAnimationFrame(() => this.Render(Template(), element)), delay) && this;
        this.Render(Template(), element);
        if (scrollby) setTimeout(() => {
            console.log('scrollBy');
            element.scrollBy(scrollby), delay + 120
        })
        return this;
    }
    Render(template, element, preprocessed = true) {
        let Template = preprocessed ? template : html`${template.call(this.scope)}`;
        render(Template, element);
    }
    getTemplateByContentID(TemplateId) {
        return { Template: this.Template[TemplateId], TemplateId, Resolver: this };
    }
    getContentList(TemplateId) {
        return this.contentList.find(ListItem => Object.keys(ListItem).find(key => key === TemplateId));
    }
    getMatch(lang, responseName) {
        if (!!this.match({ lang, responseName })) return this;
    }
    match(matchKeys) {
        let keysTomatch = Object.keys(matchKeys);
        let keysMatched = keysTomatch.filter(property => this[property] === matchKeys[property]);
        return !!(keysMatched.length === keysTomatch.length);
    }
    updateContent(contentArticleID, ArticleContentToUpdate) {
        let Article = this.filterContent(contentArticleID);
        console.log(Article);
        console.log(ArticleContentToUpdate);
    }
    isContentListSet(listItem) {
        if (!this.contentList.length)
            return false;
        let isSet = this.getContentList(listItem);
        return !!isSet;
    }
    filterContentById(contentArticleID) {
        return this.content.find(Article => Article.id === contentArticleID);
    }
}
