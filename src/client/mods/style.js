



class Style {
  constructor(){

    // nulo -> ''
    const THEMES = [
      {
        "name": "normal",
        "background": "black",
        "text": "white",
        "sub_background":"yellow",
        "sub_text": "blue",
        "section_btn": "green",
        "section_btn_color": "black",
        "mark": "orange",
        "font": "gothic",
        "cursorDefault": ".underpost-default",
        "cursorPointer": ".underpost-pointer"
      }
    ];

    /*

    localStorage.getItem(sortable.options.group.name);
    localStorage.setItem(sortable.options.group.name, order.join('|'));


    */
    const currentTheme = THEMES.find( x => x["name"] == localStorage.getItem("theme") );
    window.underpost.theme = currentTheme ? currentTheme : THEMES[0];

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


    window.underpost.theme.font != '' ?
    window.underpost.theme.font =
    `font-family: `+window.underpost.theme.font+`;`
    : null

    append('render', `


                    <div class='fix' style='
                    transform: translate(-50%, 0);
                    left: 50%;
                    bottom: 10px;
                    height: 60px;
                    width: 100px;
                    background: gray;
                    z-index: 100;
                    '>

                        <div class='abs center content-themes'>

                        </div>

                    </div>


    `)

    for(let theme_ of THEMES){

        append('.content-themes', `



                        <div class='inl theme-btn-`+theme_.name+`' style='padding: 5px; border: 2px solid black;'>
                                  `+theme_.name+`
                        </div>


        `);

        s('.theme-btn-'+theme_.name).onclick = () => {
          console.log(theme_);
        }

    }

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


    window.style_input = `

        /* padding: 12px 15px; */
        font-size: 14px;
        background: `+window.underpost.theme.sub_background+`;
        /* margin: 10px 10px 30px 10px; */
        padding: 10px 10px 10px 18px;
        color: `+window.underpost.theme.sub_text+`

    `;

    window.style_label = `

        font-size: 12px;
        left: 15px;
        color: `+window.underpost.theme.sub_text+`;

    `;

    window.style_placeholder = ``;

    window.underpost_section_title = `

      background: `+window.underpost.theme.section_btn+`;
      padding: 10px;

    `;

    window.botContent = ``;

    window.backgroundNotifi = 'rgba(0, 0, 0, 0.9)';

    append('render', `


              <style>

                    html, body {
                      `+window.underpost.theme.font+`
                      color: `+window.underpost.theme.text+`;
                      background: `+window.underpost.theme.background+`;
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
                      font-size: 13px;
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




                    .b-yellow, .b-blue, .b-red {
                      transition: .3s;
                    }

                    .b-yellow:hover {
                      /* border: 2px solid yellow; */
                      color: yellow;
                    }
                    .b-blue:hover {
                      /* border: 2px solid blue; */
                      color: blue;
                    }
                    .b-red:hover {
                      /* border: 2px solid red; */
                      color: red;
                    }



              </style>



    `)
  }
}


export { Style };
