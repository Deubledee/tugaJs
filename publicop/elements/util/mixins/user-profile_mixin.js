import { extention, mixInScope, setDataSimple } from '../../lib/methods';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import * as queries from '../requests&queries/queries/profile_queries';
import * as resolvers from '../resolvers/profile_resolver';
import * as route_methods from '../route-methods/profile-route_methods';

const methodsToInclude = {
    ...queries, ...route_methods, setLayoutState, setDataSimple, setPropertyContentAsInfoData
}

export const Methods = (classElement) => class extends extention(classElement) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        mixInScope.call(this, methodsToInclude)
        mixInScope.call(this, resolvers, this.resolvers)
        this.articlesQueries.endpoints = true
    }
    defaultCancel(evt) {
        console.log(evt);
    }
    statusMethod(evt) {
        console.log(evt);
    }
    defaultFormCallback(evt) {
        console.log(evt);
    }
    /* setDefaultFormData() {
         this.edit = false;
         this.editaccount = false
     }
     setEdit(query) {
         if (query.editprofile) {
             this.editaccount = true
             this.edit = atob(query.editprofile).split('-')[1];
             sessionStorage[this.edit] = JSON.stringify(this.userProfile)
             this.resolvers.getUserProfile.call(this)
         }
     }*/
}
