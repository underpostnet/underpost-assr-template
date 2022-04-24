

class UnderpostTitle {
  constructor(MainInput){

    const obj =
    window.underpost.paths.find(
      path => path.path == MainInput.path
    );

    this.render = `

          <div class='in' style='padding: 15px'>

                <div class='in' style='
              /*  border-left: 20px solid `+window.underpost.theme.text+`; */
                border-bottom: 20px solid `+window.underpost.theme.text+`;
              /*    border-radius: 45%; */
                color: `+window.underpost.theme.text+`;
                padding: 60px 10px 20px 10px;
                margin: 10px;
                '>

                      <span style='font-size: 50px'>`+obj.icon+`</span> `+obj.name+`

                </div>

          </div>


    `;
  }
}


export { UnderpostTitle };
