import { microTask } from '@polymer/polymer/lib/utils/async';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';

function setStatus404(page, type) {
    this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent('popup', {
            bubbles: true,
            composed: true,
            detail: {
                type: 'satus404', warning: 'status 404', message: `${type} ${page} not found!!!`, action: `go back home`, method: (callback404).bind(this)
            }
        }));
    });
    window.history.pushState({}, null, `404?nopage=${page}`);
    window.dispatchEvent(new CustomEvent('location-changed'));
}
function setErrorStatus(type, error) {
    this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent('popup', {
            bubbles: true,
            composed: true,
            detail: {
                type: 'satus404', warning: `status ${type}`, message: `${error} `, action: `send msg to Admin`, method: (callbackError).bind(this)
            }
        }));
    });
    window.history.pushState({}, null, `${type}?msg=${error}`);
    window.dispatchEvent(new CustomEvent('location-changed'));
}
function setLogin(detail) {
    this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent('popup', {
            bubbles: true,
            composed: true,
            detail
        }));
    });
}
function callCustomTemplatePopup(detail, popElement = 'popup') {
    this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent(popElement, {
            bubbles: true,
            composed: true,
            detail
        }));
    });
}
function callChooseImagePopup(detail) {
    var _changeSectionDebouncer = Debouncer.debounce(_changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent('choose-image', {
            bubbles: true,
            composed: true,
            detail
        }));
    });
}
function sendLoginStatus(detail) {
    this._changeSectionDebouncer = Debouncer.debounce(this._changeSectionDebouncer, microTask, () => {
        window.dispatchEvent(new CustomEvent('login-status', {
            bubbles: true,
            composed: true,
            detail
        }));
    });
}


function callbackError() {
    console.warn('TODO send Email to Admin')
}

function callback404() {
    this.__revertToDefaultPage(localStorage['app-lang'])
}

export { setStatus404, setErrorStatus, setLogin, sendLoginStatus, callChooseImagePopup, callCustomTemplatePopup }
