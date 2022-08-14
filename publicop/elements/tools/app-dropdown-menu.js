
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html } from '@polymer/polymer/polymer-element';
import { elementsDefine } from '../lib/methods';
import { appMenuTemplate } from '../templates/app-menu-template';
import { Methods } from '../util/mixins/dropdown-menu_mixin.js';

/**
 * * standart multiuse dropdown menu
 * * Extends
 * @param {appMenuTemplate} PolymerElement
 * * styles in css/main.style.css
 * * {use}
 * * {! Madatory ? optional * avalaible or should use}
 * * <app-dropdown-menu
 * *  class="dropdown-menu"
 * ! .category="(${category} / litElement) || ([[category]] || {{category}} / Polymer)"
 * *  vertcal-align="top"
 * *  horizontal-align="left">
 * ! <div slot="trigger" class="galleries-menu">
 *      <aside class="theme-anchor theme-anchor-aside">
 * ?      <iron-icon icon="icons:perm-media">
 * ?      </iron-icon>
 *      </aside>
 *      <aside>
 * *      (${text} / litElement) || ([[text]] || {{text}} / Polymer)
 *      </aside>
 * ! </div>
 * * </app-dropdown-menu>
 **/

const config = {
    ANIMATION_CUBIC_BEZIER: 'cubic-bezier(.3,.95,.5,1)',
    MAX_ANIMATION_TIME_MS: 400
};

export class appDropdownMenu extends mixinBehaviors([Methods], appMenuTemplate) {
    static get _getStyles() {
        return html`
            :host {
                width: 100%;
            }            
            .trigger-slot {
                display: flex;
                flex-flow: row;
                align-items: center;
            }           
            .trigger-slot[resolve] {
                margin-inline-end: 10px;
            }
            ::slotted(paper-item) {
                margin-top: 4px;
                margin-bottom: 4px;
                box-sizing: border-box;
                padding: 4px;
            }
            slot[name=item] ~ .menu-item) {
                width: 131px;
                color: #fff
            }
            paper-listbox.menu-dropdown-content {
                width: 190px;
                flex-direction: column;
                align-items: center;
            }`}

    static get _getTrigger() {
        return html`
            <div class="trigger-slot">
                <slot name="trigger" > </slot>
            </div>`
    }
    static get _getContent() {
        return html`
            <paper-listbox id="content" selected="{{selected}}" id="userlistbox" class="menu-dropdown-content dropdown-listbox">
                <slot name="item">
                    <paper-item>
                        <aside class="menu-item"></aside>
                    </paper-item>
                </slot>
            </paper-listbox>`
    }
    static get is() {
        return 'app-dropdown-menu';
    }
    static get properties() {
        return {
            displayname: {
                type: String,
                notify: true,
            },
            avatar: {
                type: String,
                notify: true,
            },
            resolve: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true
            },
            resolved: {
                type: Boolean,
                notify: true,
                observer: 'setResolve'
            },
            horizontalOffset: {
                type: Number,
                value: -30,
                notify: true
            },
            verticalOffset: {
                type: Number,
                value: 50,
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
            horizontalAlign: {
                type: String,
                reflectToAttribute: true
            },
            category: {
                type: Object
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.ElementName = 'dropDownMenu'
        this.includeStyles(this.ElementName)
    }
    ready() {
        super.ready();
        this.addEventListener('iron-activate', this._onIronActivate.bind(this))
        this.addEventListener('iron-select', this._onIronSelect.bind(this))
        this.firstElementChild.addEventListener('click', this._onIronSelect.bind(this))
        this._setAnimations()
    }
    setResolve(data) {
        this.resolve = data
    }
    _setAnimations() {
        this.openAnimationConfig = [
            { name: 'fade-in-animation', timing: { delay: 100, duration: 200 } },
            {
                name: 'paper-menu-grow-width-animation',
                timing: {
                    delay: 100,
                    duration: 150,
                    easing: config.ANIMATION_CUBIC_BEZIER
                }
            },
            {
                name: 'paper-menu-grow-height-animation',
                timing: {
                    delay: 100,
                    duration: 275,
                    easing: config.ANIMATION_CUBIC_BEZIER
                }
            }
        ]
        this.closeAnimationConfig = [
            {
                name: 'fade-out-animation',
                timing: {
                    duration: 450
                }
            },
            {
                name: 'paper-menu-shrink-width-animation',
                timing: {
                    delay: 0,
                    duration: 500,
                    easing: config.ANIMATION_CUBIC_BEZIER
                }
            },
            {
                name: 'paper-menu-shrink-height-animation',
                timing: {
                    duration: 500,
                    easing: 'ease-in'
                }
            }
        ]
    }
}
elementsDefine(appDropdownMenu.is, appDropdownMenu);

Object.keys(config).forEach(function (key) {
    appDropdownMenu[key] = config[key];
});
