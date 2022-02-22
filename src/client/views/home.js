import { Test } from '../mods/test.js';
import { Base } from '../mods/base.js';
import { Table } from '../mods/table.js';

class Home {


  constructor(){

    new Base();


    const style_global_iframe = `
    transition: .3s;
    height: 200px;
    border: none;
    `;

        append('body', `

              <br>
              <br>

                <div class='in' style='text-align: center;'>
                    UNDERpost.net - Quill Editor
                </div>

              <br><br>

              <div class='fl'>

                    <div class='in fll' style='width: 30%'>
                          Mobile
                    </div>

                    <div class='in fll' style='width: 70%'>
                          Desktop
                    </div>

              </div>

              <div class='fl'>

                    <iframe class='in fll mobile-editor' style='
                    width: 30%;
                    `+style_global_iframe+`'


                    src='/quill-editor'>
                    </iframe>

                    <iframe class='in fll dekstop-editor' style='
                    width: 70%;
                    `+style_global_iframe+`'


                    src='/quill-editor'>
                    </iframe>

              </div>

        `);

        setTimeout( () => {



            this.renderInterval = responsiveRender(500, (w, h) => {

              console.log(w);
              console.log(h);

              s('.mobile-editor').style.height =
              siframe('.mobile-editor', 'body').clientHeight+'px';
              s('.dekstop-editor').style.height =
              siframe('.dekstop-editor', 'body').clientHeight+'px';

            });



        }, 2000);



  }

}

new Home();
