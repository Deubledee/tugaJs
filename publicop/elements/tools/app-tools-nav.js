
import { html, html as css, PolymerElement } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import { elementsDefine } from '../lib/methods';
import { includeStyles } from '../templates/lib/article-template_lib';

export class appToolsNav extends PolymerElement {
    static get template() {
        return html`
         <style>
            ${this._getStyles}
        </style> 
       ${this._getToolsNavTemplate}`
    }

    static get _getStyles() {
        return css`    
        :host {
            width: 100%;
        }           
        app-toolbar.tools-nav{
            display: flex;
            width: 90vw;
            height: 55px;
            flex-direction: row;
            border-radius: 20px;
            align-items: stretch;
            margin-left: auto;
            margin-right: auto;
        }
        .each-side-area {
            display: none;
            justify-content: space-between;

        }
        .spread-area {
            display: none;
            justify-content: space-evenly;

        }
        .spread-area[spread], .each-side-area[eachside]{
            display: flex;
            width: 100%;
            align-items: flex-end;
            flex-wrap: nowrap;
        }
        paper-tabs {
            height: auto;  
        }
       /* paper-tabs.left{
            width: 300px
        }*/
        paper-tabs.right{
            text-align: end;
        }
        `
    }
    static get _getToolsNavTemplate() {
        return html`
        <main>
            <app-toolbar class="tools-nav"> 
                <nav
                    eachside$=[[eachside]] 
                    class="each-side-area paper-tabs">
                    <paper-tabs
                        id="tools" 
                        class="paper-tabs left"
                        attr-for-selected="item-name">
                        <div>
                            <slot name="left"></slot>   
                        </div>  
                    </paper-tabs>
                    <paper-tabs
                        id="tools" 
                        class="paper-tabs right"
                        attr-for-selected="item-name">                                         
                            <slot name="right"></slot> 
                    </paper-tabs>
                </nav>
                <nav 
                    spread$=[[spread]] 
                    class="spread-area">
                    <paper-tabs
                        class="spread-even"
                        attr-for-selected="item-name">                     
                            <slot name="spread"></slot>                                       
                    <paper-tabs>
                </nav>
            </app-toolbar>
        </main>`
    }
    static get properties() {
        return {
            eachside: {
                type: Boolean,
                notify: true,
                value: false,
                reflectToAttribute: true
            },
            spread: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true
            },
            navlayout: {
                type: String,
                notify: true,
                observer: '_toggleLayout'
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'toolsNav'
            }
        };
    }
    static get is() {
        return 'app-tools-nav';
    }
    ready() {
        super.ready();
        includeStyles.call(this, this.ElementName)
    }
    _toggleLayout(propString) {
        if (propString in this)
            this[propString] = true
    }
}

elementsDefine(appToolsNav.is, appToolsNav);
