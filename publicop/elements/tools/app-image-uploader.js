import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import '@polymer/iron-input/iron-input.js';
import { html as css, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import '@polymer/polymer/polymer-legacy.js';
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';
import { Methods } from '../util/mixins/image-uploader_mixin';


export class appImageUploader extends mixinBehaviors([
    IronFormElementBehavior, Methods], AppArticleTemplate) {
    static get _getStyles() {
        return css`
            :host{
                --default-color: transparent;
                --remove-icon-color: var(--default-color);
                --default-hover-color:rgb(55 65 86 / 55%);
            }
            input {
                display: none;
            }
            main {
                display: grid;
                grid-template-columns: [col1] auto [col2] 30px;
                grid-template-rows: [row1] 50px [row2] auto;
                grid-template-areas:"btn btn"
                                    "img img";
                justify-items: center;
                align-items: center;
            }
            .placeholder {
                padding-block: 5px;
                padding-inline: 5px;
            }
            div.btn-small,
            .btn-area {
                text-align: center;
            }
            .btn-container,
            .btn {
                color: var(--app-secondary-text-color);
                font-size: 1.2em;
                text-transform: capitalize;
            }
            .btn-container{
                grid-area: btn;
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: space-between;
            }
            .btn-normal {
                padding-block: 5px;
                padding-inline: 5px;
            }
            .image-container{
                grid-area: img;
                display: flex;
                flex-direction: row-reverse;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: flex-end;
                width: auto;
                height: 120px;
                overflow-x: hidden;
                overflow-y: auto;
                padding: 2px;
           }
           div.image-container::-webkit-scrollbar {
                width: 0px;
            }
           .image-container img {
                display: block;
                box-sizing: border-box;
                width: 120px;
                height: 120px;
                box-shadow: 0px 0px 4px rgb(136 135 135);
            } 
                       
            .img-holder:hover {
                --default-color: var(--default-hover-color);
            } 
            iron-icon.btn {
                display: block;
                cursor: pointer;
            }
            iron-icon.btn-floater[showremove] {
                display: block;
            }
            iron-icon.btn-floater {
                color: var(--remove-icon-color);
                float: right;
                position: relative;
                top: 28px;
                right: -5px;
            }
            iron-icon.btn-floater {
                display: none;
            }
            .img-holder {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                --remove-icon-color: var(--default-color);
            }`
    }
    static get _getArticleTemplate() {
        return html` 
        <app-location route="{{route}}">
        </app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}" active="{{active}}"
            query-params="{{query}}">
        </app-route>
        <main>      
            <div class="btn-container">
                <div class="placeholder">[[placeholder]]</div>
                <a  href="[[imagesHref]]"
                    on-click="_addImageFromGallery">
                    <iron-icon 
                        class="btn btn-normal" 
                        title="gallery" 
                        icon="image:add-a-photo">
                    </iron-icon>
                </a>
            </div>     
            <div class="image-container">
                <dom-repeat items="[[imageSrcs]]" as="src">
                    <template>
                        <div class="img-holder">
                            <iron-icon 
                                showremove$="[[showremove]]" 
                                class="btn btn-normal btn-floater" 
                                icon="icons:cancel">
                            </iron-icon>
                            <img src="[[src]]"/>
                        </div>
                    </template>
                </dom-repeat>
            </div>
        </main>`
    }
    static get is() { return 'app-image-uploader' }
    static get properties() {
        return {
            showremove: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true
            },
            close: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true
            },
            value: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            type: {
                type: String,
                notify: true
            },
            toolarticle: {
                type: Object,
                notify: true
            },
            areas: {
                type: Object,
                notify: true
            },
            _category: {
                type: Object,
                notify: true
            },
            category: {
                type: Object,
                notify: true,
                computed: '_setCategory(_category)'
            },
            remove: {
                type: Object,
                notify: true
            },
            lang: {
                type: String,
                notify: true
            },
            placeholder: {
                type: String,
                notify: true
            },
            valuetype: {
                type: String,
                notify: true
            },
            imagesHref: {
                type: String,
                notify: true
            },
            inputElement: {
                type: Object
            },
            dragg: {
                type: Boolean,
                value: false,
                observer: 'setDragg'
            },
            imageSrcs: {
                type: Array,
                value: []
            },
            _imageDefaultUrlIsSet: {
                type: Boolean,
                value: true
            },
            defaultNoimage: {
                type: String,
                value: '../../img/no-image-icon-23485.png'
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'imageUploader',
            },
            edit: {
                type: String,
                notify: true,
                observer: 'setEdit'
            },
            imageproperty: {
                type: String,
                notify: true
            }
        }
    }
    static get observers() {
        return [
            'routeChanged(query, route)'
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.includeStyles(this.ElementName)
    }
    ready() {
        super.ready();
        this.imageSrcs = [this.defaultNoimage]
    }
    routeChanged(query) {
        this.setHrefs(query)
    }
    _setCategory(category) {
        return { ...category }
    }
    _addImageFromGallery() {
        this.callGalleryPopup()
    }
    _getEditType() {
        return this.edit
    }
    setDragg(data) {
        if (!!data) this.setAttribute('draggable', true)
    }
}


elementsDefine(appImageUploader.is, appImageUploader);
