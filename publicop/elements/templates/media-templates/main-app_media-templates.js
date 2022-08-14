
import { html } from 'lit-html';
import { getInfoDataByType } from '../../lib/methods';
import { appLogin, getCredentials } from '../../../js/login_lib';
import { setHrefs } from "../../../js/urlQueryToObject";


const pagesMediaTemplates = {
    desktop(pages) {
        return html`
        ${pages.map((page) => html`
        <paper-tab 
            link
            title="${page.langs[this.lang]}" 
            name="${page.langs[this.lang]}">
            <a class="theme-anchor bordered-bg-collored desktop"
                tabindex="-1"
                name="${page.langs[this.lang]}"
                title="${page.langs[this.lang]}" 
                href="${this[setHrefs.call(this, { ...this.query }, page, page.id)]}">
                <aside 
                    class="theme-anchor-aside"
                    style="text-align:left">
                    <iron-icon
                        icon="${page.icon}" 
                        slot="item-icon">
                    </iron-icon>
                </aside>
                <aside style="text-align:right">
                    ${page.langs[this.lang]}
                </aside>
            </a>
        </paper-tab>`)}`
    },
    mobile(pages) {
        return html`    
            <paper-menu-button>
                <paper-icon-button
                    icon="menu" slot="dropdown-trigger" 
                    alt="menu">
                </paper-icon-button>
                <paper-listbox 
                    class="mobile" 
                    slot="dropdown-content">
                    ${pages.map(page => html`
                    <a class="theme-anchor bordered-bg-collored mobile"                        
                        tabindex="-1"
                        name="${page.langs[this.lang]}"
                        title="${page.langs[this.lang]}" 
                        href="${this[setHrefs.call(this, { ...this.query }, page)]}">
                        <paper-item
                            title="${page.langs[this.lang]}" 
                            name="${page.langs[this.lang]}">
                            ${page.langs[this.lang]}
                        </paper-item>
                    </a>
                    `)}
                </paper-listbox>
            </paper-menu-button>`
    }
}

const langMediaTemplates = {
    desktop() {
        let { UserRecord } = getCredentials()
        let profile = getInfoDataByType.call(this, 'profile', 'viewPages')
        if (!profile) return
        let resolve = !!UserRecord.checkCredentials(profile.permitions)
        return html`
            <div class="loged-user loged-user-${resolve}">
                ${!resolve ?
                html`
                <aside class="login-anchor-aside-${resolve}">
                    <span> log in <span>
                </aside>
                <paper-icon-button
                    class="theme-anchor-aside" 
                    style="text-align:left" 
                    id="usericon" 
                    name="usericon" 
                    title="login"
                    icon="social:person"
                    @click="${(onLoginButtonClick).bind(this)}">
                </paper-icon-button>`:
                html`                
                <app-user-menu
                    class="user-profile"
                    .displayname="${UserRecord.name}" 
                    .avatar="${UserRecord.avatar}"
                    .resolved=${resolve}>                    
                    <a class="user-anchor" 
                        slot="userprofile"
                        href="/${this.userProfile.path}?type=${this.userProfile.type}&view=${this.userProfile.id}&profile=${btoa(`${UserRecord.name}-${UserRecord.uid}-${UserRecord.email}`)}&hasprofile=${UserRecord.hasprofile}&lang=${this.lang}">
                        <paper-icon-button
                            @click=${unsellectPage.bind(this)} 
                            class="theme-anchor-aside" 
                            style="text-align:left" 
                            id="usericon" 
                            name="usericon"
                            title="login"
                            icon="social:person">
                        </paper-icon-button>
                        <aside style="width: 131px">
                            ${this.userProfile.langs[this.lang]}
                        </aside>
                    </a>
                </app-user-menu>`}
            </div>`
    },
    mobile(html, resolve) {
        return html`
            <div class="loged-user loged-user-${resolve}">
                <paper-button> MOBILE </paper-button>
            </div>`}
}

function unsellectPage() {
    this.querySelector("#toolbar-pages").selected = undefined
}

function onLoginButtonClick() {
    appLogin.call(this, 'login')
}
export { langMediaTemplates, pagesMediaTemplates }
