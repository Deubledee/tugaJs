import { html, html as css, PolymerElement } from '@polymer/polymer';
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { html as liHtml, render } from 'lit-html';
import { toggleSpinner } from '../lib/methods'
import '@polymer/neon-animation/neon-animations';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import * as popupTemplates from '../templates/popup-templates'

const MSGtempaltes = function MSGtempaltes(type) {
    return !!(type in popupTemplates) ? popupTemplates[type].call(this) : ["error", "error"]
}

export class appPopupHandler extends mixinBehaviors([
    NeonAnimationBehavior,
    NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`  
        <style>
          ${this._getStyles}  
        </style>          
         ${this._getContent}     
        `;
    }

    static get _getStyles() {
        return css`  
          :host {
              display: none;
              position: fixed;
              top: 0;
              width: 100vw;
              height: 100vh;
              background: rgb(17 19 19 / 11%);
              z-index: 11;
          }   
        `;
    }

    static get _getContent() {
        return html`<slot></slot>`;
    }

    static get is() { return 'app-popup-handler'; }
    static get properties() {
        return {
            user: {
                type: Object
            },
            category: {
                type: Array,
                notify: true,
                value: ''
            },
            lang: {
                type: String,
                notify: true,
                value: ''
            },
            langs: {
                type: Object,
                value: {}
            },
            ctnOpened: {
                type: Boolean,
                notify: true,
            },
            opened: {
                type: Boolean,
                notify: true,
                observer: '_checkIfClose'
            },
            styleElement: {
                type: Object,
                value: function () {
                    if (!document.querySelector('style[scope=popup]')) {
                        let style = document.createElement('style')
                        style.setAttribute('scope', 'popup')
                        document.head.appendChild(style)
                    }
                    return document.querySelector('style[scope=popup]')
                }
            },
            type: {
                type: String,
                notify: true,
                value: 'popup'
            },
        }
    }
    ready() {
        super.ready();
        if (this.type === 'popup') window.addEventListener('popup', this.openPopup.bind(this));
    }
    Styletemplate(styles) {
        return liHtml`${styles}`
    }
    openPopup(event) {
        this.METHOD = event.detail.method
        this.cancelMethod = event.detail.cancelMethod
        let [styles, template] = MSGtempaltes.call(this, event.detail.type)
        if (template === 'error') throw event.detail
        render(this.Styletemplate(styles), this.styleElement)
        render(template(event.detail), this);
        this.style.display = "block"
        toggleSpinner(false)
    }
    defaultCancel() {
        if (typeof this.cancelMethod === 'function') this.cancelMethod()
        this._reset()
    }
    statusMethod() {
        if (typeof this.METHOD === 'function') this.METHOD()
        this._reset()
    }
    handleForm() {
        let popupForm = document.querySelector('#popup-form')
        popupForm.submit()
    }
    defaultFormCallback(evt) {
        this.METHOD(evt.detail.data)
        this._reset()
    }
    loginMethod(evt) {
        let provider = evt.target.getAttribute('name')
        if (provider !== 'cancel')
            this.METHOD(provider)
        if (provider === 'cancel')
            this.cancelMethod(false)
        this._reset()
    }
    _reset() {
        let template = () => liHtml``
        render(template(), this.styleElement);
        render(template(), this);
        this.style.display = "none"
    }
}

elementsDefine(appPopupHandler.is, appPopupHandler);

