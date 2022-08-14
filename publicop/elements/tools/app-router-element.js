
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { html, PolymerElement } from '@polymer/polymer';
import { microTask } from '@polymer/polymer/lib/utils/async';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { elementsDefine } from '../lib/methods';


class appRouterElement extends PolymerElement {
    static get template() {
        return html`
        <app-location route="{{route}}"> 
        </app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}" active="{{active}}" query-params="{{query}}">
        </app-route> 
        <app-route route="{{subroute}}" pattern="/:page2" data="{{routeData2}}" tail="{{subroute2}}" active="{{activepage2}}" query-params="{{query2}}">
        </app-route>  
        `
    }
    static get is() { return 'app-router-element' }
    static get properties() {
        return {
            layer1: {
                type: Boolean
            },
            layer2: {
                type: Boolean
            }
        };
    }
    static get observers() {
        return [
            '_Layer1Routed(route, routeData, query)',
            '_Layer2Routed(subroute, routeData2, query2)'
        ];
    }
    connectedCallback(...args) {
        super.connectedCallback(...args);
    }
    ready() {
        super.ready()
    }
    _Layer1Routed(route, routeData, query) {
        if (!!this.layer1 && !this.subroute.path) {
            this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
                this.routecallback(route, routeData, query, 'layer1')
            });
        }
    }
    _Layer2Routed(subroute, routeData2, query2) {
        if (!!this.layer2 && !!subroute.path) {
            this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
                this.route2callback(subroute, routeData2, query2, 'layer2')
            });
        }
    }
    routecallback() { }
    route2callback() { }
};
elementsDefine(appRouterElement.is, appRouterElement);
