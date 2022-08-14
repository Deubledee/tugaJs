
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html, html as css } from '@polymer/polymer';
import { html as litHtml, render } from 'lit-html';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';
import { Methods } from '../util/mixins/article-common_mixin';

class appBlogSubjectsArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior, Methods], AppArticleTemplate) {
    static get is() { return 'app-blog-subjects-article' }
    static get _getStyles() {
        return css`       
        .img-section {
            grid-area: images;
            padding: 10px;
                border-radius: 7px;   
        }
        .text-section {
            grid-area: text;
            text-align: left;
        }
        section.text-section{
         height:173px
        }
        .article section {
            margin-left: unset;
            margin-right: unset;
        }
        #image{
            border-right: 1px solid #d0d3da;
            box-shadow: 1px 0px 10px 2px #d0d3da;
        }
        #image[reverse]{
            border-left: 1px solid #d0d3da;
            border-right: 0px;
        }
        .subjects-text-title {
            margin-block-end: 15px;
            margin-block-start: 15px;
            text-transform: capitalize;
        }
        .subject-anchor{
            color: var(--app-secondary-text-color);
        }
        ::slotted(div[halfheight]) {
            padding-block-start: 15px;
        }
        .slot-icon{
            position: absolute;
            left: 10px;
            top: 10px;
            width: 30px;
            height: 30px;
        }
        .title{
            min-width: auto;
            max-width: 50%;}
        iron-icon {
            color: var(--app-primary-text-color);
            position: absolute;
            top: 10px;
            left: 10px;
        }
        `
    }
    static get _getArticleTemplate() {
        return html` 
        <app-location route="{{route}}">
        </app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}" active="{{active}}"
            query-params="{{query}}">
        </app-route>
        <article id="article" show$="[[show]]" reverse$="[[_reverse]]" class="article">
            <section id="image" class="img-section" reverse$="[[_reverse]]">  
                <div class="slot-icon">
                    <slot name="icon"></slot>
                </div>               
                <div>
                    <slot name="[[article.id]]"></slot>
                </div>
            </section>            
            <section id="text" class="text-section">
                <div class="title">
                    <div id="title" class="subjects-title-container">
                        <a class="subject-anchor"
                            href="[[subjectHref]]">
                            <h2 class="subjects-text-title">
                                [[article.articleName]]
                            </h2>
                        </a>
                    </div>                   
                </div>
                <div class="subject">
                    <slot name="subject"></slot>
                </div>
                <div class="description">
                    <slot name="description"></slot>
                </div>
            </section>
        </article>`
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'subjects'
            },
            query: {
                type: Object
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
                value: false,
                reflectToAttribute: true
            },
            edit: {
                type: Boolean,
                notify: true,
                value: false,
                observer: '_checkForEdit'
            },
            editHref: {
                type: String
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
            },
            current: {
                type: Number,
                value: 0
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'subjectsArticle',
            },
            imagesOrder: {
                type: Array,
                value: []
            }
        }
    }
    static get observers() {
        return [
            'routeChanged(route, routeData, query)'
        ];
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this.includeStyles(this.ElementName)
    }
    routeChanged(...args) {
        this.setHrefs(args[2])
    }
    _slotContent(data) {
        let mainTemplate = (article) => litHtml`
                ${this._getImageTemplate(article)} }                   
                <div slot="icon" id="slot-icon">                   
                </div>
                <div slot="subject" id="subject" class="subjects-text subjects-subject-container">
                    ${data.subject}
                </div>
                <div slot="description" id="description" class="subjects-text">
                    <span class="subjects-text-description"> ${data.description}</span>
                </div>`
        render(mainTemplate(data), this)
        setTimeout(() => {
            this.show = true
        }, 60);
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
                        name: 'slide-from-left-animation',
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
                        name: 'slide-left-animation',
                        node: this.children[0],
                        timing: { delay: 200 }
                    }
                ]

            }
        else
            obj = {
                'entry': [
                    {
                        name: 'slide-from-right-animation',
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
                        name: 'slide-right-animation',
                        node: this.children[0],
                    }
                ]

            }

        this.animationConfig = obj
        setTimeout(() => {
            this._reverse = !!bool
        }, 120);
    }
}
elementsDefine(appBlogSubjectsArticle.is, appBlogSubjectsArticle);
