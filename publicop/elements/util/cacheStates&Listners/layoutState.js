import { LayoutStateFactory, getCurrentLayout } from '../classes/layoutState_class'

function setAppLayoutState() {
    let MediaQueries = { '(min-width: 871px)': '(min-width: 871px)', '(max-width: 870px)': '(max-width: 870px)' }
    let INFO = { globalMediaQueries: MediaQueries, rootMediaQueries: MediaQueries, type: 'app' }
    return this.LayoutState = LayoutStateFactory.call(this, INFO)
}
function setLayoutState() {
    let INFO = this.INFO ? this.INFO : this.category ? this.category : false
    if (!INFO) return console.error('no INFO or category found', INFO);
    return this.LayoutState = LayoutStateFactory.call(this, INFO)
}

export { getCurrentLayout, setAppLayoutState, setLayoutState }
