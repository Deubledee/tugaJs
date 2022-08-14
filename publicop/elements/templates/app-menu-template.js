
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior'
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { IronControlState } from '@polymer/iron-behaviors/iron-control-state.js';
import { microTask } from '@polymer/polymer/lib/utils/async';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import '@polymer/neon-animation/neon-animations'
import { mixInScope } from '../lib/methods';
import { includeStyles } from './lib/article-template_lib';


if (module.hot) module.hot.accept()
const config = {
    ANIMATION_CUBIC_BEZIER: 'cubic-bezier(.3,.95,.5,1)',
    MAX_ANIMATION_TIME_MS: 400
};

export class appMenuTemplate extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior,
        IronControlState,
        IronA11yAnnouncer], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                padding: 8px;
                outline: none;
            }
            :host([disabled]) {
                cursor: auto;
                color: var(--disabled-text-color);
            }
            main {
                display: flex;
                flex-direction: column;
            }
            .label-slot,
            .warning-slot{
                display: none;
            }
            div[showlabel],
            div[openwarning]{
                display: block;
            }
            .dropdown-content {
                display: flex;
                position: relative;
                background-color: transparent;
                justify-content: space-evenly;
            }
            :host([vertical-align="top"])
            .dropdown-content {
                margin-bottom: 20px;
                margin-top: -10px;
                top: 10px;
            }
            :host([vertical-align="bottom"])
            .dropdown-content {
                bottom: 10px;
                margin-bottom: -10px;
                margin-top: 20px;
            }
            #trigger {
                cursor: pointer;
            }
            paper-item {
                display: flex;
                align-items: center;
                justify-content: space-around;
                color: var(--app-secondary-background-color);
                padding: 0;
                border-radius: 10px;
                box-shadow: 0px 0px 2px 0px #ffffff;
            }   
            paper-listbox.dropdown-listbox {
                display: flex;
                background: rgb(55 65 86 / 46%);
                border-radius: 9px;
                z-index: 5;
            }
            .item-text {
                flex-basis: 60%;
                padding: 4px;
                cursor: pointer;
                font-weight: initial;
                letter-spacing: initial;
            }
            ${this._getStyles}
        </style>
            ${this.launchRouter}
        <main>
            <div class="label-slot" showlabel$="[[showlabel]]">
                <slot name="label"></slot>
            </div>
            <div class="dropdown-area">
                <div id="trigger" on-tap="toggle">
                    ${this._getTrigger}
                </div>
                <iron-dropdown id="dropdown"
                    opened="{{opened}}"
                    horizontal-align="[[horizontalAlign]]"
                    vertical-align="[[verticalAlign]]"
                    dynamic-align="[[dynamicAlign]]"
                    horizontal-offset="[[horizontalOffset]]"
                    vertical-offset="[[verticalOffset]]"
                    no-overlap="[[noOverlap]]"
                    open-animation-config="[[openAnimationConfig]]"
                    close-animation-config="[[closeAnimationConfig]]"
                    no-animations="[[noAnimations]]"
                    focus-target="[[_dropdownContent]]"
                    allow-outside-scroll="[[allowOutsideScroll]]"
                    restore-focus-on-close="[[restoreFocusOnClose]]"
                    on-iron-overlay-canceled="__onIronOverlayCanceled"
                    expand-sizing-target-for-scrollbars="[[expandSizingTargetForScrollbars]]">
                        ${this._getContent}
                </iron-dropdown>
            </div>
            <div class="warning-slot" openwarning$="[[openwarning]]">
                <slot name="warning"></slot>
            </div>
        </main>
        `
    }
    static get _getStyles() {
        return html``
    }
    static get launchRouter() {
        return html``
    }
    static get _getTrigger() {
        return html``
    }
    static get _getContent() {
        return html`
         <div class="dropdown-content" slot="dropdown-content">
             <paper-listbox
                id="content"
                selected="{{selected}}"
                class="dropdown-content">
                    <paper-item>                           
                    </paper-item>
            </paper-listbox>
        </div>`
    }
    static get is() {
        return 'app-menu-template';
    }
    static get properties() {
        return {
            unsellectPage: {
                type: Object
            },
            opened: {
                type: Boolean,
                value: false,
                notify: true,
                observer: '_openedChanged'
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
            horizontalAlign: {
                type: String,
                value: 'left',
                reflectToAttribute: true
            },
            verticalAlign: {
                type: String,
                value: 'top',
                reflectToAttribute: true
            },
            dynamicAlign: {
                type: Boolean
            },
            horizontalOffset: {
                type: Number,
                value: 0,
                notify: true
            },
            verticalOffset: {
                type: Number,
                value: 0,
                notify: true
            },
            noOverlap: {
                type: Boolean
            },
            noAnimations: {
                type: Boolean,
                value: false
            },
            ignoreSelect: {
                type: Boolean,
                value: false
            },
            closeOnActivate: {
                type: Boolean,
                value: false
            },
            openAnimationConfig: {
                type: Object,
                notify: true
            },
            closeAnimationConfig: {
                type: Object,
                notify: true
            },
            allowOutsideScroll: {
                type: Boolean,
                value: false
            },
            restoreFocusOnClose: {
                type: Boolean,
                value: true
            },
            expandSizingTargetForScrollbars: {
                type: Boolean,
                value: false
            },
            _dropdownContent: {
                type: Object
            }
        };
    }
    ready() {
        super.ready();
        this.role = 'group'
        this['aria-haspopup'] = 'true'
        mixInScope.call(this, { includeStyles })
    }
    toggle() {
        if (this.opened) return this.close();
        this.open();
    }
    open() {
        if (this.disabled) return;
        this.$.dropdown.open();
    }
    close() {
        this.$.dropdown.close();
    }
    _onIronSelect(event) {
        if (event) this.close();
    }
    _onIronActivate(event) {
        if (this.closeOnActivate && event) this.close();
    }
    _disabledChanged(disabled) {
        IronControlState._disabledChanged.apply(this, arguments);
        if (disabled && this.opened) this.close();
    }
    __onIronOverlayCanceled(event) {
        let { detail: { target } } = event
        if (target.tagName === this.tagName) event.preventDefault()
    }
    _openedChanged(opened) {
        if (opened) return this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
            this.dispatchEvent(new CustomEvent('paper-dropdown-close', {
                bubbles: true,
                composed: true
            }));
        });
        this._dropdownContent = this.contentElement;
        this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
            this.dispatchEvent(new CustomEvent('paper-dropdown-open', {
                bubbles: true,
                composed: true
            }));
        });
    }

}

/*
Object.keys(config).forEach(function (key) {
    appUserMenu[key] = config[key];
});*/
