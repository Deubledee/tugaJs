
const States = {};

function getQueryState() {
    return States.query;
}
function setQueryState(query) {
    States.query = query;
}

function getLogedinState() {
    return States.logedin;
}
function setLogedinState(logedin) {
    States.logedin = logedin;
}

export {
    getQueryState, getLogedinState,
    setQueryState, setLogedinState
}
