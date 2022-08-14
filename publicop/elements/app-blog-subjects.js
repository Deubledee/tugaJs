import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { css, html } from 'lit';
import { elementsDefine } from './lib/methods';
import { AppPageTemplate } from './templates/app-page-template';
import { Methods } from './util/mixins/blog-subjects_mixin';

if (module.hot) module.hot.accept()
class appBlogSubjects extends Methods(AppPageTemplate) {
  static get styles() {
    return [css`
         :host {
             display: block;
             background-color: var(--app-background-color);
         }
         `]
  }
  launchRouter() {
    return html`
            <app-router-element .route2callback="${(this.routecallback).bind(this)}" layer2>
            </app-router-element>
            <div id="cache"></div>
             `
  }
  static get properties() {
    return {
      route: {
        type: Object,
      },
      itemsArray: {
        type: Array
      },
      _categories: {
        type: Array
      },
      subject: {
        type: String,
      },
      _subjectArticles: {
        type: String,
      },
      page: {
        type: String,
      },
      _tools: {
        type: Array
      },
      index: {
        type: Number,
        value: 0
      },
      _setted: {
        type: Boolean
      },
      _layout: {
        type: String
      },
      _type: {
        type: String
      },
      _styles: {
        type: String
      },
      _INFO: {
        type: String,
      },
      _areas: {
        type: Object
      }
    }
  }
  get layout() {
    return 'simplePage'
  }
  get type() {
    return this._type
  }
  get subject() {
    return this._subject
  }
  get subjectArticles() {
    return this._subjectArticles
  }
  get page() {
    return this._page
  }
  get tools() {
    return this._tools
  }
  get langs() {
    return this._langs
  }
  get lang() {
    return this._lang
  }
  get INFO() {
    return this._INFO
  }
  get index() {
    return this._index
  }
  get categories() {
    return this._categories
  }
  get styles() {
    return this._styles
  }
  get areas() {
    return this._areas
  }
  get setted() {
    return this._setted
  }
  //*** * /
  set layout(data) {
    this._layout = data
  }
  set type(data) {
    this._type = data
  }
  set index(data) {
    this._index = data
  }
  set page(data) {
    this._page = data
  }
  set INFO(data) {
    this._INFO = data
  }
  set tools(data) {
    this._tools = data
  }
  set categories(data) {
    this._categories = data
  }
  set subjectArticles(data) {
    this._subjectArticles = { [data]: {} }
  }
  set subject(data) {
    this._subject = data
  }
  set setted(data) {
    this._setted = data
  }
  set langs(data) {
    this._langs = data
  }
  set lang(data) {
    this._lang = data
    this._slotContent()
  }
  set styles(data) {
    this._styles = data
  }
  set areas(data) {
    this._areas = data
  }
  connectedCallback() {
    super.connectedCallback();
  }
  constructor() {
    super();
    this.langs = {}
    this.IMAGES = []
    this.elements = []
    this.setted = false
    //this.setDefaultFormData()
    this.articleLang = !!this.lang ? this.lang : localStorage['app-lang']
  }
}

elementsDefine('app-blog-subjects', appBlogSubjects);
