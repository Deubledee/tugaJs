"use strict";
import { getCredentials, _CheckSecret } from '../../../js/login_lib';
import {
    resetForm, extention, mixInScope, resolveToInfoData, setCustomToolFrom, setCustomToolsAsInfoData, setDataWithTools, setElementToRender
} from '../../lib/methods';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import * as resolvers from '../resolvers/blog-subjects_resolver';
import * as route_methods from '../route-methods/blog-subjects-route_methods';

const methodsToInclude = {
    ...route_methods, setElementToRender, setLayoutState, _CheckSecret,
    setPropertyContentAsInfoData, setCustomToolsAsInfoData, resetForm
}

export const Methods = superClass => class extends extention(superClass) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        this.editarticle = false
        mixInScope.call(this, methodsToInclude)
        mixInScope.call(this, resolvers, this.resolvers)
        document.querySelector('title').innerHTML = localStorage['app-id'] + '-subjects'
    }
    setElementsToRender() {
        this.ElementsTorender = {}
        this.setElementToRender('renderToSubjects', `#${this.INFO.id}-subjects`)
        this.setElementToRender('renderToArticles', `#${this.INFO.id}-articles`)
    }
    setCategories(response) {
        setDataWithTools.call(this, response, ['article', 'blog'])
        resolveToInfoData.call(this, ['tools', 'blogTools', 'articleTools'])
        setCustomToolFrom.call(this, 'tools', 'createTools', 'id', this.INFO.areas.tools.formCategoryId)
        this.setElementsToRender()
    }
    checkChangeState(query) {
        let [categoriesSet, isInView, noResetview] = [!!this.categories, query.inview === 'true', !query.resetview]
        let IgonreSubjectState = !query.subject || (query.subject && this.subject === query.subject)
        let [langNotSet, loginNotSet] = [this.lang !== query.lang, query.logedin && !this.logedin]
        if ((noResetview && isInView && categoriesSet && IgonreSubjectState) && (langNotSet || loginNotSet))
            return true
        return false
    }
    async setStateChange(query) {
        await this.setPage(query)
            .then(options => this.newSetContent(options))
            .then(() => this.resolvers.setTools({ isCached: true }))
            .then(() => this.resolvers.updateSubject({ resetview: !!this.subject }))
        return
    }
    async setPage(query) {
        this.lang = query.lang
        this.logedin = query.logedin === 'true'
        this.checkLogin(query)
        let options = this.getOptions(this.categories)
        return options
    }
    getOptions(ToQuery, cacheList, noLang, requestKey = 'articles') {
        let options = { requestKey, ToQuery, cacheList, noLang }
        return options
    }
    async setArticles(query) {
        this.subject = query.subject
        if (query.inview === 'true') this.checkLogin(query)
        let options = this.getOptions(this.blogTools, query.subject, true)
        return options
    }
    checkLogin(query) {
        window.onbeforeunload = function () { }
        query.logedin && this.setAferLoad({ reset: true, isCached: true }, { noInview: true })
    }
    updateActiveSubject(resetview, Resolver) {
        if (!this.query.subject || !resetview || !Resolver) return
        document.querySelector('title').innerHTML = localStorage['app-id'] + '-blog_subjects-' + this.query.subject
        let currentsubject = Resolver.content.find(subject => subject.id === this.query.subject);
        currentsubject = !!currentsubject ? currentsubject.articleName : ''
        if (!currentsubject) return
        let detail = {
            reactTo: currentsubject,
            id: 'blog-subjects-active',
            reaction: 'showSlot'
        }
        window.dispatchEvent(new CustomEvent('react-to', { detail }));
    }
    setCreate() {
        this.setEdit()
    }
    setEdit() {
        let [formCategory] = this.createTools
        let Permitions = formCategory.permitions
        let tempSecret = getCredentials().UserRecord.checkCredentials(Permitions)
        if (!tempSecret) return
        this.openFormPopup(tempSecret, formCategory)
    }
    getSubject() {
        return this.query.subject
    }
}
