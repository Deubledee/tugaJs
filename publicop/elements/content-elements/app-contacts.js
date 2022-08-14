
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html as css, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html as litHtml, render } from "lit-html";
import { elementsDefine } from '../lib/methods';
import { AppArticleTemplate } from '../templates/app-article-template';
import './app-contact-article';


class appContacts extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get _getStyles() {
        return css`
            :host {
                display: block;
                max-width: 950px;
                margin-left: auto;
                margin-right: auto;
            }
            .article[show] {
                box-sizing: border-box;
                display: flex;
                justify-content: space-evenly;
                flex-direction: row;
                border-bottom: none;
               /* padding: 40px;*/
                height: 350px;
                box-shadow: unset;
                background: unset;
            }`
    }
    static get _getArticleTemplate() {
        return html`  
        <article id="article " show$="[[show]]" class="article">
            <dom-repeat items="{{articles}}" as="article">
                <template>
                    <div>
                        <slot name="[[category.type]]-[[article.id]]"></slot>
                    </div>
                </template>
            </dom-repeat>
        </article>
        ` }

    static get is() { return 'app-contacts' }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'contacts-list'
            },
            articles: {
                type: Object,
                observer: 'setContacts'
            },
            lang: {
                type: String,
            },
            category: {
                type: Object
            },
            show: {
                type: Boolean,
                value: false
            },
            ElementName: {
                type: String,
                value: 'contactsArticles'
            },
            Title: {
                type: Object,
                computed: 'setTitle(lang, category)'
            }
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
    setTitle(lang, category) {
        return category.langs[lang]
    }
    setContacts(articles) {
        const mainTemplate = (data) => litHtml` 
        ${data.map(article => {
            return litHtml`
                    <app-contact-article
                        slot="${this.category.type}-${article.id}"
                        show
                        .article="${article}"
                        .category="${this.category}"
                        .lang="${this.lang}">                        
                    </app-contact-article>`})}`
        render(mainTemplate(articles), this)
        this._setAnimations(articles)
    }
    _setAnimations() {
        let children = Array.from(this.children)
        let obj = {
            'entry': [
                {
                    name: 'fade-in-animation',
                    node: this
                },
            ],
            'exit': [
                {
                    name: 'fade-out-animation',
                    node: this
                },
            ]
        }
        children.forEach(child => obj['entry'].push({
            name: 'slide-from-right-animation',
            node: child,
            timing: { delay: 300 }
        }))
        this.animationConfig = obj
    }
}
elementsDefine(appContacts.is, appContacts);
