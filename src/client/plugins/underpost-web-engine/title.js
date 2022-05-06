

class UnderpostTitle {
  constructor(MainInput){

    const obj =
    window.underpost.paths.find(
      path => path.path == MainInput.path
    );

    this.render = `

          <div class='in' style='padding: 15px'>

                      <span style='font-size: `+window.underpost.theme.fontSize._h1+`'>`+obj.icon+`</span>
                      <span style='font-size: `+window.underpost.theme.fontSize._h2+`'>
                        `+(MainInput.name ? MainInput.name : obj.name)+
                      `</span>



          </div>


    `;
  }
}


export { UnderpostTitle };
