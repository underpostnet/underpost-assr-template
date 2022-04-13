



class Style {
  constructor(){


    const THEMES = [
      {
        "name": "underpost",
        "background": "black",
        "text": "white",
        "mark": "yellow",
        "btn": "red",
        "link": "orange",
        "font": "retro-font",
        "cursorDefault": ".underpost-pointer",
        "cursorPointer": ".underpost-default"
      },
      {
        "name": "normal",
        "background": "white",
        "text": "black",
        "mark": "blue",
        "btn": "green",
        "link": "magenta",
        "font": null,
        "cursorDefault": null,
        "cursorPointer": null
      }
    ];

    /*

    localStorage.getItem(sortable.options.group.name);
    localStorage.setItem(sortable.options.group.name, order.join('|'));


    */
    const currentTheme = THEMES.find( x => x["name"] == localStorage.getItem("theme") );
    window.underpost.theme = currentTheme ? currentTheme : THEMES[1];

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

        padding: 12px 15px;
        font-size: 14px;
        background: #1d1d1c;
        margin: 10px 10px 30px 10px;

    `;

    window.style_label = `

        font-size: 12px;
        left: 15px;
        color: `+window.underpost.theme.btn+`;

    `;

    window.style_placeholder = `

        font-style: italic;

    `;

    window.underpost_section_title = `

      background: rgba(212, 0, 0, 0.8);
      padding: 10px;

    `;

    window.botContent = '';

    window.backgroundNotifi = 'rgba(0, 0, 0, 0.9)';

    append('render', `


              <style>

                    body {
                      `+(window.underpost.theme.font!=null?
                        `font-family: `+window.underpost.theme.font+`;`:'')+`
                      color: `+window.underpost.theme.text+`;
                      background: `+window.underpost.theme.background+`
                    }

                    a {
                      text-decoration: none;
                      color: `+window.underpost.theme.link+`;
                    }

                    a:hover { text-decoration: underline; }

                    .btn-underpost {
                      transition: .3s;
                      padding: 15px;
                      margin: 5px;
                      background: `+window.underpost.theme.btn+`;
                      opacity: 0.8;
                      font-size: 13px;
                    }

                    .btn-underpost:hover{
                      opacity: 1;
                    }


                    ::placeholder {
                      color: `+window.underpost.theme.btn+`;
                      opacity: 1; /* Firefox */
                      background: none;
                    }

                    :-ms-input-placeholder { /* Internet Explorer 10-11 */
                     color: `+window.underpost.theme.btn+`;
                     background: none;
                    }

                    ::-ms-input-placeholder { /* Microsoft Edge */
                     color: `+window.underpost.theme.btn+`;
                     background: none;
                    }


                    ::-moz-selection { /* Code for Firefox */
                      color: `+window.underpost.theme.link+`;
                      background: `+window.underpost.theme.btn+`;
                    }
                    ::selection {
                      color: black;
                      background: `+window.underpost.theme.btn+`;
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
