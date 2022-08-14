
const reverts = {
    DefaultPage: lang => callLocationEvent(`/home?type=home&lang=${lang}`),
    parent(lang) {
        console.log('TODO create logic', 'this.query2');
        return callLocationEvent(`/blog?type=blog&lang=${lang}`)
    }
}

function extention(Class) { return Class }

function mixInScope(contentToMixin, destinationObject = false) {
    let scope = !destinationObject ? this : destinationObject
    Object.keys(contentToMixin)
        .forEach(methodToMixin => scope[methodToMixin] = !!methodToMixin && !!contentToMixin[methodToMixin] && !!contentToMixin[methodToMixin].bind ?
            contentToMixin[methodToMixin].bind(this) :
            contentToMixin[methodToMixin])
}

function mixInScopeProtected(contentToMixin, destinationObject = false) {
    let scope = !destinationObject ? this : destinationObject
    Object.keys(contentToMixin)
        .map(methodToMixin => !!contentToMixin[methodToMixin].bind ?
            [methodToMixin, contentToMixin[methodToMixin].bind(this)] :
            [methodToMixin, contentToMixin[methodToMixin]])
        .forEach(([property, methodToMixin]) => Object.defineProperty(scope, property, { value: methodToMixin, configurable: false, writable: false }));
    if (destinationObject) Object.seal(destinationObject)
}

function toggleSpinner(bool, message = 'loading') {
    let spinner = document.querySelector('app-spinner')
    spinner.active = bool
    spinner.message = message
}

/** to remove */
function setResponse(event, responseName) {
    if (!this.langs[this.lang]) this.langs[this.lang] = {}
    if (!this.langs[this.lang][responseName]) this.langs[this.lang][responseName] = event
}
function setGalleriesResponse(event, responseName) {
    if (!this.langs[this.lang][responseName] || this.firstLoad && !!event) {
        let content = []
        event.forEach(res => res.galleries.forEach(gallery => content.push(gallery)))
        this.langs[this.lang][responseName] = content
    }
}
/** */

function GetPage(routeData) {
    let { page, page2 } = routeData
    return page || page2
}
function getInfoDataByType(propertyValue, property = "categories") {
    if (!!this[property] && !!this[property].find)
        return this[property].find(item => item.type === propertyValue)
}
function getInfoDataByProperty(propertyValue, par = "type", property = "categories") {
    if (Array.isArray(this[property]))
        return this[property].find(item => item[par] === propertyValue)
}
function sortCategoryViewTypes(type) {
    return this[type].filter(item => parseInt(item.pageOrder) === parseInt(item.pageOrder))
        .sort((a, b) => +(a.pageOrder > b.pageOrder) || +(a.pageOrder === b.pageOrder) - 1)
}

function setCustomToolFrom(fromTHISProperty, customToolId, par, value) {
    this[customToolId] = [getInfoDataByProperty.call(this, value, par, fromTHISProperty)]
}
async function setReformTools(tools, toolsKeys, reformedTools = 'reformedTools') {
    toolsKeys.forEach(tool => setCustomToolFrom.call(this, reformedTools, tools[tool].toolName, 'id', tools[tool].id))
}

function FilterPageCategories(CustomTools, response) {
    let pageCategories = {}
    CustomTools.forEach(CustomTool => {
        Object.keys(response).forEach((responseArray) => pageCategories[responseArray] = response[responseArray].filter(key => CustomTool !== key.type));
        Object.keys(pageCategories)
            .filter(key => !pageCategories[key].length)
            .forEach(NoLength => Reflect.deleteProperty(pageCategories, NoLength));
    });
    return pageCategories
}
function setCustomTool(CustomTools, categories) {
    let toolCtsm = {};
    CustomTools.forEach(CustomTool => categories
        .forEach((responseArray) => !toolCtsm[CustomTool] && (toolCtsm[CustomTool] = responseArray.find(key => CustomTool === key.type))));
    Object.keys(toolCtsm)
        .forEach(tool => setDataSimple.call(this, [toolCtsm[tool]], `${tool}Tools`));
}
function setCustomToolAndResponses(CategoriesResponse, customToolName) {
    let CustomTools = Array.isArray(customToolName) ? customToolName : [customToolName],
        categories = Object.keys(CategoriesResponse).map(responseKey => CategoriesResponse[responseKey])
    setCustomTool.call(this, CustomTools, categories);
    return FilterPageCategories.call(this, CustomTools, CategoriesResponse);
}

async function setDataSimple(response, param = "categories") {
    if (!response) return
    return this[param] = response
}
async function setDataWithTools(response, customToolName = false) {
    let contentResponse = response
    if (customToolName) contentResponse = setCustomToolAndResponses.call(this, response, customToolName);
    let tools2 = Object.keys(contentResponse).filter(key => contentResponse[key][0].type === 'tools')
    return Promise.all(Object.keys(contentResponse)
        .map(key => !!~tools2.indexOf(key) ?
            setDataSimple.call(this, contentResponse[key], "tools") :
            setDataSimple.call(this, contentResponse[key])))
}
function setCustomToolsAsInfoData(CustomTools) {
    for (let CustomTool of CustomTools)
        this.setPropertyContentAsInfoData(CustomTool)
}
function resolveToInfoData(tools) {
    this.setPropertyContentAsInfoData('categories')
    if (tools) setCustomToolsAsInfoData.call(this, tools)
    return Promise.resolve()
}
function createCategoryPropertyFrom(styleCategory, areasCategory) {
    let { rootStyles, rootDefaultStyles } = styleCategory
    this.category = { styles: { rootStyles, rootDefaultStyles }, ...areasCategory }
}

function getInviewState(routes) {
    if (!(this.route.path in routes)) return '_unset_'
    return routes[this.route.path]
}
function setElementToRender(ElementTorRender, element) {
    if (!!this.ElementsTorender[ElementTorRender]) return this.ElementsTorender[ElementTorRender]
    let elemen = this.querySelector(element) || document.querySelector(element)
    return this.ElementsTorender[ElementTorRender] = elemen
}
function revertTo(revertto, lang) {
    if (!!reverts[revertto]) reverts[revertto](lang)
}
function callLocationEvent(revertToUrl) {
    window.history.pushState({}, null, revertToUrl);
    window.dispatchEvent(new CustomEvent('location-changed'));
}

function resetForm(resetUnload = true) {
    window.onbeforeunload = resetUnload && function () { } || window.onbeforeunload
    let time = setTimeout(() => {
        if (this.query.resetview !== 'false') return clearTimeout(time)
        this.inview = false
        this.setInviewTrue(['formpopup', 'resetview'])
        window.onbeforeunload = resetUnload && function () { } || window.onbeforeunload
        clearTimeout(time)
    }, 60 * 10);
}

function scrollControlCallback(page) {
    return () => {
        if (this.routeData.page !== page) return
        let elements = Array.from(document.querySelectorAll('.animate-scroll-control'))
        this.up = !!(this.current < window.pageYOffset)
        this.current = window.pageYOffset
        elements.forEach(child => {
            var viewportOffset = child.getBoundingClientRect()
            if (window.pageYOffset === 0 && child.show === true) return child.hideElementOnScroll()
            if (this.up === true && child.show === false)
                if (viewportOffset.y <= parseInt(window.innerHeight / 1.3) &&
                    viewportOffset.y >= parseInt(window.innerHeight / 1.6))
                    child.showElementOnScroll()
            if (this.up === false && child.show === true)
                if ((viewportOffset.y >= parseInt(window.innerHeight / 1.28) &&
                    viewportOffset.y <= parseInt(window.innerHeight / 1.18)))
                    child.hideElementOnScroll()
        })
    }
}
function setScrollControl(page) {
    window.addEventListener('scroll', scrollControlCallback.call(this, page).bind(this))
}
function showToolArticle(show) {
    let freeTool = document.querySelector(`#${this.INFO.id}-free-tool-article`)
    if (!show) return freeTool.removeAttribute("showname"), freeTool.setAttribute("keepopen", !show)
    freeTool.removeAttribute("keepopen"), freeTool.setAttribute("showname", show)
}
function elementsDefine(elementName, EmelementClass) {
    let element = customElements.get(elementName)
    if (!element) customElements.define(elementName, EmelementClass);
}
function removeLastCaracter(RemoveFromString) {
    RemoveFromString = [...RemoveFromString];
    RemoveFromString.pop();
    RemoveFromString = RemoveFromString.join('');
    return RemoveFromString
}
function _getNoCarigeReturn(string) {
    if (string.split && string.charCodeAt(string.length - 1) === 10) {
        string = string.split('')
        string.pop()
        return string.join('')
    }
    return string
}
function getUpdateState() {
    console.log('got update', this, this.Updated);
    return this.Updated
}
function getToolsElements() {
    let [toolBar, tools] = [document.querySelector(`#${this.INFO.id}-tools-toolbar`),
    document.querySelector(`#${this.INFO.id}-tools`)]
    return [toolBar, tools]
}

export {
    revertTo, getUpdateState,
    extention, getInviewState, elementsDefine, getToolsElements,
    mixInScope, mixInScopeProtected, removeLastCaracter,
    getInfoDataByType, resetForm, showToolArticle,
    setResponse, scrollControlCallback, _getNoCarigeReturn,
    setDataSimple, setScrollControl, setElementToRender,
    toggleSpinner, resolveToInfoData, GetPage, setReformTools,
    createCategoryPropertyFrom, setDataWithTools, setCustomToolAndResponses, setCustomToolsAsInfoData,
    getInfoDataByProperty, callLocationEvent, setCustomToolFrom,
    setGalleriesResponse, sortCategoryViewTypes
};
