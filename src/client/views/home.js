

import { Test } from '../mods/test.js';
import { UnderpostQuillEditor } from '../mods/underpost-quill-editor.js';
import { UnderpostInteract } from '../mods/underpost-interact.js';


class Home {

  constructor(){

    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------



    append('body', `

        <style>

            body {
              font-family: retro-font;
            }

        </style>
        <form class='inl card-login-content' style='

            margin: 10px;
            border: 3px solid yellow;
            border-radius: 5px;
            width: 320px;
            height: auto;
            padding: 10px;

        '>

        <br>

        <span style='font-size: 30px;'>LogIn</span>

        <img src='/img/underpost-social.jpg'>

        <br>
        <br>

        </form>
    `);

    const mainCardLoginContent =
    '.card-login-content';

    append(mainCardLoginContent, renderInput({
      underpostClass: 'inl',
      id_content_input: 'a1',
      id_input: 'a2',
      type: 'text',
      required: true,
      style_content_input: 'width: 250px; margin: 10px;',
      style_input: 'padding: 8px;',
      style_label: 'color: red; font-size: 10px;',
      style_outline: true,
      style_placeholder: '',
      textarea: false,
      active_label: true,
      initLabelPos: 3,
      endLabelPos: -19,
      text_label: 'Base64 Sign Key',
      tag_label: 'a3',
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent: '',
      placeholder: ''
    }));

    append(mainCardLoginContent, `
          <br>
                `+spr(' ', 1)+`
                      <div class='inl login-paste'>
                           <i style='font-size: 14px;' class="fas fa-paste"></i>
                      </div>

                      <div class='inl login-send'>
                             SEND <i style='font-size: 14px;' class="fas fa-sign-in-alt"></i>
                      </div>


                  <br>
                  <br>
                  <style>
                  .login-send, .login-paste {
                    border: 4px solid red;
                    padding: 7px;
                    margin: 5px;
                    cursor: pointer;
                    font-size: 10px;
                    transition: .3s;
                    border-radius: 5px;
                  }
                  .login-send:hover, .login-paste:hover {
                    border: 4px solid yellow;
                  }
                  </style>

      `);

      const logIn = () => console.log('send ->'+s('.a2').value);

      s('.login-send').onclick = () => logIn();
      s(mainCardLoginContent).onsubmit =
      () => false;

      s('.login-paste').onclick = async () =>
      s('.a2').value = await getPasteContent();

      s('body').onkeydown = () => {
        switch (window.event.keyCode) {
          case 13:
              logIn();
            break;
          default:
              console.log('no action key -> '+window.event.keyCode);
        }
    };


    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------

    append('body', `
        <div class='in editor-content'>
            test
        </div>
    `);

    new Test({
      divContent: 'body'
    });


    new UnderpostQuillEditor({
        divContent: '.editor-content',
        style:  {
            tr: `{
              background: #cfcfcf;
            }`,
            td: `{
              min-width: 100px;
              border: 1px solid black;
            }`,
            ql_editor: `{
              min-height: 600px;
              border: 2px solid red;
              background: #ebeceb;
              overflow: hidden !important;
              font-size: 20px;
            }`,
            standalone_container: `{
              background: #c7c9c7;
              color: black;
              border: 2px solid yellow;
              max-width: 600px;
            }`,
        },
        fonts: ['gothic', 'retro-font'],
        text_sizes: range(1, 80).filter(size_=>size_%5==0).map(size_=>size_+'px'),
        scientific_tools: true,
        image: true,
        video: true,
        table: true
    });


    new UnderpostInteract( {
      type: 'quill'
    });

  }

}

new Home();
