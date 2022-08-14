"use strict";
import { inputTypes } from './lib/input-form-table_lib';
import { MethodTypes } from './lib/methods-form-table_lib';


function formInputsResolve(type, formTable, formData, listners, layout, resolver, index) {
    let method = setInputsMethod.call(this, formTable)
    let property = formTable.property ? formTable.property :
        formData[formTable.properties[0]] ? formTable.properties[0] : formTable.properties[1]
    if (type in inputTypes) return inputTypes[type]
        .call(this, { method, property, formTable, formData, listners, resolver, layout }, index)
}
function setInputsMethod(formTable) {
    let method = formTable.method && this[formTable.method] ? this[formTable.method] : () => { }
    return method
}

function methodsTemplateResolve(type, methods, Property, listners = {}, resolver) {
    let method = setMethodsMethod.call(this, Property, methods)
    if (type in MethodTypes) return MethodTypes[type].call(this, { type, methods, Property, method, listners, resolver })
    return false
}
function setMethodsMethod(Property, methods) {
    let method = Property && methods[Property] && this[methods[Property].method] ? this[methods[Property].method] : () => { }
    return method
}

export {
    formInputsResolve, methodsTemplateResolve, setInputsMethod, setMethodsMethod
};

