import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html, html as css } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';
import '../tools/search-input';
import { Methods } from '../util/mixins/blog-list-article_mixin';

class appBlogListArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior, Methods], AppArticleTemplate) {
    static get _getStyles() {
        return css`
       :host {
            position: relative;
        }

        .slotted {
            display: none;
        }

        .slotted[show] {
            width: 600px;
            display: grid;
            box-sizing: border-box;
            grid-template-columns: [col1] 600px;
            grid-template-rows: auto;
            grid-template-areas:
                "article-view";
        }

        .article-view {
            grid-area: article-view;
        }

        .article[show] {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: [col1] 640px;
            grid-template-rows: [row2] 70px [row3] auto [row4] 40px;
            grid-template-areas:
                "date"
                "text"
                "author";
            width: auto;
            min-height: 24px;
            min-width: 100%;
            align-items: center;
            line-height: 15px;
        }

        .article[image] {
            grid-template-rows: [row1] auto [row2] 70px [row3] auto [row4] 40px;
            grid-template-areas:
                "image"
                "date"
                "text"
                "author";
        }
        .slot-icon {
            position: absolute;
            left: 4px;
            top: 8px;
            width: 30px;
            height: 30px;
            display: none;
        }

        .slot-icon[icon]{
            display: block;
        }       

        .text-section {
            grid-area: text;
            display: grid;
            grid-template-columns: [col1] auto;
            grid-template-rows: [row1] 50px [row2] 70px;
            grid-template-areas:
                "articlename"
                "description";
            margin-bottom: 20px;
            text-align: left;
            line-height: 18px;
            color: var(--app-secondary-text-color);
        }

        .text-section[big] {
            grid-template-rows: [row1] 50px [row2] auto [row2] auto;
            grid-template-areas:
                "articlenamebig"
                "description"
                "article";
        }

        .article-name[big] {
            grid-area: articlename;
            display: none;
        }

        .article-name-big {
            display: none;
        }

        .article-content {
            display: none;
        }

        .article-name {
            display: block;
            grid-area: articlename;
        }

        .article-name-big[big] {
            display: block;
            grid-area: articlenamebig;
        }

        .article-content[big] {
            display: block;
            grid-area: article;
        }

        .description {
            grid-area: description;
            font-size: 24px;
            min-height: 40px;
        }

        .image-section {
            display: none;
            grid-area: image;
        }

        .image-section[image] {
            display: block;
            grid-area: image;
        }

        section[small] {
            display: none;
        }

        .article[small] {
            grid-template-columns: [col1] 390px;
        }

        .article[big] {
            grid-template-rows: [row2] 70px [row3] auto [row4] 42px;
        }
        
        .image-section img {
            width: 100%
        }
          
        .author-section,
        .text-section,
        .date-section {
            padding-left: 20px;
            padding-right: 20px;
        }

        .date-section {
            grid-area: date;
            display: flex;
            justify-content: space-between;
        }

        .text-section h2 {
            margin-block: 0;
            margin-block-end: 10px;
        }

        .author-section {
            grid-area: author;
        }

        .article section {
            margin-right: unset;
            margin-left: unset;
            line-height: 1.3;
            font-size: 20px;
        }

        .text-section a {
            color: inherit;
            text-decoration: none;
        }

        .article .author-section {
            color: var(--app-secondary-text-color)
        }

        .author-section-display {
            display: flex;
            justify-content: space-between;
            width: 130px;
        }

        .span-right,
        .span-left {
            box-sizing: border-box;
            padding: 6px;
            padding-block-start: 14px;
            max-width: 165px;
            font-size: 22px;
            height: 43px;
            font-weight: bold;
            border-radius: 20px;
            overflow: hidden;
        }

        .span-left {
            background-color: var(--app-primary-text-color);
            color: #fff;
        }

        .span-right {
            color: var(--app-primary-text-color);
        }

        .img-xs {
            height: 30px;
            border-radius: 50%;
        }

        ::slotted(iron-image[halfheight]) {
            box-shadow: 0px 0px 3px grey;
        }

        a {
            text-decoration: none;
            color: #fff;
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
            <article
                id="article" 
                show$="[[show]]" 
                small$="[[small]]" 
                big$="[[big]]" 
                class="article">
                <section image$="[[image]]" class="image-section">
                    <slot name="articleimage">
                    </slot>
                </section>
                <nav class="date-section">
                    <div icon$="[[icon]]" class="slot-icon">                
                        <slot name="icon"></slot>                   
                    </div>
                    <div class="span-right date">
                        <span> [[dateType]] </span>
                        <iron-icon icon="schedule"></iron-icon>
                    </div>
                    <div class="span-left subject">
                        <dom-if if="[[subjectHref]]">
                            <template>
                                <a class="article-name"  
                                    href="[[subjectHref]]">
                                    [[subject]]
                                </a>
                            </template>
                        </dom-if>
                        <dom-if if="[[noHref]]">
                            <template>
                                <span class="article-name">
                                    [[subject]]
                                </span>
                            </template>
                        </dom-if>
                    </div>
                </nav>
                <section big$="[[big]]" class="text-section">
                    <a big$="[[big]]" class="article-name"
                        href="[[articleHref]]">
                        <h2>
                            [[articleName]]
                        </h2>
                    </a>
                    <h2 big$="[[big]]" class="article-name-big">
                        [[articleName]]
                    </h2>
                    <div class="description" id="description">
                        [[description]]
                    </div>
                    <div big$="[[big]]" id="article-content" class="article-content">
                        <slot name="articletext"></slot>
                    </div>
                </section>
                <section class="author-section">
                    <div class="author-section-display">
                        <div>
                            <img class="img-xs" src="[[article.author.avatar]]" alt="article author avatar [[article.author.avatar]]">
                            </img>
                        </div>
                        <div class="span-author">
                            [[article.author.name]]
                        </div>
                    </div>
                </section>
            </article>
            <div id="cache"> </div>
            `
    }
    static get is() { return 'app-blog-list-article' }
    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: {
                type: Object,
                notify: true
            },
            query: {
                type: Object,
                notify: true
            },
            type: {
                type: String,
                value: 'list'
            },
            lang: {
                type: String,
            },
            article: {
                type: Object,
                observer: 'resolveArticle'
            },
            big: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true,
            },
            noHref: {
                type: Boolean,
                value: true,
                notify: true
            },
            subjectHref: {
                type: String,
                notify: true,
                observer: 'gotLinked'
            },
            category: {
                type: Object
            },
            articleHref: {
                type: String,
                notify: true,
            },
            subject: {
                type: String,
                value: '',
                notify: true
            },
            small: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true,
            },
            show: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true,
            },
            image: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true,
            },
            fulltext: {
                type: Boolean,
                value: false,
                notify: true,
                observer: 'getBig',
            },
            previous: {
                type: Boolean,
                notify: true,
                value: false,
                observer: 'getShorty',
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'listArticle',
            },
            current: {
                type: Number,
                value: 0
            },
            offsetStart: {
                type: Number
            },
            offsetEnd: {
                type: Number
            },
        }
    }
    static get observers() {
        return [
            'routeChanged(query, route)'
        ];
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this.includeStyles(this.ElementName)
        this._setAnimations()
    }
    routeChanged(query) {
        if (query.logedin)
            this.setHrefs(query)
        if (query.lang !== this.lang) {
            this.lang = query.lang
            this.dateType = this.getDate(this.article.createdAt)
            this._setSubject(this.lang)
        }
    }
    gotLinked() {
        this.noHref = false
    }
    _setAnimations() {
        let obj = {
            'entry': [
                {
                    name: 'fade-in-animation',
                    node: this.$.article,
                    timing: {
                        delay: 1000,
                        duration: 150
                    }
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
elementsDefine(appBlogListArticle.is, appBlogListArticle);
