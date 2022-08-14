import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import { AppArticleTemplate } from '../templates/app-article-template';

class appHerotArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get _getStyles() {
        return html`
        :host {
            display: block;
        }
        .article[show] {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: [col1] 600px;
            grid-template-rows: [row1] 140px [row3] auto;
            grid-template-areas:
                "images"
                "description";
            align-items: baseline;
            border-bottom: 0px;
            background-image: unset;
            box-shadow: unset;
        }       
        .description-section {     
            grid-area: description;           
        }
        .img-section {  
            grid-area: images;
            box-shadow: unset;
        }        
        .description-section {
            padding: 0;
        }     
         .article section {
            text-shadow: 0px 0px 2px #374156;
         }
        ::slotted(div[halfheight]) {
            box-shadow: 0px 0px 0px;
            height: 175px;
        }        
        `
    }
    static get _getArticleTemplate() {
        return html`       
            <article id="article" show$="[[show]]" class="article">               
                <section id="image" class="img-section"> 
                    <div>
                       <slot name="[[article.id]]"></slot>         
                    </div>
                </section>                 
                <section id="description" class="description-section">       
                 [[_getText(article.description)]]                 
                </section>    
            </article>       
            `
    }
    static get is() { return 'app-hero-article' }
    static get properties() {
        return {
            article: {
                type: Object,
                observer: 'setArticles'
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
            imageStyles: {
                type: String,
                value: `height: 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-origin: padding-box;
                        background-size: contain;`
            },
            offsetStart: {
                type: Number,
                value: 200
            },
            offsetEnd: {
                type: Number,
                value: 250
            },
            heightOffset: {
                type: Number,
                value: 100
            },
            ElementName: {
                type: String,
                value: 'hero'
            },
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.includeStyles(this.ElementName)
    }
    ready() {
        super.ready();
        this._setAnimations()
    }
    setArticles(article) {
        this._slotFristImage(article)
    }
    _getText(description) {
        let Q = new Quill(this.$.description, this.options)
        let parsed = !!description ? JSON.parse(description) : description
        setTimeout(() => {
            Q.setContents(parsed)
            Q.enable(false)
            this.killEditable()
        }, 60);
    }
    _setAnimations() {
        this.show = true
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
                    name: 'slide-from-right-animation',
                    node: this.children[0]
                }
            ],
            'imageExit': [
                {
                    name: 'slide-left-animation',
                    node: this.children[0]
                }
            ]
        }
        this.animationConfig = obj
    }
}
customElements.define(appHerotArticle.is, appHerotArticle);
