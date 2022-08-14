import '@polymer/polymer/polymer-legacy.js';
import { decodeArticle, _getShortVersion, _getNoCarigeReturn } from '../libs/blog-list-article_lib'


export const Methods = {
    decode(data) {
        return atob(data)
    },
    getDate(createdAt) {
        let minutes = parseInt((new Date() - (new Date(createdAt))) / (1000 * 60), 10)
        let hours = parseInt((new Date() - (new Date(createdAt))) / (1000 * 60 * 60), 10)
        let days = parseInt((new Date() - (new Date(createdAt))) / (1000 * 60 * 60 * 24), 10)
        return minutes > 60 ? hours > 24 ? `${parseInt(days) === parseInt(days) ? days : +!~days} ${this.query.lang === 'en' ? 'days..' : 'dias..'}` : `${parseInt(hours) === parseInt(hours) ? hours : +!~hours} ${this.query.lang === 'en' ? 'hours..' : 'horas..'}` : `${parseInt(minutes) === parseInt(minutes) ? minutes : +!~minutes} ${this.query.lang === 'en' ? 'minutes..' : 'minutos..'}`
    },
    getShorty(data) {
        if (!data) return
        this.removeAttribute('big')
        this.setAttribute('small', data)
    },
    getBig(data) {
        if (!data) return
        this.removeAttribute('small')
        this.setAttribute('big', data)
    },
    _getType() {
        return this.query.inview ? this.query.type : 'article'
    },
    _getSubject() {
        return this.article.subject
    },
    resolveArticle(articleData) {
        this.dateType = this.getDate(this.article.createdAt)
        setTimeout(() => { this.show = true }, 60 * 2);
        if (!!articleData) {
            let { description, id, images, articleName } = articleData
            this.description = description
            this.articleName = _getNoCarigeReturn(articleName)
            if (!!this.fulltext) this._setText(decodeArticle.call(this, articleData), 'articletext')
            if (!!images && !!images.length) {
                this._slotFristImage({ images, id }, this.children[0])
                this.image = true
            }
            this._setSubject(this.lang)
        }
    },
    _setSubject(lang) {
        let { subject, subjectLangs } = this.article
        let Subject = {}
        try {
            Subject = JSON.parse(subjectLangs)
        }
        catch (e) {
            console.error(e);
        }
        finally {
            Subject = Subject[lang] ? Subject[lang] : subject
        }
        this.subject = Subject
        if (!!this.query) this.setHrefs(this.query)
    }
}
