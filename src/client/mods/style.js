



class Style {
  constructor(){
    append('render', `


              <style>

                    body {
                      font-family: retro-font;
                    }

                    a {
                      color: white;
                      text-decoration: none;
                    }

                    .btn-underpost {

                      transition: .3s;
                      padding: 15px;
                      margin: 5px;
                      background: `+COLOR_THEME_B+`;
                      cursor: pointer;
                      font-size: 13px;
                      font-family: retro-font;

                    }
                    .btn-underpost:hover{
                      background: `+COLOR_THEME_B_HOVER+`;
                    }
              </style>



    `)
  }
}


export { Style };
