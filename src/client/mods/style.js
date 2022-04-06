



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
                      background: rgba(212, 0, 0, 0.8);
                      cursor: pointer;
                      font-size: 13px;
                      font-family: retro-font;

                    }
                    .btn-underpost:hover{
                      background: rgba(212, 0, 0, 1);
                    }
              </style>



    `)
  }
}


export { Style };
