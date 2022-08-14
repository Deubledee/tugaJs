
import { getStylesToInclude } from '../../util/cacheStates&Listners/styles_to_include';
import { html, render } from 'lit-html';


export function getCollorsTemplate(parent, type, element) {
    let template = document.createElement('template'),
        template2 = document.createElement('template')
    if (!!element) {
        template2.innerHTML = element
        this.colorsTemplate[type].push(template2.content.children[0])
        this.colorsTemplate[type][this.colorsTemplate[type].length - 1].addEventListener('click', (chqangeColor).bind(this), false)
    }
    this.colorsTemplate[type].forEach(element => {
        template.content.appendChild(element)
    })
    const mainTemplate = colorsTemplate(template, type)
    render(mainTemplate(), parent)
}

function setColor(evt) {
    if (evt.target.parentElement.parentElement.children.length === 1) {
        evt.preventDefault()
        getCollorsTemplate.call(this, evt.target.parentElement.parentElement, evt.target.getAttribute('title'))
    }
}
function chqangeColor(evt) {
    this.Quill.format(evt.target.getAttribute('title'), evt.target.getAttribute('data-value'))
}
function handleColor(evt) {
    let name = evt.target.title,
        value = evt.target.value,
        parentElement = evt.target.parentElement.parentElement
    let template = `<div class="ql-picker-item" title="${name}" tabindex="0" style="background-color:${value}!important;" data-value="${value}"> 
            </div>`
    getCollorsTemplate.call(this, parentElement, name, template)
}

export function _setQuill(options) {
    options.placeholder = this.placeholder
    let editorID = `${this.category.id}-${this.type}-editor`
    const mainTemplate = () => html`
            <div editor
                id="${editorID}"
                class="${this.type}-editor ${this.category.id}-editor">
            </div>`
    render(mainTemplate(), this)
    this.Quill = new Quill(`#${editorID}`, options)
    if (this.toolbartype !== 'notoolbar') this.setCollorsOption(), _registerSize()
    if (!this.Quill) return __startQuill.call(this)
    if (!!this.edit) this.__setQuillData()
    this.setListners()
}

export function __startQuill() {
    const cleanTemplate = () => html``
    render(cleanTemplate(), this)
    _setQuill.call(this)
}

export function colorsTemplate(template, type) {
    return () => html`
        ${template.content}
            <span 
                class="ql-picker-item""
                .onchange="${(handleColor).bind(this)}"
                tabindex="0" 
                style="font-weight: bold;border: unset;
                    border-top: 1px solid grey;
                    background-color: #ffffff;
                    box-sizing: border-box;
                    color: #6597c0; 
                    width: 100%; 
                    height: 28px;
                    text-align: center; 
                    font-size: large;  
                    padding: 2px;">
                <label 
                    for="colors"
                    style="font-size: small">
                    Other... 
                </label>
                <input
                    title="${type}" 
                    type="color"
                    role="menu"
                    .onclick="${(setColor).bind(this)}"/>
            </span>`;
}

export function imageTemplate(data) {
    let { imageBackgroundStyles } = this.category.areas
    let imageStyles = imageBackgroundStyles ?
        imageBackgroundStyles.join('') : this.imageStyles
    return (images) => html`
            <div halfheight
                class="${this.category.type}-image"
                id="${this.category.type}-image"
                slot="${data.id}">
                <div
                    style=${this.setStyles`${this._getImageUrl.call(this, images)}${imageStyles}`}
                    class="${this.category.type}-image-holder"
                    title="${images[0].title}"
                    alt="${this.category.type}">
                </div>
            </div>`
}

export function includeStyles(scope) {
    let styleSheet = this.shadowRoot.querySelector('style')
    let stylesToInclude = getStylesToInclude.call(this, this.category.id, scope)
    styleSheet.innerHTML = !!stylesToInclude ? stylesToInclude :
        `/*Styles not set for element: ${scope}*/
        ${styleSheet.innerHTML}
        `
}

export function _registerSize() {
    var Size = Quill.import('attributors/style/size');
    Size.whitelist = [
        '8px', '10px', '11px',
        '12px', '13px', '14px',
        '15px', '18px', '25px',
        '28px', '32px', '37px',
        '45px', '1em', '2em',
        '3em', '4em', '5em'
    ]
    Quill.register(Size, true);
}

