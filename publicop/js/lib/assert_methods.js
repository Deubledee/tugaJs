
export const assertMethods = {
    singleType(assertion, expect, responseData) {
        try {
            if (!(expect in responseData)) {
                assertion.errorMessage = JSON.stringify(responseData)
                return assertion
            }
            if (responseData[expect] === null || responseData[expect] === undefined) {
                assertion.errorMessage = `No data: ${JSON.stringify(responseData[expect])}`
                return assertion
            }
        } catch (error) {
            assertion.errorMessage = `error: ${error}`
            return assertion
        }
        return responseData[expect]
    },
    prefixType(assertion, expect, responseData) {
        try {
            let responseDataKeys = Object.keys(responseData)
            let expectaionSuccess = expect.find(expectaion => responseDataKeys.find(rdKey => rdKey.includes(expectaion)))
            if (!expectaionSuccess) {
                assertion.errorMessage = `query not found: ${JSON.stringify(responseData)}`
                return assertion
            }
            expectaionSuccess = responseDataKeys
                .findIndex(data => !responseData[data]);
            if (!!~expectaionSuccess) {
                assertion.errorMessage = `query empty: ${responseDataKeys[expectaionSuccess]}`
                return assertion
            }

            expectaionSuccess = responseDataKeys.find(data => responseData[data].okMessage);
            if (!!expectaionSuccess) return responseData

            expectaionSuccess = responseDataKeys.find(data => responseData[data].errorMessage);
            if (!!expectaionSuccess) {
                assertion.errorMessage = `${responseData[responseDataKeys[expectaionSuccess]][0].errorMessage}`
                return assertion
            }
            responseDataKeys.forEach(data => {
                let isArray = Array.isArray(responseData[data])
                if (!!isArray) {
                    expectaionSuccess = !!responseData[data].length;
                    if (!expectaionSuccess) {
                        assertion.errorMessage = `query empty: ${responseDataKeys[data]}`
                        return assertion
                    }
                    expectaionSuccess = responseData[data][0].errorMessage
                    if (!!~expectaionSuccess) {
                        assertion.errorMessage = `${responseData[data][0].errorMessage}`
                        return assertion
                    }
                }
            });

        } catch (error) {
            assertion.errorMessage = `error: ${error}`
            return assertion
        }
        return responseData
    },
    defaultAssert(assertion, query, expect, responseData) {
        try {
            if (!(query in responseData)) {
                assertion.errorMessage = `query not found!! response: ${JSON.stringify(responseData)}`
                return assertion
            }
            if (!(expect in responseData[query])) {
                assertion.errorMessage = `got error Message: ${JSON.stringify(responseData[query])}`
                return assertion
            }
            if (responseData[query][expect] === null || responseData[query][expect] === undefined) {
                assertion.errorMessage = `No data: ${JSON.stringify(responseData[query][expect])}`
                return assertion
            }
        } catch (error) {
            assertion.errorMessage = `error: ${error}`
            return assertion
        }
        return responseData[query][expect]
    }
}
