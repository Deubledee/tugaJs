
import { html, html as css } from '@polymer/polymer/polymer-element';

import { appMenuTemplate } from '../templates/app-menu-template'

const config = {
    ANIMATION_CUBIC_BEZIER: 'cubic-bezier(.3,.95,.5,1)',
    MAX_ANIMATION_TIME_MS: 400
};

export class appUserMenu extends appMenuTemplate {
    static get _getStyles() {
        return css`
            :host {
                width: 100%;
            }
            paper-item aside {
                width: 131px;
            }
            .loged-user {
                width: auto;
            }
            .loged-user,
            .loged-user-name {
                display: flex;
                flex-flow: row;
                align-items: center;
            }
            .loged-user[resolve] {
                width: 90px;
                justify-content: space-evenly;
                min-width: 50px;
            }
            .loged-user-name[resolve] {
                margin-inline-end: 10px;
            }
            .loged-user {
                width: 100%;
                padding: 0;
            }
            .login-img {
                height: 33px;
            }
            .login-img {
                border-radius: 20%;
            }
            paper-item {
                margin-top: 4px;
                margin-bottom: 4px;
                box-sizing: border-box;
                padding: 4px;
            }
            paper-listbox.user-dropdown-content {
                width: 190px;
                flex-direction: column;
                align-items: center;
            }`}

    static get _getTrigger() {
        return html`
            <div class="loged-user-name">
                <span resolve$="[[resolve]]" class="loged-user-name"> [[displayname]] </span>
                <img class="login-img" alt="[[displayname]] profile image" title="[[displayname]]" src="[[avatar]]"/>
            </div>`
    }
    static get _getContent() {
        return html`
             <paper-listbox id="content" selected="{{selected}}" id="userlistbox" class="user-dropdown-content dropdown-listbox">
                <paper-item>
                    <slot name="userprofile">
                        [[displayname]]
                    </slot>
                </paper-item>
                <paper-item>
                    <paper-icon-button
                        class="theme-anchor-aside"
                        style="text-align:left"
                        id="usericon"
                        name="usericon"
                        title="login"
                        icon="icons:power-settings-new">
                    </paper-icon-button>
                    <aside> log out </aside>
                </paper-item>
            </paper-listbox>`
    }
    static get is() {
        return 'app-user-menu';
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
                value: 'left',
                reflectToAttribute: true
            },
        };
    }
    ready() {
        super.ready();
        this.addEventListener('iron-activate', this._onIronActivate.bind(this))
        this.addEventListener('iron-select', this._onIronSelect.bind(this))
        this._setAnimations()
    }
    setResolve(data) {
        this.resolve = data
        if (this.firstElementChild)
            this.firstElementChild.addEventListener('click', this._onIronSelect.bind(this))
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
                    duration: 550
                }
            },
            {
                name: 'slide-up-animation',
                transformOrigin: '100 % 0',
                timing: {
                    delay: 150,
                    duration: 400
                }
            }
        ]
        /*
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
        ]*/
    }
}
customElements.define(appUserMenu.is, appUserMenu);

Object.keys(config).forEach(function (key) {
    appUserMenu[key] = config[key];
});
