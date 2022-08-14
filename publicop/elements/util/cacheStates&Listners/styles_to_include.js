import { getCurrentLayout } from "../classes/layoutState_class"

const areaStylesToInclude = []
const scopeInitialStyles = {}

class scopeStyles {
    constructor(parentCategoryId, scope, styles, defaultStyles) {
        this.id = parentCategoryId
        this.element = scope
        this.defaultStyles = defaultStyles
        this.styles = styles
    }
    checkInculedStyles() {
        if (!!this.scopeStyles) return
        let { layout, MediaQuery } = getCurrentLayout()
        this.scopeStyles = getScopeInitialStyles(this.element).initialStyles
        if (!!this.defaultStyles[this.element]) this.scopeStyles = `${this.scopeStyles} /*defaultStyles*/ ${this.defaultStyles[this.element]}`
        if (!this.layouts) return
        if (!!~this.layouts.indexOf(layout) && !!~this.MediaQueries.indexOf(MediaQuery))
            this.scopeStyles = `${this.scopeStyles} /*layoutStyles*/ ${this.styles[this.element][layout][MediaQuery]}`
    }
    getStylesToInclude(elementScope) {
        setScopeInitialStyles.call(elementScope, this.element)
        this.checkInculedStyles()
        return this.scopeStyles
    }
    checkIfIncluded(Id, scope) {
        if (this.id !== Id || this.element !== scope || !!(!this.styles && !this.defaultStyles)) return false
        return true
    }
    set styles(data) {
        this._styles = data
        if (!!data && !!data[this.element])
            Object.keys(data[this.element])
                .map(layout => this.layouts = layout)
                .map(layout => Object.keys(data[this.element][layout]))
                .forEach(MediaQuery => this.MediaQueries = MediaQuery) /**/
    }
    get styles() {
        return this._styles
    }
    get layouts() {
        return this._layouts
    }
    get MediaQueries() {
        return this._MediaQueries
    }
    set layouts(data) {
        if (!this._layouts) this._layouts = []
        this._layouts.push(data)
    }
    set MediaQueries(data) {
        if (!this._MediaQueries) this._MediaQueries = []
        this._MediaQueries.push(data.pop())
    }
}

function scopeStylesFactory(parentCategoryId, scope, styles, defaultStyles) {
    return new scopeStyles(parentCategoryId, scope, styles, defaultStyles)
}
function setStylesToInclude(parentCategoryId, scope, styles, defaultStyles) {
    if (!isStylesSet(parentCategoryId, scope))
        areaStylesToInclude.push(scopeStylesFactory(parentCategoryId, scope, styles, defaultStyles))
}
function getStylesToInclude(id, scope) {
    let StylesSet = isStylesSet.call(this, id, scope)
    if (!!StylesSet) return StylesSet.getStylesToInclude(this)
}
function isStylesSet(id, scope) {
    let includedStyle = areaStylesToInclude.find(includedStyle => includedStyle.checkIfIncluded(id, scope))
    return includedStyle
}
function setScopeInitialStyles(scope) {
    if (!!scopeInitialStyles[scope]) return
    let styleSheet = this.shadowRoot.querySelector('style')
    let initialStyles = styleSheet.innerText
    scopeInitialStyles[scope] = { initialStyles }
}
function getScopeInitialStyles(scope) {
    if (!!scopeInitialStyles[scope]) return { ...scopeInitialStyles[scope] }
    return ''
}
function getAllStylesToInclude() {
    return areaStylesToInclude
}

export {
    getAllStylesToInclude,
    getStylesToInclude,
    setStylesToInclude,
    isStylesSet
}
