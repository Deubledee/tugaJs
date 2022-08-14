import { firebaseApp } from "./firebase";
import { mixInScope } from '../elements/lib/methods';

const userCredentials = {};
const TopRoles = ["admin", "moderator"]

function createSecret(secretLength = 5, start = 65, end = 90, colletion = []) {
    let secret = ''
    for (let i = start; i < end; i++)colletion.push(String.fromCharCode(i))
    for (let i = 0; i < secretLength; i++) {
        let rnd = Math.round(Math.random() * colletion.length)
        if (!~rnd) {
            --i
            continue
        }
        secret += colletion[rnd]
    }
    return secret
}
function generateTempSecret(DefaultExpirationTime = 5000) {
    if (!!this.tempSecret) return this.tempSecret
    this.tempSecret = createSecret()
    let tempSecretExpiration = setTimeout(() => {
        clearTimeout(tempSecretExpiration)
        this.tempSecret = undefined;
    }, DefaultExpirationTime);
    return this.tempSecret
}
async function _SetInitial_(that) {
    if (that.state === 'not logedin') return false;
    this.isAnonymous = false
    let { issuedAtTime, claims } = await firebaseApp.auth.currentUser.getIdTokenResult(true);
    let { hasprofile, role, name } = claims
    let { providerData, metadata, uid } = firebaseApp.auth.currentUser
    let { providerId, email, photoURL: avatar } = providerData[0]
    return { hasprofile, role, name, issuedAtTime, uid, email, avatar, providerId, metadata }
}
class UserRecord {
    constructor(state, callback) {
        this._userInfo = {};
        this.role = 'all users';
        this.name = 'user';
        this.state = state;
        this.role = 'user'
        this.email = '@user'
        this.tempSecret = ''
        _SetInitial_(this)
            .then(mixIn => {
                if (!!mixIn) {
                    mixInScope.call(this, mixIn)
                    firebaseApp.auth.onIdTokenChanged(() => this._onIdTokenChanged(callback))
                }
                Object.seal(this._userInfo);
            })
        Reflect.defineProperty(this, 'checkCredentials', {
            value: (credentials, article) => {
                let author = 'author', credentialsCheck = false
                if (!!~credentials.indexOf(this.role)) credentialsCheck = generateTempSecret.call(this)
                if (!credentialsCheck || !!credentialsCheck && !article) return credentialsCheck
                let hasAuthorPermition = !!~credentials.indexOf(author)
                if (!!article && !hasAuthorPermition && !~TopRoles.indexOf(this.role)) return false
                let isAuthor = this.checkIfIsAuthor(article)
                if (!!isAuthor || !!~TopRoles.indexOf(this.role)) return credentialsCheck
                return false
            },
            configurable: false,
            writable: false,
            enumerable: true
        })
        Reflect.defineProperty(this, 'checkSecret', {
            value: (tempSecret) => {
                if (this.tempSecret === tempSecret) return true
                return false
            },
            configurable: false,
            writable: false,
            enumerable: true
        })
    }
    _onIdTokenChanged(callback) {
        if (!!callback && typeof callback === 'function') callback({ UserRecord: this })
    }
    async generateNewExchangeToken() {
        let { token } = await firebaseApp.auth.currentUser.getIdTokenResult(true);
        return { ...this, token };
    }
    checkIfIsAuthor({ author }) {
        if (author.name === this.name && author.email === this.email) return author;
    }
    get state() {
        return this._userInfo._state;
    }
    get providerId() {
        return this._userInfo._providerId;
    }
    get metadata() {
        return this._userInfo._metadata;
    }
    get isAnonymous() {
        return this._userInfo._isAnonymous;
    }
    set isAnonymous(isAnonymous) {
        this._userInfo._isAnonymous = isAnonymous;
    }
    set state(state) {
        this._userInfo._state = state;
    }
    set providerId(providerId) {
        this._userInfo._providerId = providerId;
    }
    set metadata(metadata) {
        this._userInfo._metadata = metadata;
    }
}

function UserRecordFactory(state, callback) {
    return new UserRecord(state, callback);
}

function setUser(state = 'not logedin', callback = undefined) {
    userCredentials.UserRecord = {}
    userCredentials.UserRecord = UserRecordFactory(state, callback);
    return userCredentials
}

function getUser() {
    return userCredentials.UserRecord ? userCredentials : false
}

export { setUser, getUser }
