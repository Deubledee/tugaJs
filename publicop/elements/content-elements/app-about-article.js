import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html, html as css } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html as litHtml, render } from 'lit-html';

import { AppArticleTemplate } from '../templates/app-article-template';

class appAboutArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get _getStyles() {
        return css`
        :host {
            display: block;
        }
        .article[show] {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: [col2] 640px;
            grid-template-rows: [row1] 170px [row3] 65px [row4] minmax(200px, auto);
            grid-template-areas:
                "images"
                "text"
                "description";
            align-items: baseline;
            align-content: space-evenly;
            align-items: start;
            justify-items: center;
        }
        .text-section,
        .description-section {
            width: 85%;
       }
        .text-section {     
            grid-area: text;
            display: flex;
            margin-bottom: 20px;
            flex-direction: row;
            justify-content: space-between;
        }
        .description-section {     
            grid-area: description;
        }
        .img-section {  
            grid-area: images;
            box-shadow: unset;
            display: unset;
            overflow: unset;
            border-radius: unset;
            width: 100%;
            height:auto;
            background: rgb(15 15 15 / 7%);
            padding-left: 9px;
            padding-right: 9px;
        }
        .title-text{
            width: 25%;   
        }
        .type-text {         
            height: 47px;
            width: 75%;
        }
        ::slotted(div[halfheight]) {
            box-shadow: 0px 0px 0px;
            height: 150px;
            width: 98%;
            padding: 5px;
            padding-top: 9px;
        }
        ::slotted(h2), :slotted(h4) {
            margin-block-start: 10.83px;
            margin-block-end: 10.83px 
        }`
    }
    static get _getArticleTemplate() {
        return html` 
            <article id="article" show$="[[show]]" class="article">                        
                <section id="image" class="img-section"> 
                    <div>
                        <slot name="[[article.id]]"></slot>         
                    </div>
                </section>                
                <section id="text" class="text-section">
                    <div class="title-text">
                        <slot name="title"></slot>
                    </div>
                    <div class="type-text">
                        <slot name="type"></slot>
                    </div>
                </section>                             
                <section id="description" class="description-section">
                    <div>
                        <slot name="description"></slot>
                    </div>
                </section>
            </article> `
    }
    static get is() { return 'app-about-article' }
    static get properties() {
        return {
            article: {
                type: Object,
                observer: '_slotContent'
            },
            edit: {
                type: Boolean,
                observer: '__checkIfValidEdit'
            },
            lang: {
                type: String,
            },
            show: {
                type: Boolean,
                value: false
            },
            current: {
                type: Number,
                value: 0
            },
            ElementName: {
                type: String,
                value: 'aboutArticle'
            },
            imageStyles: {
                type: String,
                value: `width: 100%;
                        height: 140px;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-origin: padding-box;
                        background-size: contain;`
            },
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this._setAnimations()
        this.includeStyles(this.ElementName)
    }
    _slotContent(data) {
        var mainTemplate = (article) => litHtml`
                ${this._getImageTemplate(article)}
                <h2 slot="title" class="about-title"> ${article.articleName} </h2>
                <div slot="type" id="type" class="about-type"> </div>
                <div slot="description" id="description" class="description"> </div>`
        render(mainTemplate(data), this)
        this._setText(data.type, "type")
        this._setText(data.description, "description")
    }
    _setAnimations() {
        let obj = {
            'entry': [
                {
                    name: 'fade-in-animation',
                    node: this.$.article
                },
            ],
            'exit': [
                {
                    name: 'fade-out-animation',
                    node: this.$.article
                },
            ],
            'imageEntry': [
                {
                    name: 'fade-in-animation',
                    node: this.children[0].children[0]
                }
            ],
            'imageExit': [
                {
                    name: 'fade-out-animation',
                    node: this.children[0].children[0]
                }
            ]
        }
        this.animationConfig = obj
    }
}
customElements.define(appAboutArticle.is, appAboutArticle);
