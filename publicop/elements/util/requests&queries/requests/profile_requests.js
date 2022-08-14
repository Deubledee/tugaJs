
import { _postUsers } from '../../../lib/app_defalut_http-requests';

async function createUserAccount(user, email, token) {
    let { title, content } = data,
        query = `createUserAccount(projectId: "tugajs", articleID: "${title}", category: "blog/article",  email: "${email}", user: "${user}"}) {
                ... on Error {
                    errorMessage,
                    errorStatus,
                    okMessage
                }           
          }`
    return await _postUsers(query).then(res => res.json()).catch(console.error)
}
async function updateUserAccount(user, email, token) {
    let { title, content } = data,
        query = `updateUserAccount(projectId: "tugajs", articleID: "${title}",   email: "${email}", user: "${user}") {
                ... on Error {
                    errorStatus,
                    errorMessage,
                    okMessage
                }           
          }`
    return await _postUsers(query, { "Authorization": "Bearer " + token }).then(res => res.json()).catch(console.error)
}

export {
    createUserAccount, updateUserAccount
}
