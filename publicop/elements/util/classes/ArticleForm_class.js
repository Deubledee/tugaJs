import { mixInScope } from "../../lib/methods";
import { ArticleFormLib, _getNoCarigeReturn } from "./libs/ArticleForm_lib";

const FormStates = {}
function setDefaultFormStates() {
  let Defaults = {
    ValiationsReturn: () => { },
    edit: false, createLang: false,
    permitions: [], images: [], langs: [],
    lang: '', id: ',', assetType: '', category: '',
    Updated: {}, formResolver: {}, formElements: {}, author: {}, content: {}
  }
  Object.keys(Defaults).forEach(key => this[key] = Defaults[key])
  //console.log(FormStates);
}

class ArticleForm extends ArticleFormLib {
  constructor() {
    super()
    this.isForm = true
  }
  get content() {
    return FormStates.content;
  }
  set content(content) {
    FormStates.content = content;
  }
  get ValiationsReturn() {
    return FormStates.ValiationsReturn;
  }
  set ValiationsReturn(ValiationsReturn) {
    FormStates.ValiationsReturn = ValiationsReturn;
  }
  get id() {
    return FormStates.id;
  }
  set id(id) {
    FormStates.id = id;
  }
  get author() {
    return FormStates.author;
  }
  set author(author) {
    FormStates.author = author;
  }
  get Updated() {
    return FormStates.Updated;
  }
  set Updated(Updated) {
    FormStates.Updated = Updated;
  }
  get permitions() {
    return FormStates.permitions;
  }
  set permitions(permitions) {
    FormStates.permitions = permitions;
  }
  get images() {
    return [...FormStates.images];
  }
  set images(images) {
    FormStates.images = images;
  }
  get edit() {
    return FormStates.edit;
  }
  set edit(edit) {
    FormStates.edit = edit;
  }
  get assetType() {
    return FormStates.assetType;
  }
  set assetType(assetType) {
    FormStates.assetType = assetType;
  }
  get createLang() {
    return FormStates.createLang;
  }
  set createLang(createLang) {
    FormStates.createLang = createLang;
  }
  get category() {
    return FormStates.category;
  }
  set category(category) {
    FormStates.category = category;
  }
  get formResolver() {
    return FormStates.formResolver;
  }
  set formResolver(FormResolver) {
    FormStates.formResolver = (FormResolver);
  }
  get formElements() {
    return FormStates.formElements
  }
  set formElements(formElement) {
    FormStates.formElements = formElement
  }
  get langs() {
    return [...FormStates.langs];
  }
  set langs(articleLang) {
    FormStates.langs.push(articleLang);
  }
  get lang() {
    return FormStates.lang;
  }
  set lang(articleLang) {
    FormStates.lang = articleLang;
  }
  Reset() {
    this.article = {}
    this.content = {}
  }
  setDefaults(assetType) {
    mixInScope.call(this, { article: {}, content: {}, assetType });
  }
  resetContent(lang, isArray) {
    if (isArray) return this.content[lang] = [...this.article]
    mixInScope.call(this, { ...this.article }, this.content[lang]);
  }
  async setInitState(scope, formResolver, articleLang, edit, assetType, category) {
    setDefaultFormStates.call(FormStates)
    this.scope = scope;
    this.category = category;
    this._setUserAndToken();
    this.setDefaults(assetType)
    await this.setContent(articleLang, formResolver, edit, assetType);
    return this
  }
  async setContent(articleLang, formResolver, edit, assetType) {
    this.edit = edit;
    this.assetType = assetType;
    this.lang = articleLang;
    if (assetType === 'create') return await this.setContentToCreate(articleLang, formResolver, assetType);
    await this.setContentToEdit(articleLang, formResolver, assetType);
    return this
  }
  async setContentToEdit(lang, formResolver, assetType) {
    let { contentToEdit } = formResolver;
    let isArray = Array.isArray(contentToEdit)
    if (contentToEdit !== 'createLang')
      await this.createValuedArticle(formResolver, assetType, contentToEdit, isArray)
    else await this.createUnvaluedArticle(formResolver, assetType, true)
    this.setLangState(lang, formResolver)
    this.resetContent(lang, isArray)
    return this
  }
  async setContentToCreate(lang, formResolver, assetType) {
    await this.createUnvaluedArticle(formResolver, assetType)
      .catch(console.error)
    this.setLangState(lang, formResolver)
    this.resetContent(lang)
    this.formResolver[lang].contentToEdit = this.content[lang]
    return this
  }
  async createValuedArticle(formResolver, assetType, contentToEdit, isArray) {
    let { formTable } = formResolver.getAssets(assetType);
    if (!formTable) throw `no formTable: ${assetType}, ${!!formTable}`
    await this.checkComputedProperties(formResolver, formTable)
    this.createLang = false
    this.article = !isArray ? { ...contentToEdit } : [...contentToEdit];
    if (isArray) return
    this.id = this.article.id
    this.images = this.article.images
    this.category = this.article.categories
    this.permitions = this.article.permitions
    this.images = this.article.images;
  }
  async createUnvaluedArticle(formResolver, assetType, createLang = false) {
    let { formTable } = formResolver.getAssets(assetType);
    if (!formTable) throw `no formTable: ${assetType}, ${!!formTable}`
    await this.checkComputedProperties(formResolver, formTable)
    this.createLang = createLang;
    Object.keys(formTable).forEach((Table) => (this.article[Table] = ""));
    this.article = {
      ...this.article, id: this.id || "", permitions: [...this.permitions],
      categories: [this.category], images: [...this.images]
    };
    return formTable
  }
  async changeLang(lang, formResolver, edit, assetType) {
    if (!~this.langs.indexOf(lang))
      return await this.setContent(lang, formResolver, edit, assetType)
    this.setLangState(lang)
    return this
  }
  isLangSet(articleLang, formResolver) {
    return (!~this.langs.indexOf(articleLang) && formResolver)
  }
  setLangState(lang, formResolver) {
    this.lang = lang;
    if (this.isLangSet(lang, formResolver)) {
      this.formResolver[lang] = formResolver;
      this.content[lang] = {};
      this.langs = lang;
    }
  }
  getContent(lang) {
    return this.content[lang]
  }
  getFormData(resolver) {
    let result = resolver.map((queryObj) => Object.keys(queryObj)
      .map((query) => ` ${query}: "${this[queryObj[query]]()}",`).join("")).join("");
    return result;
  }
  getArticleId() {
    if (!!this.edit && this.id || !!this.createLang && this.id) return this.id
    return _getNoCarigeReturn(this.content[this.lang].articleName).replaceAll(' ', '-');
  }
  getContentToStringBase64() {
    if (!this.langs.length) return ""
    let { content } = this;
    let filteredLangs = this.langs.filter((lang) => Object.keys(this.Updated[lang]).length);
    let Content = {};
    this.SetUpdatedLangContent(filteredLangs, Content, content);
    return btoa(JSON.stringify(Content));
  }
  getImagesToStringBase64() {
    return this.Updated.images ? btoa(JSON.stringify(this.images)) : "";
  }
  getPermitions() {
    return this.Updated.permitions ? this.permitions : "";
  }
  getAuthor() {
    return btoa(JSON.stringify(this.author));
  }
  getLang() {
    return this.lang;
  }
  getEditype() {
    return this.scope.query.editype;
  }
  getToken() {
    return this.token
  }
  getUserId() {
    return this.author.uid;
  }
  getLangState() {
    return this.lang;
  }
}
export function ArticleFormFactory() {
  return new ArticleForm();
}

/**
 */
