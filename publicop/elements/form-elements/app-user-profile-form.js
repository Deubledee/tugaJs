
import { html, PolymerElement } from "@polymer/polymer";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { elementsDefine } from '../lib/methods';
import { Methods } from "../util/mixins/user-profile-form_mixin";

class appUserProfileForm extends mixinBehaviors([Methods], PolymerElement) {
    static get template() {
        return html`
        <style>
          .user-form  {
                background: #ffffff;
                border-radius: 20px;
                width: 100%;
                min-height: 800px;
                height: auto;
            }
            .icon-text {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
        </style>
        <div class="user-form">
            <slot></slot>
        </div>
        `
    }
    static get is() { return "app-user-profile-form" }
    static get properties() {
        return {
            id: {
                type: String,
            },
            toolarticle: {
                type: Object
            },
            category: {
                type: Object
            },
            statusmethod: {
                type: Object
            },
            defaultcancel: {
                type: Object
            },
            areas: {
                type: Object
            },
            form: {
                type: Object
            },
            warnings: {
                type: Object
            },
            editarticle: {
                type: String,
            },
            defaultformcallback: {
                type: Object
            },
            formkeys: {
                type: Array
            },
            edit: {
                type: Boolean
            },
            content: {
                type: Object,
            },
            lang: {
                type: String,
                observer: "getUserProfileForm"
            },
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
    }
}
elementsDefine(appUserProfileForm.is, appUserProfileForm);
