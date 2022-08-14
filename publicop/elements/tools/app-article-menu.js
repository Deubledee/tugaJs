
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import { html as css, html } from '@polymer/polymer/polymer-element';
import { appMenuTemplate } from '../templates/app-menu-template';;

const config = {
    ANIMATION_CUBIC_BEZIER: 'cubic-bezier(.3,.95,.5,1)',
    MAX_ANIMATION_TIME_MS: 400
};

export class appArticleMenu extends mixinBehaviors([
    IronFormElementBehavior,
    IronValidatableBehavior], appMenuTemplate) {
    static get _getStyles() {
        return css`
            /*
            *THis is the one 
            */
            .dropdown-content{
               min-height: 200px; 
            }
            paper-listbox.lang-dropdown-content {
                width: 120px;
                height: 192px;
                flex-wrap: nowrap;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
            }

            .alt{
                display: flex;
                flex-direction: row;
                padding-inline-start: unset;
                height: 30px;
                align-content: space-around;
                align-items: baseline;
            }

            /*.item-text {
                flex-basis: 60%;
                padding: 4px;
                cursor: pointer;
                font-weight: initial;
                letter-spacing: initial;
            }*/
            
            .item-btn {
                flex-basis: 40%;
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
                width: 92%;
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

            .item-btn {
                text-align: end;
            }
            #item-text[valid]{
                color: red
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
                <div id="item-text" valid$=[[!valid]] class="item-text" title="[[itemlabel]]" name="[[itemlabel]]" aria-label="mode-category">
                    [[dataActive]]
                </div>
                <div class="item-btn">
                    <paper-icon-button name="langicon" icon="arrow-drop-down">
                    </paper-icon-button>
                </div>
            </div>`
    }
    static get _getContent() {
        return html`
        <div class="dropdown-content" custom$="[[custom]]" slot="dropdown-content">
            <paper-listbox id="content" custom$="[[custom]]" selected="{{selected}}" value="[[value]]" name="languagesListbox"
                class="lang-dropdown-content dropdown-listbox">
                <dom-repeat repeat items="[[parsedContent]]" as="item">
                    <template>
                        <paper-item name="[[item.articleName]]" title="[[item.description]]" value="[[item.langs]]" class="form-al" on-click="_setValue">
                            [[item.articleName]]
                        </paper-item>
                    </template>
                </dom-repeat>
            </paper-listbox>
        </div>
        `
    }
    static get is() {
        return 'app-article-menu';
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
            parsedContent: {
                type: String,
                value: false,
                computed: 'computeMenuContent(items)'
            },
            dataActive: {
                type: String,
                value: '',
                notify: true
            },
            validmessage: {
                type: String,
                notify: true
            },
            custom: {
                type: String,
                value: false,
                reflectToAttribute: true,
                computed: 'getName(name)'
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
                value: 'app-menu'
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
            category: {
                type: Object,
                notify: true
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
                value: 'appArticleMenu',
            },
            setvaluecallback: { type: Object }
        };
    }

    ready() {
        super.ready();
        this.addEventListener('iron-activate', this._onIronActivate.bind(this))
        this.addEventListener('iron-select', this._onIronSelect.bind(this))
        this._setAnimations()
        if (this.category) this.includeStyles(this.ElementName)
    }
    getName(name) {
        return name
    }
    computeMenuContent(items) {
        return items
    }
    clickActive() {
        let { formTable, formData } = this.item, dataActive
        if (!!formData) dataActive = formData[formTable.property][0]
        setTimeout(() => {
            let Active = Array.from(this.$.content.children)
                .find(element => element.name === dataActive)
            if (!!Active) Active.click()
        }, 500);
    }
    _setValue(evt) {
        if (this.dataActive !== evt.model.__data.item.articleName) {
            this.invalid = false
            this._setResetValue(evt.model.__data.item)
            this.setvaluecallback({ event: evt, value: this.value })
        }
    }
    _setResetValue(article) {
        let { articleName, description } = article
        this.value = JSON.stringify({ ...article })
        this.dataActive = articleName
        this.itemlabel = description
    }
    changeValid(invalid) {
        this.openwarning = invalid
        if (invalid) this.dataActive = '*'
        return !invalid
    }
    validate() {
        if (this.required && !this.value || this.value && !this.value.length) this.invalid = true;
        return this.valid;
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
elementsDefine(appArticleMenu.is, appArticleMenu);

Object.keys(config).forEach(function (key) {
    appArticleMenu[key] = config[key];
})
