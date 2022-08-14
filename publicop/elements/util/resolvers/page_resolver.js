import { html } from 'lit-html';

const layouts = { simplePage, sidebarPage };
const defaultIgnoredAreas = ["hero", "viewType", "layout", "element", "routes", "links", "imports", "chooseImage"];

function getLayout(areas) {
    if (layouts[areas.layout])
        return layouts[areas.layout].call(this, areas);
}

function setPositions(areas, IGNORE) {
    let positions = [];
    Object.keys(areas).forEach(area => {
        if (!~IGNORE.indexOf(area))
            positions[parseInt(areas[area].position)] = area;
    });
    return positions;
}

function simplePage(areas) {
    var positions = setPositions(areas, ["main", ...defaultIgnoredAreas]);
    const Template = Areas => html`                                     
            <main
                id="${this.INFO.id}-main" 
                container="${this.areas.main.container}"
                class="${this.INFO.id}-main simple-main-${this.areas.viewType}" 
                style="" 
                slot="main">
                ${Areas.map(area => html`
                <section
                    id="${this.INFO.id}-${area}" 
                    aria-label="${this.INFO.id}-${area}" 
                    class="${this.INFO.id}-${area}"
                    .style="${this.areas[area].styles}"
                    content="${this.areas.main.content}">
                </section>`)}
            </main>`;
    return { positions, Template };
}

function sidebarPage(areas) {
    let positions = setPositions(areas, defaultIgnoredAreas);
    const Template = (Areas) => {
        let nav = this.areas[Areas[0]].type === 'nav' ? Areas.shift() : false;
        return html`
            <div class="sidebar-layout">
                ${!!nav ? html`
                <nav
                    slot="nav"
                    id="${this.INFO.id}-${nav}"
                    aria-label="${this.INFO.id}-${nav}"
                    class="${this.INFO.id}-${nav} 
                    ${this.INFO.id}-${nav}-${this.areas[nav].container} tools-nav-${this.areas.viewType}">
                </nav>` : ''}
                <main
                    slot="main"
                    id="main"
                    class="sidebar-main sidebar-main-${this.areas.viewType} sidebar-main-${this.INFO.id}">
                    ${Areas.map(area => html`
                    <section
                        id="${this.INFO.id}-${area}" 
                        aria-label="${this.INFO.id}-${area}"
                        class="${this.INFO.id}-${area} ${this.INFO.id}-${area}-${this.areas[area].content}">
                    </section>`)}
                </main>
            </div>`;
    };
    return { positions, Template };
}

export { getLayout }
