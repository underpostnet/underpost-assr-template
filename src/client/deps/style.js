



class Style {
  constructor(){

    /*

    localStorage.getItem(sortable.options.group.name);
    localStorage.setItem(sortable.options.group.name, order.join('|'));

    */

    const currentTheme = localStorage.getItem("theme");
    if(! currentTheme){
        window.underpost.theme = newInstance(window.underpost.themes[0]);
        localStorage.setItem("theme", JSON.stringify(window.underpost.theme));
        console.warn('theme -> set default ', window.underpost.theme);
    }else{
        window.underpost.theme = JSON.parse(currentTheme);
        console.warn('theme -> get current ', window.underpost.theme);
    }

    s('.loading') ?
    s('.loading').style.background =
    window.underpost.theme.background
    :null;

    window.underpost.theme.classDefault = newInstance(window.underpost.theme.cursorDefault).slice(1);
    window.underpost.theme.cursorDefault != '' ?
    window.underpost.theme.cursorDefault =
    window.underpost.assets.cursors.find(
      x => x.class == window.underpost.theme.cursorDefault
    ).render : null;

    window.underpost.theme.classPointer = newInstance(window.underpost.theme.cursorPointer).slice(1);
    window.underpost.theme.cursorPointer =
    window.underpost.theme.cursorPointer != '' ?
    window.underpost.assets.cursors.find(
      x => x.class == window.underpost.theme.cursorPointer
    ).render : 'cursor: pointer;';


    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    const currentFont = localStorage.getItem("font");
    if(currentFont){
      window.underpost.theme.font = 'font-family: '+currentFont+';';
    }else{
      const fontDefault = 'retro-font';
      localStorage.setItem("font", fontDefault);
      window.underpost.theme.font = 'font-family: '+fontDefault+';';
    }

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    const currentSizeData = JSON.parse(localStorage.getItem('font-sizes'));
    if(currentSizeData){
      window.underpost.theme.fontSize = currentSizeData;
    }else{
      window.underpost.theme.fontSize = {
        _h1: '30px',
        _h2: '20px',
        _p:  '16px'
      };
    }

    // -------------------------------------------------------------------------
    // style input
    // -------------------------------------------------------------------------

    window.underpost.styles.input.style_input = `

        /* padding: 12px 15px; */
        background: `+window.underpost.theme.sub_background+`;
        /* margin: 10px 10px 30px 10px; */
        padding: 10px 10px 10px 18px;
        color: `+window.underpost.theme.sub_text+`;
        font-size: `+window.underpost.theme.fontSize._p+`;
        `+window.underpost.theme.font+`

    `;

    window.underpost.styles.input.style_label = `

        left: 15px;
        color: `+window.underpost.theme.sub_text+`;

    `;

    window.underpost.styles.input.style_placeholder = ``;


    window.underpost.styles.input.botContent = `<br>`;

    // -------------------------------------------------------------------------
    // style section
    // -------------------------------------------------------------------------

    window.underpost.styles.section.underpost_section_title = `

      background: `+window.underpost.theme.section_btn+`;
      color: `+window.underpost.theme.section_btn_color+`;
      padding: 10px;

    `;


    // -------------------------------------------------------------------------
    // style notifi
    // -------------------------------------------------------------------------

    window.underpost.styles.notifi.backgroundNotifi = 'rgba(0, 0, 0, 0.9)';

    // -------------------------------------------------------------------------
    // style global
    // -------------------------------------------------------------------------

    append('render', `


              <style>

                    html, body {
                      `+window.underpost.theme.font+`
                      color: `+window.underpost.theme.text+`;
                      background: `+window.underpost.theme.background+`;
                      font-size: `+window.underpost.theme.fontSize._p+`;
                      `+window.underpost.theme.cursorDefault+`
                    }

                    a {
                      text-decoration: none;
                      color: `+window.underpost.theme.sub_text+`;
                        `+window.underpost.theme.cursorPointer+`
                    }

                    a:hover { text-decoration: underline; }

                    .btn-underpost {
                      transition: .3s;
                      padding: 15px;
                      margin: 5px;
                      background: `+window.underpost.theme.section_btn+`;
                      color: `+window.underpost.theme.section_btn_color+`;
                      border: 3px solid `+window.underpost.theme.section_btn+`;
                      `+window.underpost.theme.cursorPointer+`
                    }

                    .btn-underpost:hover{
                      border: 3px solid `+window.underpost.theme.mark+`;
                      color: `+window.underpost.theme.mark+`;
                      font-weight: bold;
                    }

                    ::placeholder {
                      color: `+window.underpost.theme.sub_text+`;
                      opacity: 1; /* Firefox */
                      background: none;
                    }

                    :-ms-input-placeholder { /* Internet Explorer 10-11 */
                     color: `+window.underpost.theme.sub_text+`;
                     background: none;
                    }

                    ::-ms-input-placeholder { /* Microsoft Edge */
                     color: `+window.underpost.theme.sub_text+`;
                     background: none;
                    }


                    ::-moz-selection { /* Code for Firefox */
                      color: `+window.underpost.theme.section_btn_color+`;
                      background: `+window.underpost.theme.section_btn+`;
                    }
                    ::selection {
                      color: `+window.underpost.theme.section_btn_color+`;
                      background: `+window.underpost.theme.section_btn+`;
                    }


              </style>



    `)
  }
}


export { Style };
