import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations';
import { html, html as css } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import { AppArticleTemplate } from '../templates/app-article-template';

class appFreeToolArticle extends mixinBehaviors(
    [NeonAnimationBehavior,
        NeonAnimationRunnerBehavior], AppArticleTemplate) {
    static get _getStyles() {
        return css`
        :host {
            display: block;
        }
        .article[show] {
            display: grid;
            grid-template-rows:[row1] 40px [row1] 40px [row2] 53px [row3] auto;
            grid-template-columns: [col1] 14% [col2] 65% [col2] 14%;
            grid-template-areas:
                ". type menu"
                "tool type ."
                "tool articleName ."
                "tool description ."
                ". form .";
            grid-column-gap: 10px;
            min-height: 190px;
            background: var(--app-secondary-background-color);
            border-radius: 20px;
            border-bottom: 0px;
            color: var(--app-secondary-text-color);
            width: 600px;
            box-sizing: border-box;
            padding: 5px;
            justify-content: center;height: auto;
            padding-block-end: 35px;
        }
        
        .article[hidemethodsslot] {
            grid-template-columns: [col1] 1% [col2] 75% [col3] 22%;
        }
        .tools-container {
            height: auto;
        }
        .menu-section {
            grid-area: menu;
            color: var(--app-list-text-color);
            cursor: pointer;
            display: flex;
            justify-content: space-around;
        }
        .articleName-section {
            grid-area: articleName;
        }
        
        .type-section,
        .articleName-section {
            font-size: large;
        }
        .description-section {
            grid-area: description;
        }
        .form-section {
            grid-area: form;
        }
        
        .tool-section {
            grid-area: tool;
        }
        .tool-section {
            grid-area: tool;
            align-self: baseline;
        }
        .tool-section[hidemethodsslot] {
            display: none;
        }
        .type-section,
        .articleName-section,
        .description-section,
        .form-section{
            display: none;
        }
        .description-section{
        display: none;
        padding: 0;
        line-height: 20px
        }
        article section {
            text-shadow: 0px 0px 2px #374156;
            width: 100%;
        }
        .icons-slot {
            color: var(--app-primary-text-color);
        }
        .description-section,
        .text-section{
            font-size: unset;
        }
        section[keepopen] {
        display: none;
        }
        .type-section[showname],
        .articleName-section[showtype],
        .description-section[showdescription],
        .form-section[showform]{
            display: block;
        }
        .type-section{
            display: none;
            grid-area: type;
            width: 100%;
        }
         `
    }
    static get _getArticleTemplate() {
        return html`
        <div class="tools-container">
            <article id="article" show$="[[show]]" open$="[[open]]" class="article">
        
                <section id="tool" class="tool-section" hidemethodsslot$="[[hidemethodsslot]]">
                    <div class="icons-slot">
                        <slot></slot>
                    </div>
                </section>
        
                <section id="type" class="type-section" showname$="[[showname]]">
                    [[article.articleName]]
                </section>
        
                <section id="articleName" class="articleName-section" showtype$="[[showtype]]">
                    <slot name="type"></slot>
                </section>
        
                <section id="description" class="description-section" showdescription$="[[showdescription]]">
                    <slot name="description"></slot>
                </section>
        
                <section id="form" class="form-section" showform$="[[showform]]">
                    <slot name="form"></slot>
                </section>
        
                <section id="type" keepopen$="[[keepopen]]" class="menu-section">
                    <iron-icon id="toggleicon" icon="[[icon]]" on-click="toggleMessage">
                    </iron-icon>
                </section>
        
            </article>
        </div>
            `
    }
    static get is() { return 'app-free-tool-article' }
    static get properties() {
        return {
            article: {
                type: Object,
                observer: 'slotArticleDelta'
            },
            icon: {
                type: String,
                notify: true,
                value: 'icons:info-outline',
                observer: 'toggleIcon',
            },
            iconcolor: {
                type: String,
            },
            lang: {
                type: String,
            },
            show: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            open: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
            },
            keepopen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            hidemethodsslot: {
                type: Boolean,
                value: true,
                reflectToAttribute: true
            },
            hidemethods: {
                type: Boolean,
                value: false,
                observer: 'toggleMethodsSlot',
            },
            showname: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            showtype: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            showdescription: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            showform: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            toggleopen: {
                type: Boolean,
                observer: 'toggleOpen',
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
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.ElementName = 'toolArticle'
        this.includeStyles(this.ElementName)
    }
    ready() {
        super.ready();
        this._setAnimations()
        this.setShowElements(this.showname, this.showtype, this.showdescription, this.showform)
    }
    toggleMethodsSlot(data) {
        this.hidemethodsslot = data
    }
    toggleIcon() {
        if (!this.iconcolor) return
        this.$.toggleicon.style.color = this.iconcolor
    }
    setShowElements(showname, showtype, showdescription, showform) {
        this.showElements = { showname, showtype, showdescription, showform }
    }
    toggleOpen(open) {
        if (!this.showElements) return setTimeout(() => this.toggleOpen(open), 60);
        this.open = open
        Object.keys(this.showElements)
            .filter(elem => !this.showElements[elem])
            .forEach(elem => this[elem] = open)
    }
    toggleMessage() {
        if (!!this.keepopen) return
        if (!this.open) return this.playAnimation('entry'), this.toggleopen = true
        this.playAnimation('exit'), setTimeout(() => this.toggleopen = false, 6 * 60)
    }
    slotArticleDelta() {
        this._setText(this.article['type'], this.querySelector("div[slot=type]"))
        this._setText(this.article['description'], this.querySelector("div[slot=description]"))
    }
    _setAnimations() {
        this.show = true
        let obj = {
            'entry': [
                {
                    name: 'fade-in-animation',
                    node: this.$.articleName
                },
                {
                    name: 'fade-in-animation',
                    node: this.$.description
                }
            ],
            'exit': [
                {
                    name: 'fade-out-animation',
                    node: this.$.articleName
                },
                {
                    name: 'fade-out-animation',
                    node: this.$.description
                }
            ]
        }
        this.animationConfig = obj
    }
}
customElements.define(appFreeToolArticle.is, appFreeToolArticle);
