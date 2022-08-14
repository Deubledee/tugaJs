
function _Event_Resolver_(evt) {
    this.mouseDownTimeOut = setTimeout(() => {
        if (this.clicked || this.mouseDown) return;
        console.log(evt)
        this.mouseDown = true;
        this.ResolveOrigin(evt);
        clearTimeout(this.mouseDownTimeOut);
    }, 500);
}

function _MouseClicked_() {
    this.clicked = true;
    setTimeout(() => this.resetMouseEventsState(), 500);
}

function resetMouseEventsState() {
    this.clicked = false;
    this.mouseDown = false;
}


export { resetMouseEventsState, _MouseClicked_, _Event_Resolver_ }
