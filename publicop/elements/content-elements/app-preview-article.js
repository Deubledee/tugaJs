import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { html as litHtml, render } from 'lit-html';
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html as css, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';
import './app-blog-list-article';
import { Methods } from '../util/mixins/article-common_mixin';
class appPreviewArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior, Methods], AppArticleTemplate) {
    static get _getStyles() {
        return css`
       :host {
            position: relative;
        }`
    }
    static get _getArticleTemplate() {
        return html`                 
            <app-blog-list-article
                show
                id="article-item-[[article.id]]" 
                route="{{route}}"
                query="{{query}}"
                lang="[[lang]]"
                icon="[[icon]]"
                article="[[article]]" 
                fulltext="[[fulltext]]"
                previous="[[previous]]"
                category="[[category]]">
                <article 
                    id="articleimage" 
                    class="article-image" 
                    slot="articleimage">
                </article>
                <article 
                    id="articletext" 
                    class="article-text" 
                    slot="articletext">
                </article>    
                <article 
                    id="edithref" 
                    slot="icon">
                    <slot 
                        name="icon">
                    </slot>
                </article>           
            </app-blog-list-article>`
    }
    static get is() { return 'app-preview-article' }
    static get properties() {
        return {
            route: {
                type: Object,
                notify: true,
            },
            query: {
                type: Object,
                notify: true,
            },
            lang: {
                type: String,
            },
            article: {
                type: Object,
                observer: '_slotContent'
            },
            category: {
                type: Object
            },
            edit: {
                type: Boolean,
                notify: true,
                value: false,
                observer: '_checkForEdit'
            },
            show: {
                type: Boolean,
                notify: true,
                value: true,
            },
            icon: {
                type: Boolean,
                notify: true,
                value: false,
            },
            fulltext: {
                type: Boolean,
                value: true,
            },
            previous: {
                type: Boolean,
                value: false
            },
            ElementName: {
                type: String,
                notify: true,
                value: 'previewArticle',
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
    }
    routeChanged(query) {
        this.setHrefs(query)
    }
    _slotContent(data) {
        let mainTemplate = (article) => litHtml`
                ${this._getImageTemplate(article)} }                   
                <div slot="icon" id="slot-icon">                   
                </div>`
        render(mainTemplate(data), this)
        this.show = true
    }
}
elementsDefine(appPreviewArticle.is, appPreviewArticle);
