
import { html } from 'lit-html';

function login() {
    return [`.top-grid {
            background-color: rgb(0 0 0 / 39%);;
            display: grid;
            align-content: center;
            justify-content: center;
            height: 100vh;
        }
        .main-grid {
            display: grid;
            grid-template-columns: [col1] 365px;
            grid-template-rows: [row1] 345px [row2] 104px;
            grid-template-areas:                
                "providers"
                "cancel";
            width: 366px;
            height: 450px;
            background-color: #ffffff;
            justify-content: center;
            justify-items: center;            
            align-items: center;
            font-size: 22px;
            letter-spacing: 2px;
            text-transform: capitalize;
            color: #8a8c8f;
            border-radius: 20px;
            box-shadow: 0px 0px 25px rgb(0 0 0);
        }
        .providers {
            grid-area: providers;
            display: grid;
            grid-template-columns: [col1] 327px;
            grid-template-rows:  [row1] 60px [row2] 97px [row3] 64px [row4] 109px;
            grid-template-areas:   
                "message"
                "logo"
                "facebook"
                "twitter";
            align-items: baseline;
            justify-items: center;
            text-align: center;
            height: 290px;
        }
        .popup-message {        
            grid-area: message;
            width: auto;
            padding: 7px;
            background: #323c4f;
            color: #ffffff;
            border-radius: 10px;
            font-weight: bold;
        }
        .popup-logo {
            width: 300px;
            grid-area: logo;
        }
        .popup-facebook{        
            grid-area: facebook;
        }
        .popup-twitter {        
            grid-area: twitter;
        }       
        .cancel {
            grid-area: cancel;
            width: 213px;
            align-self: baseline;
            text-align: center;
            color: #c15f4b;
            border-top: 1px solid #c3bebe;
            padding: 20px;
        }
        .popup-btn-sm {
            padding: 0;
           box-sizing: border-box;
            text-transform: initial;
            font-weight: bold;
           width: 39%;
        }
        .popup-icon {
            width: 27px;
            position: relative;
            top: 3px;
        }
        paper-button.btn {
            padding: 0px;
            color: rgb(255 255 255);
            background-color: #1877f2;
            height: 39px;
            text-transform: capitalize;
            font-size: 14px;
        }
        .fa {
            border-radius: 10px;
            padding-inline-start: 5px;
        }
        .fa:hover {
            box-shadow: 0px 1px 5px #332f2f;
        }
        .fa-facebook {
            background: #1877f2;            
        }
      paper-button.btn-twitter,
      .fa-twitter {
            background: #55ACEE;
            color: white;
        }`,
        detail => html`
        <div class="top-grid">
            <main class="main-grid">                
                <div class="providers">
                    <div class="popup-message">
                        <span>   
                            ${detail.message.split('-').join(' ')}                    
                        </span>
                    </div>
                    <img class="popup-logo" src="../../img/login_logo.png">
                    </img>
                    ${detail.providers.map(provider => html`
                    <div class="popup-${provider} fa fa-${provider}">
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        <img class="popup-icon" src="../../img/${provider}.svg">
                                        </img>
                                    </th>
                                    <th>
                                        <paper-button
                                            name="${provider}" 
                                            class="btn btn-${provider}"
                                            @click="${(this.loginMethod).bind(this)}">                        
                                            Log in with ${provider}  
                                        </paper-button>  
                                    </th>
                                </tr>
                            </tbody>   
                        </table>
                    </div>`)}                   
                </div>
                <div class="cancel">
                    <paper-button class="popup-btn-sm" name="cancel" @click="${(this.loginMethod).bind(this)}">                        
                       ${detail.cancel}  
                    </paper-button>
                </div>
            </main>
        </div>
    `]
}

function satus404() {
    return [`.top-grid {
            background-color: rgb(0 0 0 / 39%);;
            display: grid;
            align-content: center;
            justify-content: center;
            height: 100vh;
        }
        .main-grid {
            display: grid;
            grid-template-columns: [col1] 398px;
            grid-template-rows: [row1] 115px [row2] 134px [row3] 100px;;
            grid-template-areas:
                "warning"
                "message"
                "action";
            width: 400px;
            height: 350px;
            background-color: #ffffff;
            justify-content: center;
            justify-items: center;            
            align-items: center;
            font-size: 22px;
            letter-spacing: 2px;
            text-transform: capitalize;
            border-radius: 20px;
            box-shadow: 0px 0px 25px rgb(0 0 0);
            color: var(--app-secondary-text-color)
        }
        .message {
            grid-area: message;
            text-align: center;
            box-sizing: border-box;
            padding: 5px;
        }
        .warning {
           grid-area: warning ; 
        }
        .action {
           grid-area: action; 

        }
        paper-button.btn {
            color: rgb(255 255 255);
            background-color: rgb(100 149 237);
            height: 39px;
        }
    `,
        detail => html`
        <div class="top-grid">
            <main class="main-grid">
                <div class="warning">
                    <h1> ${detail.warning}  </h1>
                </div>
                <div class="message">
                    <span> ${detail.message}  </span>
                </div>
                <div class="action">
                    <paper-button class="btn" @click="${(this.statusMethod).bind(this)}">                        
                       ${detail.action}  
                    </paper-button>
                </div>
            </main>
        </div>
    `]
}
function chooseImage() {
    let allow = true
    return [`
    main.main-grid {
        height: 100vh;
    }
    .image-form {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        overflow: auto;
        padding: 10px
    }
    `,
        detail => html`        
            <main class="main-grid">
                ${console.log(detail)}
                 <div class="message">
                    <h1> ${detail.message}  </h1>
                </div>
                             
            </main>
    `]
}
function customTemplate() {
    return [``, detail => html`${detail.template(this.statusMethod.bind(this), this.defaultCancel.bind(this))}`]
}

export {
    login,
    satus404,
    chooseImage,
    customTemplate
}
