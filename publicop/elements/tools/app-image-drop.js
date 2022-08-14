
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { toggleSpinner, elementsDefine } from '../lib/methods';;

import { includeStyles, _registerSize } from '../templates/lib/article-template_lib';
import { localDataEventFactory } from '../util/classes/Asset_Event-class';
import { GetImageChecksum, upload } from '../lib/storage';
import { AssetEventFactory } from '../util/classes/Asset_Event-class';


class appImageDrop extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], PolymerElement) {
    static get is() { return 'app-image-drop' }
    static get template() {
        return html`
        <style>
            :host {
                width: 100%;
                display: inline-block;
                position: relative;
                box-sizing: border-box;                
            } 

            .flexchildbotomFull{
                box-sizing: border-box;
                background-color: var(--app-item-backgound-color);
                border-radius: 10px;
                padding: 26px;
                cursor: pointer;
                flex: unset;
                width: auto;
                -webkit-transition: padding 0.5s ease-out;
                -moz-transition: padding 0.5s ease-out;
                transition: padding 0.5s ease-out;
            } 
            .flexchildbotomFull[hovered]{
                background-color: var(--app-item-backgound-color);
                padding: 35px; 
                transition: padding 0 ease 0.5;
            }
             .droparea section {
                    display: flex;
                    margin-left: unset;
                    margin-right: unset;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
            }   
            .recorte{
                border-style: dashed;
                border-radius: 8px;
                border-color: var(--divider-color);
                height: 292px;
                padding: 69px;
                -webkit-transition: background-color 0.5s ease-in, height 0.5s ease-out;
                -moz-transition: background-color 0.5s ease-in, height 0.5s ease-out;
                transition: background-color 0.5s ease-in, height 0.5s ease-out;
            }
            .recorte[hovered]{
                background-color: #7d7d7d;
                height: 278px;
            }
            .recorte section{
                display: flex;
                flex-direction: column;
            }
            .recorte section aside{
                margin-left: auto;
                margin-right: auto;
            }
            iron-icon[icon="editor:space-bar"],
            iron-icon[icon="arrow-downward"],p {
                 color: var(--paper-grey-400);
                -webkit-transition: color 0.5s ease-in;
                -moz-transition: color 0.5s ease-in;
                transition: color 0.5s ease-in;
            }
            iron-icon[hovered][icon="editor:space-bar"],
            iron-icon[hovered][icon="arrow-downward"],p[hovered]{
                color: white
            } 
            iron-icon[icon="editor:space-bar"]{
                width: 95px;
                height: 84px;
                padding: unset;              
            }
            iron-icon[icon="arrow-downward"]{
                max-height: unset;
                height: 107px;
                width: 93px;
            }
            .upper{
                position: relative;
                top: -58px; 
            }              
          /*  input{
                visibility: collapse
            }*/
        </style>           
        <app-location route="{{route}}">
        </app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}" active="{{active}}"
            query-params="{{query}}">
        </app-route>
        <main class="droparea">
            <div id="article" class="flexchildbotomFull" hovered$="[[hovered]]" on-mouseover="_hovered" on-mouseout="_unhovered" on-dragenter="_hovered" on-dragover="_dropover" on-drop="_droped">
                <section on-click="openLocalSource" class="recorte" hovered$="[[hovered]]" >
                    <aside>
                        <iron-icon icon="arrow-downward" hovered$="[[hovered]]" >
                        </iron-icon>
                    </aside>
                    <aside class="upper">
                        <iron-icon icon="editor:space-bar" hovered$="[[hovered]]" >
                        </iron-icon>
                    </aside>
                    <aside class="upper" >
                        <p hovered$="[[hovered]]">
                            [[message]]
                        </p>
                    <aside>                   
                </section>
            </div>  
        </main>`
    }
    static get properties() {
        return {
            query: {
                type: Object
            },
            scope: {
                type: Boolean,
            },
            table: {
                type: Boolean,
                notify: true,
                value: false,
                observer: 'setupTable'
            },
            lang: {
                type: String,
            },
            _message: {
                type: String,
                notify: true
            },
            defaultMessage: {
                type: String,
                value: 'arraste imagem para ou clique aqui'
            },
            message: {
                type: String,
                notify: true,
                computed: 'getTheMessage(defaultMessage, _message)'
            },
            hovered: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true,
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'imageDrop',
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        //  includeStyles.call(this, this.ElementName)       
    }
    getTheMessage(defaultMessage, _message) {
        return _message || defaultMessage
    }
    setupTable(formTable) {
        let { element } = formTable
        this.Table = !!element ? element : formTable
        this._message = this.Table[this.lang]
        this.callbackMethod = this.scope[this.Table.method] ?
            this.scope[this.Table.method].bind(this.scope) :
            () => console.log('no method found', this.Table.method, this.scope);
    }
    openLocalSource(evt) {
        let { AssetEvent } = this.parseEvent(evt)
        let inputElement = document.createElement('input')
        inputElement.addEventListener('change', ({ target }) => this.storeImage
            .call(this, localDataEventFactory.call(this, { ...AssetEvent, files: target.files }, target)))
        inputElement.setAttribute('type', 'file')
        inputElement.click()
    }
    parseEvent(evt) {
        evt.preventDefault()
        let { target } = evt
        let AssetEvent = AssetEventFactory(evt, this.Table, [], 'url')
        return { AssetEvent, target }
    }
    _droped(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        let { AssetEvent, target } = this.parseEvent(evt)
        evt.dataTransfer.getData(evt)
        let file = evt.dataTransfer.files[0]
        this.storeImage.call(this, localDataEventFactory.call(this, { ...AssetEvent, files: file }, target))
    }
    _dropover(evt) {
        evt.stopPropagation()
        evt.preventDefault()
    }
    async storeImage(AssetEvent) {
        toggleSpinner(true)
        let { Table, files, target } = AssetEvent;
        let { prefix, gallery, folder } = this.getFilePathNameParts()
        await upload.call(this, Table, files[0], prefix, folder, gallery)
            .then(Files => this
                .callbackMethod(localDataEventFactory.call(this, { ...AssetEvent, files: Files }, target)))
            .catch(console.log)
    }
    getFilePathNameParts() {
        let { areas: { store: { prefix, folder } } } = this.scope.requestcategory
        let gallery = this.gallery;
        if (this.gallerytype !== 'main') {
            folder = gallery;
            gallery = this.gallerytype;
        }
        return { prefix, gallery, folder };
    }
    _hovered(evt) {
        evt.preventDefault()
        this.hovered = true
    }
    _unhovered(evt) {
        evt.preventDefault()
        this.hovered = false
    }
}
elementsDefine(appImageDrop.is, appImageDrop);
