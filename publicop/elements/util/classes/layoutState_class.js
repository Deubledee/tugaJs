import { mixInScope } from '../../lib/methods';
import { LayoutStateControlFactory, layoutEventFactory } from './layoutEvent_class';

const _LSC_$ = LayoutStateControlFactory();
function setMediasMatchEvent(MatchMedias) {
    if (MatchMedias.constructor.name === 'Array')
        return MatchMedias
            .forEach(mediaMatch => _LSC_$.setMediaMatchListener(mediaMatch));
    if (MatchMedias.constructor.name === 'String')
        _LSC_$.setMediaMatchListener(MatchMedias);
}

function getCurrentLayout() {
    let { CurrentLayout: layout, activeQuery: MediaQuery } = _LSC_$.getCurrentStateValues();
    return { layout, MediaQuery };
}

class LayoutState {
    constructor(scope, { globalMediaQueries, rootMediaQueries, type }) {
        this._LoadState = { _onLoadUpdated: false };
        this._innerState = {
            _desktop: undefined, _mobile: undefined, _CurrentLayout: undefined,
            _activeQuery: undefined, _LayoutToggleQueryValue: undefined,
        };
        this._update(this.constructor);
        this._onLoadUpdated = true;
        this.type = type;
        this.scope = scope;
        this._MediaQueries = Array.from(new Set([...Object.keys(globalMediaQueries), ...Object.keys(rootMediaQueries)]));
        setMediasMatchEvent(this._MediaQueries); /**/
    }
    on_desktopLayout(mediaMatch, callBack) {
        _LSC_$.SetLayoutEvent(layoutEventFactory.call(this, this.scope, this.type, 'desktop', mediaMatch, callBack));
        return this;
    }
    on_mobileLayout(mediaMatch, callBack) {
        _LSC_$.SetLayoutEvent(layoutEventFactory.call(this, this.scope, this.type, 'mobile', mediaMatch, callBack));
        return this;
    }
    match() {
        _LSC_$.matchType(this.type);
        return this;
    }
    clearEvents() {
        _LSC_$.removeTypeEvents(this.type);
    }
    _update({ name: callerConstrutorName }) {
        if (callerConstrutorName === 'layoutEvent' || !this.onLoadUpdate)
            return mixInScope.call(this, _LSC_$.getCurrentStateValues());
        console.error('not a layoutEvent instance', callerConstrutorName);
    }
    get _onLoadUpdated() {
        return this._LoadState._onLoadUpdated;
    }
    get LayoutToggleQueryValue() {
        return this._innerState._LayoutToggleQueryValue;
    }
    get activeQuery() {
        return this._innerState._activeQuery;
    }
    get CurrentLayout() {
        return this._innerState._CurrentLayout;
    }
    get mobile() {
        return this._innerState._mobile;
    }
    get desktop() {
        return this._innerState._desktop;
    }
    set _onLoadUpdated(data) {
        this._LoadState._onLoadUpdated = data;
        Object.seal(this._LoadState);
    }
    set LayoutToggleQueryValue(data) {
        this._innerState._LayoutToggleQueryValue = data;
    }
    set activeQuery(data) {
        this._innerState._activeQuery = data;
    }
    set CurrentLayout(data) {
        this._innerState._CurrentLayout = data;
    }
    set mobile(data) {
        this._innerState._mobile = data;
    }
    set desktop(data) {
        this._innerState._desktop = data;
    }
}

function LayoutStateFactory(INFO) {
    return new LayoutState(this, INFO)
}

export { getCurrentLayout, LayoutStateFactory }
