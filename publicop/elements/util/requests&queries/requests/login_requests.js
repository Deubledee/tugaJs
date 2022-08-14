import { assertResponse } from '../../../../js/lib/asserts';
import { _getUsers } from '../../../lib/app_defalut_http-requests';

export function getUserCredentials({ uid }) {
    let query = `checkUserForCredentials(projectId: "tugajs", uid: "${uid}") {
            ... on userConfig { role  hasprofile metadata { lastSignInTime } }
            ... on noUser { standartRole }
            ... on Error { errorStatus errorMessage }
        }`
    return _getUsers(query)
        .then(res => assertResponse('singleType', 'checkUserForCredentials', res, res.json(), 'User Credentials error'))
}
