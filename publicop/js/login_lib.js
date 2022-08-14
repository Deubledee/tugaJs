import { urlQueryToObject, SetNewUrl } from "./urlQueryToObject";
import { firebaseApp, checkCurrentUser } from "./firebase";
import { sendLoginStatus, setLogin } from '../elements/lib/warnings';
import { setUser, getUser } from "./userCredentials";

/*
* *login methods
*/

function getCredentials(Token = false) {
    let userCredentials = getUser()
    if (!userCredentials) return setUser()
    if (!Token) return userCredentials;
    return userCredentials.UserRecord.generateNewExchangeToken();
}

function signInWithToken({ token }) {
    return firebaseApp.signInWithCustomToken(token)
}

function resolveResult() {
    setUser('logedin', callback)
}
function callback(UserRecord) {
    sendLoginStatus.call(this, { ...UserRecord })
    loginLocationChange()
}
function loginLocationChange() {
    let ResetHrefQueries = ['logedin']
    let { queries, href } = urlQueryToObject()
    let newHref = href, validQueries = Object.keys(queries)
        .filter((queryKey) => !~ResetHrefQueries.indexOf(queryKey))
    newHref = SetNewUrl(queries, validQueries, newHref)
    let url = `${newHref}&logedin=true`
    window.history.pushState({}, null, url);
    window.dispatchEvent(new CustomEvent('location-changed'));
}

function signInWithPopup(provider) {
    return firebaseApp.auth.setPersistence(firebaseApp.Persistence.browserSessionPersistence)
        .then(() => firebaseApp.signIn(provider));
}
function appLogin(message) {
    let [type, cancel, providers, cancelMethod, method] =
        ['login', 'cancel', ['facebook', 'twitter'], (loginCallback).bind(this), (loginCallback).bind(this)]
    setLogin.call(this, { type, message, cancel, providers, cancelMethod, method })
}

function getLoginAssets() {
    return { signInWithPopup, providers: firebaseApp.providers, resolveResult }
}
async function loginCallback(provider) {
    if (!!provider) {
        const { signInWithPopup, providers, resolveResult } = getLoginAssets()
        return await signInWithPopup(new providers[provider]())
            .then(() => resolveResult.call(this))
            .catch(() => sendLoginStatus.call(this, { status: 'notlogedin' }))
    }
    sendLoginStatus.call(this, { status: 'notlogedin' })
}

function checkRole(role) {
    return !!role ? role : ''
}
function checkForLogin(data = {}) {
    return checkUserSession.call(this)
        .then(session => data.toLogin ? Promise.resolve(session) : Promise.reject(session))
}
function checkUserSession(load = String()) {
    let session = checkCurrentUser()
    if (session && load === "load")
        return Promise.resolve({ getLoginAssets, checkRole, sendLoginStatus })
    return Promise.resolve(session)
}

function _CheckAuthor(Aproved) {
    let { UserRecord } = getCredentials()
    let { author } = this.article
    let aproved = UserRecord.checkIfIsAuthor({ author })
    if (!!author) Aproved.author = aproved
    return author
}
function _CheckSecret(tempSecret, Aproved) {
    let { UserRecord } = getCredentials()
    let secret = !!UserRecord.checkSecret(tempSecret)
    if (!!secret) Aproved.secret = tempSecret
    return secret
}

export {
    checkRole,
    checkUserSession,
    checkForLogin,
    appLogin,
    getCredentials,
    _CheckAuthor,
    _CheckSecret,
    sendLoginStatus,
    signInWithToken
};
