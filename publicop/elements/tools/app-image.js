import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/polymer/polymer-legacy.js';
import { elementsDefine } from '../lib/methods';
import './app-spinner';
import { includeStyles } from '../templates/lib/article-template_lib';

export class appImage extends PolymerElement {

    static get template() {
        return html`
    <style>
    .form-image, :host {
        display: block;
    }    

    app-spinner {
        display: none
    }
    .form-image {
        background-color: var(--app-image-background-color);
    }
    app-spinner,
    .form-image {
        width: 100%;
    }

    .form-image[active] {
        display: none
    }

    app-spinner[active] {
        display: block
    }
    
    </style>

    <div class="">
        <app-spinner active$="[[active]]">
        </app-spinner>
        <img
            active$="[[active]]"
            on-load="imageOnLoad"
            class="form-image"
            alt="[[imagealt]]"
            name="[[name]]"
            src="[[imagesrc]]">
        </img>
    </div>`
    }
    static get is() { return 'app-image' }
    static get properties() {
        return {
            active: {
                type: Boolean,
                value: true,
                reflectToAttribute: true
            },
            dragg: {
                type: Boolean,
                value: false,
                observer: 'setDragg'
            },
            nameproperty: {
                type: String
            },
            value: {
                type: String
            },
            imagealt: {
                type: String
            },
            category: {
                type: Object
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'appImage',
            },
            name: {
                type: String,
                reflectToAttribute: true
            },
            imagesrc: {
                type: String,
                value: '../../img/loading.png'
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this.includeStyles()
    }
    includeStyles() {
        if (this.category) includeStyles.call(this, this.ElementName)
    }
    imageOnLoad() {
        this.active = false;
    }
    setDragg(data) {
        if (!!data) this.setAttribute('draggable', true)
    }
}

elementsDefine(appImage.is, appImage);
