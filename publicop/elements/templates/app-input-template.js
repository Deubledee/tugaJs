import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { includeStyles, _registerSize, getCollorsTemplate, _setQuill } from './lib/article-template_lib';

if (module.hot) module.hot.accept()
export class appInputTemplate extends mixinBehaviors([
    IronFormElementBehavior,
    IronValidatableBehavior,
    IronA11yAnnouncer], PolymerElement) {
    static get template() {
        return html` 
        <style>
        main {
            display: flex;
            flex-direction: column;
        }
         .invalid {
            display: block;
            color: red;
         }
         .invalid[valid]{
             display: none;
         }                
        #slot-label{
            color: var(--app-secondary-text-color);
            font-size: 1.2em;
         }
            ${this._getStyles}
        </style>    
        ${this._getTemplate}
        `
    }

    static get _getStyles() {
        return html``
    }
    static get _getTemplate() {
        return html``
    }
    static get is() {
        return 'app-input-template';
    }
    static get properties() {
        return {
            lang: {
                type: String,
            },
            langs: {
                type: Object,
            },
            toolbar: {
                type: Object,
            },
            label: { type: String },
            validmessage: {
                type: String,
            },
            text: {
                type: String,
            },
            valid: {
                type: String,
            },
            required: {
                type: Boolean,
            },
            value: {
                type: String,
            },
            customColors: {
                type: Array
            },
            colorsTemplate: {
                type: Object,
            },
            type: {
                type: String
            },
            valuetype: {
                type: String,
            },
            toolbartype: {
                type: String,
            },
            category: {
                type: Object,
            },
            options: {
                type: Object,
            },
            item: {
                type: Object,
            },
            imagesAdded: {
                type: Array,
            },
            removeimage: Object,
            time: Number
        };
    }
    ready() {
        super.ready();
        _setQuill.call(this, this.setToolBar(this.toolbar))
    }
    includeStyles(...args) {
        includeStyles.call(this, ...args)
    }
    changeValid(invalid) {
        return !invalid
    }
    validate() {
        if (this.required && !this.value.length ||
            (this.value.length === 1 && this.value.charCodeAt() === 10))
            this.invalid = true;
        return this.valid;
    }
    _setValues(data) {
        _setQuill.call(this, this.setToolBar(this.toolbar))
        if (!!data) {
            if (!!data.join) {
                this.Quill.setText('')
                return
            }
            this.temp = this.item
            for (let par in data) {
                this.set('text', data[par])
            }
        }
    }
    setToolBar(toolbar) {
        const options = !!toolbar.toolbar && this.toolbartype !== 'notoolbar' ? {
            modules: toolbar,
            placeholder: 'Compose an epic...',
            theme: 'snow',
        } : {}
        return options
    }
    __setQuillData() {
        let article = this.edit
        if (this.valuetype === "text" || !article[this.name]) this.Quill.setText(this.value)
        if (this.encoding === 'base64' && this.value) this.value = JSON.parse(atob(this.value))
        if (this.valuetype === "delta") this.Quill.setContents(this.value) /**/
        this.setDataValues()
    }

    _setDelta(Q) {
        let delta = Q.getContents()
        this.value = this.encoding === 'base64' ? btoa(JSON.stringify(delta)) : JSON.stringify(delta)
    }
    _setText(Q) {
        let text = Q.getText()
        this.value = this.encoding === 'base64' ? btoa(text) : text
    }

    chekForImage(ops) {
        let idx = !!ops.retain ? ops.retain++ : 1,
            baseUrl = 'https://firebase'
        if (ops.insert && ops.insert.image && ops.insert.image.includes(baseUrl)) {
            let { image } = ops.insert
            this.imagesAdded.push({ idx, image })
            return
        }
        if (ops.delete && this.imagesAdded.length > 0 && ops.delete <= this.imagesAdded.length) {
            let imageIndex = this.imagesAdded.findIndex(added => added.idx === idx)
            this.removeimage(imageIndex, () => this.imagesAdded.splice(imageIndex, imageIndex + 1))
        }
    }
    setListners() {
        this.Quill.on('text-change', (evt) => {
            this.invalid = false
            if (evt.ops[0] && evt.ops[0].insert || evt.ops[0].delete)
                this.chekForImage(evt.ops[0])
            if (evt.ops[1]) this.chekForImage(evt.ops[1])
            this.setDataValues()
        });
        this.Quill.on('selection-change', (evt) => this.setDataValues());
        this.Quill.on('editor-change', (evt) => this.setDataValues());
    }
    setDataValues() {
        if (this.valuetype === "delta")
            return this._setDelta(this.Quill)
        this._setText(this.Quill)
    }
    setCollorsOption() {
        if (this.toolbartype !== 'notoolbar') {
            let controls = this.Quill.getModule('toolbar').controls
            let go = controls.filter(control => control.find(item => item === 'color' || item === 'background'))
            if (!go.length) return
            let collorElement = controls[controls.length - 2][1],
                backgroundElement = controls[controls.length - 1][1],
                qlPicker = collorElement.previousElementSibling,
                qlPicker2 = backgroundElement.previousElementSibling
            this._setCollorTemplate(qlPicker, "color")
            this._setCollorTemplate(qlPicker2, "background")
        }
    }
    _setCollorTemplate(qlPicker, type) {
        let parent = qlPicker.children[1]
        this.colorsTemplate[type] = Array.from(parent.children)
        getCollorsTemplate.call(this, parent, type, undefined)
    }
}
