



class Style {
  constructor(){

    window.style_input = `

        padding: 12px 15px;
        font-family: retro-font;
        font-size: 14px;
        background: #1d1d1c;
        color: white;
        margin: 10px 10px 30px 10px;

    `;

    window.style_label = `

        color: red;
        font-size: 12px;
        left: 15px;

    `;

    window.style_placeholder = `

        font-style: italic;

    `;

    window.underpost_section_title = `

      background: rgba(212, 0, 0, 0.8);
      color: white;
      padding: 10px;

    `;

    window.botContent = '';

    window.backgroundNotifi = 'rgba(0, 0, 0, 0.9)';

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
                      background: rgba(212, 0, 0, 0.8);
                      cursor: pointer;
                      font-size: 13px;
                      font-family: retro-font;

                    }
                    .btn-underpost:hover{
                      background: rgba(212, 0, 0, 1);
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
