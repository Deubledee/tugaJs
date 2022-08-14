class LayoutStateControl {
    constructor() {
        this.LayoutToggleQueryValue = 870;
        this.activeQuery = '(min-width: 871px)'
        this.CurrentLayout = 'desktop'
        this.desktop = true;
        this.mobile = false;
        this._updateLayout(this.activeQuery)
        this.layoutStateChangeErrorCallBacks = [];
        this.layoutStateChangeCallBacks = [];
        this.MediaMatches = [];
    }
    setMediaMatchListener(mediaMatch) {
        if (!!~this.MediaMatches.indexOf(mediaMatch)) return;
        this.mediaMatch = matchMedia(mediaMatch);
        this.activeQuery = !!this.mediaMatch.match ? this.mediaMatch.media : this.activeQuery
        this.CurrentLayout = this._checkLayout(this.activeQuery);
        this.mediaMatch.onchange = () => this._onLayoutChange(mediaMatch);
        this.MediaMatches.push(mediaMatch);
    }
    getCurrentStateValues() {
        let CurrentStateValues = {
            desktop: this.desktop,
            mobile: this.mobile,
            CurrentLayout: this.CurrentLayout,
            activeQuery: this.activeQuery,
            LayoutToggleQueryValue: this.LayoutToggleQueryValue
        };
        return { ...CurrentStateValues };
    }
    SetLayoutEvent(layoutEvent) {
        if (layoutEvent.constructor.name === 'LayoutEvent')
            return this.layoutStateChangeCallBacks.push(layoutEvent);
        console.error('not a LayoutEvent instance', layoutEvent, layoutEvent.constructor.name);
    }
    matchType(type) {
        this._UPDATE_()
        let layoutEvents = this.layoutStateChangeCallBacks
            .filter(layoutEvent => layoutEvent.MatchesMedia(this.activeQuery, this.CurrentLayout))
            .filter(layoutEvent => layoutEvent.MatchesType(type));
        this._callFilteredCallbacks(layoutEvents);
    }
    removeTypeEvents(type) {
        let EventsToKeep = this.layoutStateChangeCallBacks.filter(layoutEvent => !layoutEvent.MatchesType(type));
        this.layoutStateChangeCallBacks = EventsToKeep;
    }
    _onLayoutChange(mediaMatch) {
        this._updateLayout(mediaMatch)
        let layoutEvents = this.layoutStateChangeCallBacks
            .filter(layoutEvent => layoutEvent.MatchesMedia(this.activeQuery, this.CurrentLayout));
        this._callFilteredCallbacks(layoutEvents);
    }
    _UPDATE_() {
        let mediaMatch = this._getDisplayMediaQuery()
        this._updateLayout(mediaMatch)
    }
    _updateLayout(mediaMatch) {
        let newCurrentLayout = this._checkLayout()
        this[this.CurrentLayout] = !this.CurrentLayout;
        this[newCurrentLayout] = !!newCurrentLayout;
        this.CurrentLayout = newCurrentLayout;
        this.activeQuery = mediaMatch;
    }
    _getDisplayMediaQuery(count = 0) {
        if (count >= 50) return console.error('no MediaMatches have been set after %d attempts!! ', count, this.MediaMatches);
        if (!this.MediaMatches.length) return this._getDisplayMediaQuery(++count)
        let activeQuery = this.MediaMatches.find(mediaMatch => matchMedia(mediaMatch).matches)
        if (activeQuery) return activeQuery
        return this.activeQuery
    }
    _callFilteredCallbacks(layoutEvents) {
        if (!!layoutEvents.length) layoutEvents.forEach(layoutEvent => layoutEvent.callBack(this.CurrentLayout, this.activeQuery));
    }
    _checkLayout() {
        return (this.LayoutToggleQueryValue >= window.innerWidth) ? 'mobile' : 'desktop';
    }
}
class LayoutEvent {
    constructor(callerScope, scope, type, layout, mediaMatch, callBack) {
        this.scope = scope;
        this._callerScope = callerScope;
        this.type = type;
        this.layout = layout;
        this.mediaMatch = mediaMatch;
        this.callBack = callBack.bind(this.scope);
    }
    MatchesType(type) {
        if (this.type !== type) return false;
        return true;
    }
    MatchesMedia(mediaMatch, layout) {
        this._updateCallerScopeScope();
        if (this.mediaMatch !== mediaMatch || this.layout !== layout) return false;
        return true;
    }
    _updateCallerScopeScope() {
        this._callerScope._update(this.constructor);
    }
}

export function layoutEventFactory(scope, type, layout, mediaMatch, callBack) {
    return new LayoutEvent(this, scope, type, layout, mediaMatch, callBack);
}
export function LayoutStateControlFactory() {
    return new LayoutStateControl();
}
