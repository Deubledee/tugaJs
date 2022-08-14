
import { html, html as css } from '@polymer/polymer/polymer-element';
import { appInputTemplate } from '../templates/app-input-template';
import { elementsDefine } from '../lib/methods';
export class appTextarea extends appInputTemplate {
    static get _getStyles() {
        return css`
        .mirror-text {
            display: none
        }
        .container-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-weight: bold;
            padding: 8px 0px 8px 0px;
            letter-spacing: 1.2px;
            font-size: 13px;
        }  
        #slot-label {
            background: var(--app-backgound-color);
            width: 50%;
            letter-spacing: 2px;
            color: var(--app-secondary-text-color);
            font-size: 1rem;
            padding: 0px 4px 0px 4px;
            box-shadow: 0px 1px 3px -1px #c6c3c3;
            box-sizing: border-box;
            height: 23px;
            border-radius: 4px;;
        }
        .btn-container{
            display: flex;
            width: 183px;
        }`
    }
    static get _getTemplate() {
        return html`
        <main>
            <div class="container-row">
                <div id="slot-label">
                    <label for="slot"> 
                            [[label]]
                    </label>
                </div>
                <div valid$="[[valid]]" class="invalid"> *[[validmessage]] </div>
            </div>
            <div id="slot-quill">
                <slot></slot>
            </div>
        </main>
        `
    }
    static get properties() {
        return {
            lang: {
                type: String,
                notify: true,
            },
            langs: {
                type: Object,
                value: {}
            },
            toolbar: {
                type: Object,
                notify: true
            },
            label: { type: String },
            validmessage: {
                type: String,
                notify: true
            },
            text: {
                type: String,
                notify: true
            },
            invalid: {
                type: Boolean,
                notify: true,
                value: false,
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
                value: '',
                reflectToAttribute: true
            },
            name: {
                type: String,
                notify: true,
                value: '',
                reflectToAttribute: true
            },
            customColors: {
                type: Array
            },
            colorsTemplate: {
                type: Object,
                value: {}
            },
            type: {
                type: String
            },
            valuetype: {
                type: String,
                notify: true,
            },
            toolbartype: {
                type: String,
                notify: true,
            },
            category: {
                type: Object,
            },
            options: {
                type: Object,
            },
            item: {
                type: Object,
                value: '',
                notify: true
            },
            imagesAdded: {
                type: Array,
                value: []
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'textArea'
            },
            removeimage: Object,
            time: Number
        };
    }
    static get is() {
        return 'app-textarea';
    }

    ready() {
        super.ready();
        this.includeStyles(this.ElementName)
        this.click()
    }
}
elementsDefine(appTextarea.is, appTextarea);
