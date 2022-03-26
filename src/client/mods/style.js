



class Style {
  constructor(){
    append('body', `


              <style>

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
