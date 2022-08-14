
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html as css, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html as litHtml, render } from 'lit-html';
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';


class appServicesArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get is() { return 'app-services-article' }
    static get _getStyles() {
        return css`
        article[show]{
            justify-items: center;
        }
        .img-section {
            grid-area: images;
           /* background: #e6e8eb;*/
            border-radius: 0;
            background-image: linear-gradient(138deg, #d7d9db 0%, #eeeeee 20%); 
        }
        .img-section[reverse] {             
            background-image: linear-gradient(-138deg, #d7d9db 0%, #eeeeee 20%);
        } 
        .text-section {
            grid-area: text;
            text-align: left;
        }
        #image{
            box-shadow: 0px 0px 10px 2px #c3c4c5;
        }
        article[row]{
            grid-template-columns: [col1] auto;
            grid-template-rows: [row1] auto [row2] auto;;
            grid-template-areas:
            "images"
            "text";
            align-items: center;
        }
        .text-section {
            width: 92%;
        }
        `
    }
    static get _getArticleTemplate() {
        return html`
        <article id="article" show$="[[show]]" reverse$="[[reverse]]" class="article">
            <section id="image" class="img-section" reverse$="[[reverse]]">
                <div>
                    <slot name="[[article.id]]"></slot>
                </div>
            </section>
            <section id="text" class="text-section">
                <div>
                    <slot name="articleName"></slot>
                </div>
                <div>
                    <slot name="type"></slot>
                </div>
                <div>
                    <slot name="description"></slot>
                </div>
            </section>
        </article>`
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'services'
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
            imageStyles: {
                type: String,
                value: `height: 100%;
                        background-repeat: no-repeat;
                        /*background-position: center;*/
                        background-origin: padding-box;
                        background-size: contain;`
            },
            reverse: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true
            },
            index: {
                type: Number,
                notify: true,
                observer: '_checkReverse'
            },
            current: {
                type: Number,
                value: 0
            },
            ElementName: {
                type: String,
                value: 'servicesArticle'
            },
            imagesOrder: {
                type: Array,
                value: []
            }
        }
    }
    _checkReverse(index) {
        this._setAnimations(this.toReverseOrNotToReverse(index))
    }

    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this.includeStyles(this.ElementName)
    }
    _slotContent(data) {
        var mainTemplate = (article) => litHtml`
                ${this._getImageTemplate(article)}
                <div slot="articleName" id="articleName" class="services-articleName ${!this.reverse && 'not-reverse' || this.reverse && 'reverse'}-articleName">
                 ${data.articleName}
                </div>
                <div slot="type" id="type" class="services-type"> </div>
                <div slot="description" id="description" class="services-description"> </div>`
        render(mainTemplate(data), this)
        this._setText.call(this, data.type, "type")
        this._setText.call(this, data.description, "description")
    }
    _setAnimations(bool) {
        let obj
        if (!!bool)
            obj = {
                'entry': [
                    {
                        name: 'slide-from-right-animation',
                        node: this.$.image,
                        timing: { delay: 300 }
                    },
                    {
                        name: 'slide-from-right-animation',
                        node: this.$.text,
                    },
                    {
                        name: 'fade-in-animation',
                        node: this.$.article,
                    },
                ],
                'exit': [
                    {
                        name: 'fade-out-animation',
                        node: this.$.article,
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
                        name: 'slide-right-animation',
                        node: this.children[0],
                        timing: { delay: 200 }
                    }
                ]

            }
        else
            obj = {
                'entry': [
                    {
                        name: 'slide-from-left-animation',
                        node: this.$.text
                    },
                    {
                        name: 'slide-from-left-animation',
                        node: this.$.image,
                        timing: { delay: 300 }
                    },
                    {
                        name: 'fade-in-animation',
                        node: this.$.article,
                    },
                ],
                'exit': [
                    {
                        name: 'fade-out-animation',
                        node: this.$.article,
                    },
                ],
                'imageEntry': [
                    {
                        name: 'slide-from-left-animation',
                        node: this.children[0],
                    }
                ],
                'imageExit': [
                    {
                        name: 'slide-left-animation',
                        node: this.children[0],
                    }
                ]

            }
        this.animationConfig = obj
    }
}
elementsDefine(appServicesArticle.is, appServicesArticle);

