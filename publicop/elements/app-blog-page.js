import { elementsDefine } from './lib/methods';
import { AppPageTemplate } from './templates/app-page-template';
import { Methods } from './util/mixins/blog_mixin';

if (module.hot) module.hot.accept()

class appBlogPage extends Methods(AppPageTemplate) {
  static get properties() {
    return {
      itemsArray: {
        type: Array
      },
      index: {
        type: Number
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
      _areas: {
        type: Object
      },
      categories: {
        type: Array
      },
      _tools: {
        type: Array
      },
      _INFO: {
        type: String,
      },
      _page: {
        type: String
      },
      _setted: {
        type: Boolean
      }
    }
  }

  get layout() {
    return this._layout
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
  get tools() {
    return this._tools
  }
  get INFO() {
    return this._INFO
  }
  /** */
  set layout(data) {
    this._layout = data
  }
  set type(data) {
    this._type = data
  }
  set page(data) {
    this._page = data
  }
  set areas(data) {
    this._areas = data
  }
  set styles(data) {
    this._styles = data
  }
  set index(data) {
    this._index = data
  }
  set INFO(data) {
    this._INFO = data
  }
  set lang(data) {
    this._lang = data
    this._slotContent()
  }
  set tools(data) {
    this._tools = data
  }
  set categories(data) {
    this._categories = data
  }
  set langs(data) {
    this._langs = data
  }
  //*** */
  connectedCallback() {
    super.connectedCallback();
  }
  constructor() {
    super();
    this.areas = {}
    this.langs = {}
    this.index = 0
  }
}

elementsDefine('app-blog-page', appBlogPage);
