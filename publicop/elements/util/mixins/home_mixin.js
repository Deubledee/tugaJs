import { extention, mixInScope, setDataSimple, setScrollControl, resolveToInfoData, setElementToRender } from '../../lib/methods';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import * as resolvers from '../resolvers/home_resolver';
import * as route_methods from '../route-methods/home-route_methods';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';

const methodsToInclude = {
    ...route_methods, setElementToRender, setLayoutState, setDataSimple, resolveToInfoData, setPropertyContentAsInfoData
}

export const Methods = (appHomePage) => class extends extention(appHomePage) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        this.ElementsTorender = {}
        mixInScope.call(this, methodsToInclude)
        mixInScope.call(this, resolvers, this.resolvers)
        this.mediaInfoSet = false
        this.defaultLoadRequest = true
    }
    setElementsToRender() {
        this.setElementToRender('renderToAbout', `#${this.INFO.id}-about`)
        this.setElementToRender('renderToServices', `#${this.INFO.id}-services`)
        this.setElementToRender('renderToContacts', `#${this.INFO.id}-contacts`)
    }
    setScrollControl() {
        setScrollControl.call(this, 'home')
    }
}
