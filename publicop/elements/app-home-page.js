import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { elementsDefine } from './lib/methods';
import { AppPageTemplate } from './templates/app-page-template';
import { Methods } from './util/mixins/home_mixin';

if (module.hot) module.hot.accept();

class appHomePage extends Methods(AppPageTemplate) {
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
      page: {
        type: String,
      },
      index: {
        type: Number,
        value: 0
      },
      _setted: {
        type: Boolean
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
  get page() {
    return this._page
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
  //*** */  
  set type(data) {
    this._type = data
  }
  set index(data) {
    this._index = data
  }
  set page(data) {
    this._page = data
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
    this.setScrollControl()
  }
  set INFO(data) {
    this._INFO = data
  }
  set categories(data) {
    this._categories = data
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
    this.elements = []
    this.setted = false
    this.inview = false
    this.current = window.pageYOffset
  }
}

elementsDefine('app-home-page', appHomePage)
