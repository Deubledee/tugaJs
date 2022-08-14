import { createUserAccount, updateUserAccount } from '../requests&queries/requests/profile_requests'
import { _getNoCarigeReturn } from './blog-list-article_lib'
import { getCredentials } from '../../../js/login_lib'

function defaultFormCallback(event) {
    getCredentials(true)
        .then(userCredentials => {
            let [UserData, email, token] = createUserData.call(this, event, userCredentials)
            if (!UserData || !token) return
            if (!this.edit) return createUserAccount.call(this, UserData, email, token)
            updateUserAccount.call(this, UserData, email, token)
        });
}
function createUserData({ detail }, { UserRecord },) {
    if (!UserRecord.name) return [false, false], console.error('no user')
    let { name, uid, providerId, token, metadata: mtdt } = UserRecord
    let [{ userScreenID, email, address, ocupation, bio, phoneNumber }, avatar] =
        [detail, this.IMAGES]
    let author = { name, uid: uid },
        linkedProviderAccounts = [{ provider: providerId, account: uid }],
        linkedAccounts = [uid], { lastSignInTime } = mtdt
    let metadata = { creationTime: new Date().toLocaleDateString(), lastSignInTime, author, linkedProviderAccounts }
    let user = btoa(JSON.stringify({ uid, name, userScreenID, email, avatar, phoneNumber, address, ocupation, bio, linkedAccounts, metadata }))
    return [user, email, token]
}

export { defaultFormCallback }
