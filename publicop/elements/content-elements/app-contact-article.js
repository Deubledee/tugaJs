import { html, html as css } from '@polymer/polymer'
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { elementsDefine } from '../lib/methods';
import { html as litHtml, render } from 'lit-html';

import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppArticleTemplate } from '../templates/app-article-template';

class appContactArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get _getStyles() {
        return css`
        :host {
            display: block;
            width: 300px;
        }
        article[show] {
           display: block;
        }
        .article[show] {
            background-image: none;
            background-color: #fff;
            border-radius: 50%;
            min-width: 150px;
            max-width: 235px;
            height: 230px;
            margin: auto;
            /*box-shadow: -2px 3px 20px 0px rgb(162 162 162);*/
        }
        .article-center[show] {
            display: grid;
            grid-template-columns: [col1] auto;
            grid-template-rows: [row9] 80px [row2] 60px [row] 80px;
            grid-template-areas:
            "images"
            "text"
            "description";
            border-radius: 50%;
            height: 230px;
            margin: auto;
            width: 235px;
            box-shadow: inset 0px -2px 6px 0px #7d7d7d;
            /*box-shadow: inset 0px -4px 13px 2px #374156
           box-shadow: inset 1px -3px 8px -1px #696565;*/
        }
        
        .text-section {
            grid-area: text;
            margin-bottom: 20px;
        }
        .description-section {
            grid-area: description;
        }
        .img-section {
            grid-area: images;
            box-shadow: unset;
        }
        ::slotted(div[halfheight]) {
            box-shadow: 0px 0px 0px;
            width: 100%;
            height: 50px;
        }
        `
    }
    static get _getArticleTemplate() {
        return html`       
            <article id="article" show$="[[show]]" class="article">
                <div show$="[[show]]" class="article-center">
                    <section id="text" class="text-section">
                        <div>
                            <slot name="type"></slot>
                        </div>
                    </section>
                    <section id="image" class="img-section">
                        <div>
                            <slot name="[[article.id]]"></slot>
                        </div>
                    </section>
                    <section id="description" class="description-section">
                        <div>
                            <slot name="description"></slot>
                        </div>
                    </section>
                </div>
            </article>`
    }
    static get is() { return 'app-contact-article' }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'contact-item'
            },
            article: {
                type: Object,
                observer: '_slotContent'
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
            offsetStart: {
                type: Number,
                value: 200
            },
            offsetEnd: {
                type: Number,
                value: 250
            },
            ElementName: {
                type: String,
                value: 'contact'
            },
            imageStyles: {
                type: String,
                value: `height: 100%;
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
                <div slot="type" id="type"> </div>
                <div slot="description" id="description"> </div>`
        render(mainTemplate(data), this)
        this._setText(data.type, "type")
        this._setText(data.description, "description")
    }
    _setAnimations() {
        let obj = {
            'entry': [],
            'exit': []
        }
        this.animationConfig = obj
    }
}
elementsDefine(appContactArticle.is, appContactArticle);
