import { html as css, render } from 'lit-html';
import { toggleSpinner } from './methods';

const resetAppStyles = (reset, header = true) => {
    let resetStyles = () => css``
    if (!!reset) {
        toggleSpinner(true)
        if (!!header) render(resetStyles(), document.querySelector(`style[scope=header]`))
        resetStyles = () => css`
     app-articles-form, app-gallery-page, #pageview, app-header {
            -webkit-filter: blur(2px);
            -moz-filter: blur(2px);
            -o-filter: blur(2px);
            -ms-filter: blur(2px);
            filter: blur(2px);
        }
      app-articles-form, app-gallery-page, #pageview {
            visibility: hidden;
        }
    app-articles-form, app-gallery-page, #pageview, footer, #hero-toolbar-bottom {
            display: none;
        }`
    }
    render(resetStyles(), document.querySelector(`style[scope=reset]`))
}

const StylesTemplate = content => {
    toggleSpinner(false)
    resetAppStyles(false)
    return css`
        app-articles-form, app-gallery-page, #pageview, footer, #hero-toolbar-bottom {
            display: block;
        }
        app-articles-form, app-gallery-page, #pageview {
            transition: visibility 1s cubic-bezier(0.47, 0.85, 1, 1) .5s;
            -webkit-transition: 1s visibility cubic-bezier(0.47, 0.85, 1, 1) .5s;
            -o-transition: 1s visibility cubic-bezier(0.47, 0.85, 1, 1) .5s;
            visibility: visible;
        }      
        app-toolbar, app-header {
            display: block;
        }
        app-header {
            transition: filter 0.5s cubic-bezier(0.47, 0.85, 1, 1) 0.7s;
            -webkit-transition: .5s -webkit-filter cubic-bezier(0.47, 0.85, 1, 1) 0.7s;
            -o-transition: .5s -o-filter cubic-bezier(0.47, 0.85, 1, 1) 0.7s;
        }
        app-header{
            -webkit-filter: blur(0px);
            -moz-filter: blur(0px);
            -o-filter: blur(0px);
            -ms-filter: blur(0px);
            filter: blur(0px);
        }
        ${!!(!!content.images && !!content.images.length) || !!content.image ?
            css`
        [condensed-title]{
            background-image: url(${content.images[1] || content.image});
        }
        #header {
            display: block;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            background-image: url(${content.images[2] || content.image});
        }
        `: css`
        #header,
        #hero-toolbar-bottom {            
            display: none;
        }`}
        /*custom styles*/
        ${content.Styles || ''}`
}

export { resetAppStyles, StylesTemplate }
