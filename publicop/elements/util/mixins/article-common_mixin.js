import '@polymer/polymer/polymer-legacy.js';
import { html, render } from 'lit-html'
import { getCredentials, _CheckAuthor, _CheckSecret } from '../../../js/login_lib'

const Aproved = {}

function resetAproved() {
    Aproved.secret = false
    Aproved.author = false
}

function checkBeforeRender(template, { property, element }) {
    let Element = this.querySelector(element)
    let callAgainDelay = 120
    if (!Element || !this[property])
        return setTimeout(() => checkBeforeRender.call(this, template, { property, element }), callAgainDelay);
    render(template(this[property]), Element)
}

export const Methods = {
    setedit() { },
    _setEdit() {
        this.setedit({})
    },
    _checkForEdit(tempSecret) {
        if (!tempSecret) return
        let author, secret = _CheckSecret(tempSecret, Aproved)
        if (!secret) return
        if (this.article.author)
            author = _CheckAuthor.call(this, Aproved)
        this.setEditIcon({ secret: tempSecret, author })
    },
    setEditIcon({ secret, author }) {
        if (!secret ||
            Aproved.secret !== secret ||
            (!!secret && !!author) &&
            Aproved.author.name !== author.name &&
            Aproved.author.email !== author.email) return resetAproved()
        this.icon = true
        let template = (editHref) => html`
         <a href="${editHref}"
            class="app-tool-anchor"
            @click="${this._setEdit.bind(this)}"
            id="edithref"
            slot="icon">
            <iron-icon icon="icons:create">
            </iron-icon>
        </a>`
        checkBeforeRender.call(this, template, { property: "editHref", element: '#slot-icon' })
        resetAproved()
    }
}
