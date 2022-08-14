"use strict";
import { mixInScope } from '../../lib/methods';
import { AssetEventFactory } from './Asset_Event-class';


const listnerMethods = {
    draggedTarget: {},
    onAreaDrop(evt, { origin, listnerToggleClass }, callback) {
        evt.preventDefault();
        let { draggedTarget } = listnerMethods
        this.draggedFiles = evt.dataTransfer.files || []
        this.draggedData = evt.dataTransfer.getData('text') || {}
        this.callScopeMethod(evt, callback, { draggedTarget, draggedData: this.draggedData, draggedFiles: this.draggedFiles }, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
        listnerMethods.onAreaDragleave.call(this, { reset: true }, callback); /**/
    },
    onAreaDragStart(evt, { origin, listnerToggleClass }, callback) {
        listnerMethods.draggedTarget = evt
        this.callScopeMethod(evt, callback, { draggedTarget: this.draggedTarget, draggedData: this.draggedData, draggedFiles: this.draggedFiles }, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
    },
    onAreaDragleave(evt, { origin, listnerToggleClass }, callback) {
        let { draggedTarget, draggedData, draggedFiles } = this
        this.callScopeMethod(evt, callback, { draggedTarget, draggedData, draggedFiles }, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
        if (!!evt.reset) this.draggedData = {}
    },
    onAreaDragover(evt, { origin, listnerToggleClass }, callback) {
        evt.preventDefault();
        let { draggedTarget, draggedData, draggedFiles } = this
        this.callScopeMethod(evt, callback, { draggedTarget, draggedData, draggedFiles }, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
    },
    onAreaMouseDown(evt, { origin, listnerToggleClass }, callback) {
        if (evt.button === 2) return;
        this.callScopeMethod(evt, callback, {}, origin);
        this.toggleListnerClass(listnerToggleClass, origin, callback)
    },
    onAreaMouseUp(evt, { origin, listnerToggleClass }, callback) {
        evt.preventDefault();
        this.callScopeMethod(evt, callback, {}, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
    },
    onAreaMouseLeave(evt, { origin, listnerToggleClass }, callback) {
        evt.preventDefault();
        this.callScopeMethod(evt, callback, {}, origin)
        this.toggleListnerClass(listnerToggleClass, origin, callback)
    },
    onAreaHover(evt) {
        evt.preventDefault();
    }
};
function ListnerCallback(evt, callback) {
    listnerMethods[this.listners[callback].method]
        .call(this, evt, this.assetTypeData, callback);
}

class EventListner {
    constructor(Scope, listnerAreaNav, listner, assetType) {
        mixInScope.call(this, {
            Scope,
            listnersSet: [],
            draggedData: {},
            listnerAreaNav,
            assetTypeData: assetType,
            event: assetType.listner,
            ...this._setListnerContent(listner)
        })
        this.setListners();
        // console.log(this);
    }
    get draggedData() {
        return listnerMethods.draggedData
    }
    set draggedData(draggedData) {
        listnerMethods.draggedData = draggedData
    }
    _setListnerContent(listner) {
        let Listner = { ...listner }
        Listner.listners = Listner.callbacks
        Reflect.deleteProperty(Listner, 'callbacks')
        return Listner
    }
    setListners() {
        Object.keys(this.listners)
            .forEach(callback => void this.setListner(callback));
    }
    setListner(callback) {
        if (!this.listners[callback].method || !listnerMethods[this.listners[callback].method])
            throw `setListner - callback error- NOT FOUND! listners:${this.listners} callback: ${callback} result: ${this.listners[callback]}`;
        this.listnerAreaNav.addEventListener(callback, evt => ListnerCallback.call(this, evt, callback));
        if (this.assetTypeData.setAttributes) this.setAttributes()
        this.listnersSet.push(callback);/**/
    }
    setAttributes() {
        this.assetTypeData.setAttributes
            .forEach(attribute => this.listnerAreaNav.setAttribute(attribute, !!attribute))
    }
    toggleListnerClass(listnerToggleClass, origin, callback) {
        let classMethod = !!this.listners[callback] && !!this.listners[callback].toggleClassMethod ? this.listners[callback].toggleClassMethod : 'toggle'
        if (!listnerToggleClass) return
        this.listnerAreaNav.classList[classMethod](listnerToggleClass)
        this.listnerAreaNav.classList[classMethod](`${callback}-${origin}`)
    }
    callScopeMethod(evt, callback, formData, origin) {
        let { CallerMethod } = (!!this.listners[callback] && !!this.listners[callback].CallerMethod) ? this.listners[callback] : { CallerMethod: false }
        let AssetEvent = AssetEventFactory(evt, this, formData, 'assetTypeData', origin)
        if (CallerMethod && this.Scope[CallerMethod]) this.Scope[CallerMethod](AssetEvent, evt);
    }
}

function EventListnerFactory(listnerAreaNav, listner, assetType) {
    return new EventListner(this, listnerAreaNav, listner, assetType);
}


export { EventListnerFactory }
