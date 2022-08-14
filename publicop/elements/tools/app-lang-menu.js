
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import { html as css, html } from '@polymer/polymer/polymer-element';
import { toggleSpinner } from '../lib/methods';
import { appMenuTemplate } from '../templates/app-menu-template';
;

const config = {
    ANIMATION_CUBIC_BEZIER: 'cubic-bezier(.3,.95,.5,1)',
    MAX_ANIMATION_TIME_MS: 400
};

export class appLangMenu extends mixinBehaviors([
    IronFormElementBehavior,
    IronValidatableBehavior], appMenuTemplate) {
    static get _getStyles() {
        return css`
            .alt{
                display: flex;
                flex-direction: row;
                padding-inline-start: unset;
                height: 30px;
                align-content: space-around;
                align-items: baseline;
            }

            

            .item-text,
            .item-btn {
                flex-basis: 50%;
                width: 30px;
            }

            paper-icon-button {
                right: 0px;
                z-index: 5;
            }

            .row{
                display: flex;
            }

            paper-item {
                cursor: pointer;
                width: 38%;
                min-height: 42px;
            }

            .invalid {
                display: none;
                color: red;
                width: 75%;
            }

            .invalid[valid]{
                display: block;
            }

            paper-listbox.lang-dropdown-content {
                width: 120px;
                align-items: center;
                justify-content: space-evenly;
            }
            .item-btn {
                text-align: end;
            }
            `
    }
    static get launchRouter() {
        return html`
        <app-location route="{{route}}">
        </app-location>
        <app-route route="{{route}}" pattern="/:item" data="{{routeData}}" query-params="{{query}}">
        </app-route>`
    }
    static get _getTrigger() {
        return html`            
            <div class="alt">
                <div class="item-text" name="[[itemlabel]]" aria-label="mode-category">
                    [[item]]
                </div>
                <div class="item-btn">
                    <paper-icon-button name="langicon" icon="arrow-drop-down">
                    </paper-icon-button>
                </div>
            </div>`
    }
    static get _getContent() {
        return html`
        <div class="dropdown-content" slot="dropdown-content">
            <paper-listbox id="content" selected="{{selected}}" value="[[value]]" name="languagesListbox"
                class="lang-dropdown-content dropdown-listbox">
                <dom-repeat repeat items="[[items]]" as="item">
                    <template>
                        <paper-item class="form-al" title="lang-[[item]]" name="lang-[[item]]" on-click="_setValue">
                            [[item]]
                        </paper-item>
                    </template>
                </dom-repeat>
            </paper-listbox>
        </div> 
        `
    }
    static get is() {
        return 'app-lang-menu';
    }
    static get properties() {
        return {
            itemlabel: {
                type: String,
                notify: true,
            },
            item: {
                type: String,
                notify: true
            },
            items: {
                type: Array,
                value: [],
                notify: true,
                observer: 'clickActive',
            },
            validmessage: {
                type: String,
                notify: true
            },
            showlabel: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            openwarning: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            invalid: {
                type: Boolean,
                notify: true,
            },
            valid: {
                type: String,
                notify: true,
                computed: 'changeValid(invalid)',
                reflectToAttribute: true
            },
            required: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true
            },
            value: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            name: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            type: {
                type: String,
                notify: true,
                value: 'lang-menu'
            },
            list: {
                type: Array,
                notify: true,
            },
            notintoolbar: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            horizontalOffset: {
                type: Number,
                value: -2,
                notify: true
            },
            verticalOffset: {
                type: Number,
                value: 50,
                notify: true
            },
            horizontalAlign: {
                type: String,
                value: 'left',
                reflectToAttribute: true
            },
            openAnimationConfig: {
                type: Object,
                notify: true
            },
            closeAnimationConfig: {
                type: Object,
                notify: true
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'langMenu',
            },
            setvaluecallback: { type: Object }
        };
    }
    static get observers() {
        return [
            'checkRoutedLang(query)'
        ];
    }
    ready() {
        super.ready();
        this.addEventListener('iron-activate', this._onIronActivate.bind(this))
        this.addEventListener('iron-select', this._onIronSelect.bind(this))
        this._setAnimations()
        if (this.category) this.includeStyles(this.ElementName)
    }
    clickActive() {
        setTimeout(() => {
            let Active = Array.from(this.$.content.children).find(element => element.name === this.item)
            if (!!Active) Active.click()
        }, 500);
    }
    checkRoutedLang() {
        if (!this.notintoolbar && this.item !== this.query.lang) {
            this.setLocationUrl({ model: { __data: { item: this.item } } })
            document.querySelector('html').setAttribute('lang', this.item)
        }
    }
    changeValid(invalid) {
        this.openwarning = invalid
        return !invalid
    }
    validate() {
        if (this.required && !this.value.length) this.invalid = true;
        return this.valid;
    }
    _setResetValue(evt) {
        this.item = this.value = evt.model.__data.item
        this.checkRoutedLang()
    }
    _setValue(event) {
        if (this.item !== event.model.__data.item) {
            this.invalid = false
            this._setResetValue(event)
            if (typeof this.setvaluecallback === 'function') return this.setvaluecallback({ event, value: this.item })
        }
    }
    setLocationUrl(event) {
        let search = location.search.split(`&lang=${this.query.lang}`)
        //* !!search[1] ? console.log(search[1], this.item) : console.log(search, this.item)
        let url = !!search[1] ? `${location.pathname}${search[0]}&lang=${event.model.__data.item}${search[1]}` :
            `${location.pathname}${search[0]}&lang=${event.model.__data.item}`
        toggleSpinner(true)
        window.history.pushState({}, null, url);
        window.dispatchEvent(new CustomEvent('location-changed'));
    }
    _setAnimations() {
        this.openAnimationConfig = [
            {
                name: 'fade-in-animation',
                timing: {
                    duration: 450
                }
            },
            {
                name: 'slide-from-top-animation',
                timing: {
                    delay: 50,
                    duration: 400,
                    easing: config.ANIMATION_CUBIC_BEZIER
                }
            }
        ]
        this.closeAnimationConfig = [
            {
                name: 'fade-out-animation',
                timing: {
                    duration: 350
                }
            },
            {
                name: 'slide-up-animation',
                transformOrigin: '100 % 0',
                timing: {
                    delay: 50,
                    duration: 400,
                    easing: config.ANIMATION_CUBIC_BEZIER
                }
            }
        ]
    }
}
elementsDefine(appLangMenu.is, appLangMenu);

Object.keys(config).forEach(function (key) {
    appLangMenu[key] = config[key];
})
