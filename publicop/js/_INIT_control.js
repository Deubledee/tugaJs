"use strict";
import { resetIgnoreQueries } from "./reset_location";
import { Ignores } from "./Ignores";

function SetDefaultUrlState() {
    resetIgnoreQueries(['logedin', ...Ignores])
    sessionStorage.clear();
}

export default SetDefaultUrlState
