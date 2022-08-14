import { ListnerListObjectFactory } from "../classes/Listner-list-class";
import { EventListnerFactory } from "../classes/listner-class";


async function controlListners({ listners, methods, formTable }) {
    if (listners === '_unset_') return
    let methodsListnersProduced = [], formTableListnersProduced = []
    let { formTableListners, methodsListners } = AssertListnerList(methods, formTable)
    if (methodsListners) methodsListners.ListnerList
        .forEach(assetType => methodsListnersProduced.
            push(areaListnerFactory.call(this, listners, methodsListners.Data, assetType)))

    if (formTableListners) formTableListners.ListnerList
        .forEach(assetType => formTableListnersProduced =
            areaListnerFactory.call(this, listners, formTableListners.Data, assetType))

    if (!Array.isArray(formTableListnersProduced)) formTableListnersProduced = [formTableListnersProduced]
    return [...formTableListnersProduced, ...methodsListnersProduced].filter(Produced => !!Produced)
}
function AssertListnerList(methods, formTable) {
    let methodsListners = ListnerListObjectFactory(methods)
    let formTableListners = ListnerListObjectFactory(formTable)
    return { methodsListners, formTableListners }
}
function areaListnerFactory(listners, data, assetType) {
    if (data[assetType].listnerGroup) return resolveListnerGroup.call(this, listners, data, assetType)
    if (!data[assetType].navSellector) return
    let listnerAreaNav = document.querySelector(data[assetType].navSellector)
    if (!!listnerAreaNav)
        return EventListnerFactory.call(this, listnerAreaNav, listners[data[assetType].listner], data[assetType])
}
function resolveListnerGroup(listners, data, assetType) {
    let listnerList = Array.from(this.querySelectorAll(data[assetType].listnerListSellector))
    return listnerList.map(listnerAreaNav => EventListnerFactory.call(this, listnerAreaNav, listners[data[assetType].listner], data[assetType])) || []
}

function chechAllowedActiveTypes({ listners }, ActiveAssetType) {
    return listners !== '_unset_' && !!Object.keys(listners).find(listner => !!~listners[listner].allowedActiveTypes.indexOf(ActiveAssetType)) || false
}
function setListnersControl() {
    let AllowedActiveTypes = chechAllowedActiveTypes(this.Assets[this.assetType], this.assetType)
    if (!AllowedActiveTypes) return false
    return controlListners.call(this.scope, this.Assets[this.assetType])
        .catch(console.error)
}

export { setListnersControl }

/**
* * ex:
* * "methods": {    
* *    dropArea draggableArea
          "navSellector": "#subject-form-remove-forever",
          "listnerToggleClass": "assets-container-active-red"
* *     mouseDownArea
          "method": "_MouseClicked_",
          "id": "recycle-subject-form-drop-area",
          "navSellector": "#recycle-subject-form-drop-area > a",
          "listner": "mouseDownArea",
          "listnerToggleClass": "assets-icon-active",

      }
  }
* * "listners": {
* * "dropArea": {
      "allowedActiveTypes": [
          "recycle"
      ],
      "pt": "arraste para aqui",
      "en": "drop here",
      "callbacks": {
          "dragover": {
              "method": "onAreaDragover",
              "toggleClassMethod": "add"
          },
          "dragleave": {
              "method": "onAreaDragleave",
              "toggleClassMethod": "remove"
          },
          "drop": {
              "method": "onAreaDrop",
              "CallerMethod": "onAreaDragleave"
          }
      }
  },
* *  "draggableArea": {
      "pt": "arraste para reciclar ou para apagar",
      "en": "drag onto recycle or delete",
      "allowedActiveTypes": [
          "recycle"
      ],
      "callbacks": { 
           "dragstart": {
              "method": "onAreaDragstart",
               "toggleClassMethod": "add"
          }
       }
   },
* * "mouseDownArea": {
        "allowedActiveTypes": [
            "edit",
            "draft"
        ],
        "pt": "pressione sem largar para remover 'assunto' ou clique para aceder a reciclagem.",
        "en": "press without release to remove 'subject' or click to access the recyle bin",
        "callbacks": {
            "mousedown": {
                "method": "onAreaMouseDown",
                "toggleClassMethod": "add",
                "CallerMethod": "_Origin_Resolver_"
            },
            "onmouseup": {
                "method": "onAreaMouseUp",
                "toggleClassMethod": "remove",
                "CallerMethod": "resetMouseEventsState"
            },
            "onmouseleave": {
                "method": "onAreaMouseLeave",
                "toggleClassMethod": "remove",
                "CallerMethod": "resetMouseEventsState"
            }
        }
    }
 },
*/
