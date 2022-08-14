import { mixInScope } from "../../lib/methods";
import { GalleryFormLib, _getNoCarigeReturn } from "./libs/GalleryForm_lib";

const FormStates = {}
function setDefaultFormStates() {
  let Defaults = {
    ValiationsReturn: () => { }, Loaded: {},
    gallery: false, createLang: false, remove: false,
    permitions: [], images: [], langs: [],
    lang: '', id: ',', assetType: '', category: '',
    Updated: {}, formResolver: {}, formElements: {}, author: {}, content: {}
  }
  Object.keys(Defaults).forEach(key => this[key] = Defaults[key])
  //console.log(FormStates);
}

class GalleryForm extends GalleryFormLib {
  constructor() {
    super()
    this.isForm = true
  }
  get Loaded() {
    return FormStates.Loaded;
  }
  set Loaded(Loaded) {
    FormStates.Loaded = Loaded;
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
  get remove() {
    return FormStates.remove;
  }
  set remove(remove) {
    FormStates.remove = remove;
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
  get assetType() {
    return FormStates.assetType;
  }
  set assetType(assetType) {
    FormStates.assetType = assetType;
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

  Reset() {
    this.galleries = []
    this.images = []
    this.preview = []
    this.content = {}
    this.Loaded = {}
  }
  setDefaults(assetType, galleries) {
    mixInScope.call(this, { setImages: galleries, galleries: [], iamges: [], preview: [], assetType });
  }
  resetContent(assetType) {
    this.Loaded[assetType] = [...this[assetType]]
    return this
  }
  getContent(assetType) {
    return this.Loaded[assetType]
  }
  async setInitState(scope, formResolver, gallery, assetType, category, galleries) {
    setDefaultFormStates.call(FormStates)
    this.scope = scope;
    this.category = category;
    this._setUserAndToken();
    this.setDefaults(assetType, galleries)
    await this.setContent(formResolver, gallery, assetType);
    return this
  }

  async setContent(formResolver, edit, assetType) {
    this.edit = edit;
    this.assetType = assetType;
    if (this.edit) return await this.createValuedContent(formResolver, assetType);
    return await this.createUnvaluedContent(formResolver, assetType)
  }

  setPreviewContent(assetType, index, editype) {
    this.assetType = assetType;
    if (editype === 'preview') this[assetType] = [this.content[index]]
    if (editype === 'previewer') this[assetType] = [{ content: this.content, index }]
    this.resetContent(editype)
  }
  async createValuedContent(formResolver, assetType) {

    let hasTable = this.checkHasTable(formResolver, assetType)
    if (!hasTable) throw `no formTable. assetType: ${assetType}, ${hasTable}`
    let { contentToEdit } = formResolver;
    this[assetType] = this.getEditContent(contentToEdit, assetType)
    if (assetType === 'images' || assetType === 'trash' || assetType === 'local') this.content = [...this[assetType]]
    return this.resetContent(assetType)
  }
  getEditContent(contentToEdit, assetType) {
    let NoContent = this.checkNoContent(!!this.setImages ? 'no images' : 'no galleries')
    return !!contentToEdit.length ?
      contentToEdit : assetType === 'trash' && [this.genImageObject('gallery', 'checksum', NoContent, undefined, false)];
  }
  checkHasTable(formResolver, assetType) {
    let assets = formResolver.getAssets(assetType);
    let { formTable, dubleTable } = assets
    let hasTable = !!formTable && formTable || !!dubleTable && dubleTable
    return hasTable
  }
  checkNoContent(message) {
    return !!this.setImages ?
      { url: '/img/no-image-icon-23485.png', size: 0, name: message, title: message } :
      { description: message, title: message }
  }
  async createUnvaluedContent(formResolver, assetType) {
    let hasTable = this.checkHasTable(formResolver, assetType)
    if (!hasTable) throw `no formTable. assetType: ${assetType}, ${hasTable}`
    let Table = {}
    Object.keys(hasTable).forEach(table => Table[hasTable[table].property] = '')
    this[assetType] = [Table]
    return this.resetContent(assetType)
  }
  getFormData(resolver) {
    let result = resolver.map((queryObj) => Object.keys(queryObj)
      .map((query) => ` ${query}: "${this[queryObj[query]]()}",`).join("")).join("");
    return result;
  }


  getGalleryId() {
    console.log(this.gallery);
    if (!!this.gallery) return this.gallery[0].id
  }


  getContentToStringBase64() {
    this.create[0].ownerID = `${this.author.name.replace(" ", "")}-${this.author.uid}`
    return btoa(JSON.stringify(this.create[0]));
  }
  getGallery() {
    return _getNoCarigeReturn(this.create[0].title);
  }
  getGalleryRoot() {
    return `${_getNoCarigeReturn(this.create[0].title)}-${this.author.name.replace(" ", "")}-${this.author.uid}`;
  }
  genImageObject(gallery, checksum, { url, size, name, title, contentType }, dateCreated, uploaded) {
    return {
      url, size, checksum, contentType, dateCreated,
      gallery: gallery, removed: this.remove,
      title: name || title, uploaded
    }
  }
  newEncriptedImage(gallery, checksum, { url, size, name, title, contentType }, uploaded = 'inStorage') {
    let dateCreated = new Date().toDateString()
    return btoa(JSON.stringify(this.genImageObject(gallery, checksum, { url, size, name, title, contentType }, dateCreated, uploaded)))
  }
  getImagesToStringBase64() {
    let image = this.newEncriptedImage(this.getGallery(), this.image.checksum, { ...this.image })
    return this.Updated.images ? image : "";
  }
  getChecksum() {
    return this.Checksum
  }
  getChecksumData() {
    return this.ChecksumData
  }
  getPermitions() {
    return _getNoCarigeReturn(this.create[0].permitions)
  }
  getAuthor() {
    return btoa(JSON.stringify(this.author));
  }
  getEditype() {
    return this.assetType;
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
export function GalleryFormFactory() {
  return new GalleryForm();
}

/**
 */
