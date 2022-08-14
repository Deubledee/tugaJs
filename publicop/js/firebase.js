import { initializeApp } from "firebase/app";
import { browserSessionPersistence, signInWithCustomToken, FacebookAuthProvider, getAuth, signInAnonymously, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { getPerformance, trace } from "firebase/performance";
import { getStorage, ref, uploadBytes as upload, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals/base';
import { mixInScope } from '../elements/lib/methods';
import { assertResponse } from './lib/asserts';
import { graphQlUrl, headers, httpPost, httpGet } from './lib/http-handler';

/**
 * Todo  sendToFirebase
 */
function sendToFirebase(performance, evt) {
    let { delta, entries, name } = evt
    entries.forEach(({ startTime }) => {
        let { record } = trace(performance, name)
        // record(startTime)
    })
}



function FirebaseAPP() {
    this.app
    this.Ref
    this.auth
    this.signIn
    this.upload
    this.listAll
    this.storage
    this.analitics
    this.getMetadata
    this.Persistence
    this.getDownloadURL
}

function getProperties(frbseApp) {
    return [
        getAuth(frbseApp),
        getStorage(frbseApp),
        getPerformance(frbseApp),
        {
            facebook: FacebookAuthProvider,
            twitter: TwitterAuthProvider
        }
    ]
}

function getMixinMethods(frbseApp) {
    let [auth, storage, performance, providers] = getProperties(frbseApp)
    return {
        signIn: provider => signInWithPopup(getAuth(frbseApp), provider),
        signInAnonymously: () => signInAnonymously(getAuth()),
        signInWithCustomToken: token => signInWithCustomToken(getAuth(), token),
        Ref: ref,
        upload,
        listAll,
        getMetadata,
        getDownloadURL,
        Persistence: { browserSessionPersistence },
        performance,
        providers,
        storage,
        auth
    }
}

const firebaseApp = new FirebaseAPP()

function firebaseResponeCallback(config) {
    const frbseApp = initializeApp(config);
    mixInScope.call(this, getMixinMethods(frbseApp))
    getCLS((event) => sendToFirebase(performance, event));
    getLCP((event) => sendToFirebase(performance, event));
    getFID((event) => sendToFirebase(performance, event));
    getFCP((event) => sendToFirebase(performance, event));
    getTTFB((event) => sendToFirebase(performance, event));
}

function setFirebaseApp() {
    let Query = `clientProject(projectId: "tugajs") {
            ... on Cproject { config { appId apiKey projectId authDomain storageBucket measurementId messagingSenderId } }
            ... on Error { errorMessage }
    }`
    return httpGet(Query, `${graphQlUrl}project`, headers(false))
        .then(res => assertResponse('clientProject', 'config', res, res.json(), 'config error'))
        .then(firebaseResponeCallback.bind(firebaseApp))
}

async function getProjectLangs() {
    let Query = `getProjectLangsAndTheme(projectId: "tugajs") { 
            ... on LangsStyles { langs } 
            ... on Error { errorMessage } 
        }`
    return await httpGet(Query, `${graphQlUrl}pages/`, headers(false))
        .then(res => assertResponse('getProjectLangsAndTheme', 'langs', res, res.json(), 'response returned an errorMessage'))
}

function checkCurrentUser() {
    return !!(firebaseApp.auth.currentUser)
}

export {
    headers,
    graphQlUrl,
    httpPost,
    httpGet,
    firebaseApp,
    assertResponse,
    setFirebaseApp,
    getProjectLangs,
    checkCurrentUser
};

