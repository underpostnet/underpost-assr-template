import { Test } from '../mods/test.js';
import { UnderpostQuillEditor } from '../mods/underpost-quill-editor.js';
import { UnderpostInteract } from '../mods/underpost-interact.js';
import { Base } from '../mods/base.js';
import { Table } from '../mods/table.js';
import { Rest } from '../mods/rest.js';


class Home {


  constructor(){

    new Base();


        append('body', `

              <br><br>

        `);

        const sizeTitle = 20;
        const sizeContent = 15;

        append('body', renderInput({
          underpostClass: 'in',
          id_content_input: 'a1',
          id_input: 'underpost-ql-title',
          type: 'text',
          required: true,
          style_content_input: '',
          style_input: 'padding: 8px; font-family: retro-font; font-size: '+sizeTitle+'px;',
          style_label: 'color: red; font-size: 12px;',
          style_outline: true,
          style_placeholder: '',
          textarea: false,
          active_label: true,
          initLabelPos: 3,
          endLabelPos: -25,
          text_label: 'Title',
          tag_label: 'a3',
          fnOnClick: async () => {
            console.log('click input');
          },
          value: ``,
          topContent: '',
          botContent: '',
          placeholder: ''
        }));




    const renderTitle = obj_ => `

         <div class='in' style='color: white; background: red; font-size: 24px; padding: 15px;'>
             `+obj_.title+`
         </div>
         <div class='in' style='color: white; background: red; font-size: 18px; padding: 15px;'>
             `+obj_.date+`
         </div>

    `;
    this.editor = new UnderpostQuillEditor({
        divContent: 'body',
        style:  {
            tr: `
              background: none;
            `,
            td: `
              min-width: 100px;
              border: 1px solid gray;
            `,
            ql_editor: `
              min-height: 300px;
              background: #ebeceb;
              overflow: hidden !important;
            `,
            standalone_container: `
              background: #c7c9c7;
              color: black;
            `,
        },
        fontDefault: 'retro-font',
        fonts: ['gothic', 'retro-font', 'arial', 'Verdana', 'Times'],
        placeholder: 'Compose an epic...',
        initContent: '',
        sizeDefault: sizeContent,
        text_sizes: range(1, 80).filter(size_=>size_%5==0).map(size_=>size_+'px'),
        scientific_tools: true,
        image: true,
        video: true,
        table: true,
        idBtnSend: '.btn-send-underpost',
        interactQuill: new UnderpostInteract( {
          type: 'quill'
        }),
        onSubmit: async (value, quillLength) => {

                      const title = s('.underpost-ql-title').value;

                         if(quillLength<=1){
                           return   notifi.display(
                              'rgb(22, 22, 22)',
                              'Empty content',
                              2000,
                              'error'
                            );
                         }

                         if(title==''){
                           return   notifi.display(
                              'rgb(22, 22, 22)',
                              'Empty title',
                              2000,
                              'error'
                            );
                         }

                         value = value.replace('contenteditable="true"', 'style="background: none"');
                         value = value.replaceAll('transform: translate', 'none: ');
                         value = value.replace('ql-editor-main', '');

                         const date = new Date().toISOString();

                         prepend('.'+idContentDashBoard, renderTitle({title, date}) + value);

                         const dataPost  = {
                           title,
                           date,
                           base64Html: enBase64(value),
                           id: getHash().replaceAll('-', '')
                         };

                         const response = await new Rest().FETCH('/posts', 'post', dataPost);

                         console.log('POST /posts ->');
                         console.log(response);

                         if(response.success===true){
                           this.editor.reset();
                           return notifi.display(
                              'rgb(22, 22, 22)',
                              'Success',
                              2000,
                              'success'
                            );
                         }

                         return notifi.display(
                            'rgb(22, 22, 22)',
                            'Error service',
                            2000,
                            'error'
                          );
        }
    });

    s('.ql-editor').classList.add('ql-editor-main');


    const idContentDashBoard = 'dashboard-post';


    append('body', `



        <style>

              .btn-send-underpost {

                transition: .3s;
                padding: 15px;
                margin: 5px;
                background: rgba(212, 0, 0, 0.8);
                cursor: pointer;
                font-size: 13px;
                font-family: retro-font;

              }
              .btn-send-underpost:hover {
                background: rgba(212, 0, 0, 1);
              }
        </style>

        <div class='inl btn-send-underpost'>

              SEND

        </div>

        <div class='in `+idContentDashBoard+`'>

        </div>



    `);


  (async ()=>{

    const currentsPost = await new Rest().FETCH('/posts', 'get');
    console.log('currentsPost ->');
    console.log(currentsPost);
    console.log('currentsPost Size ->');
    console.log(getSizeJSON(currentsPost));

    currentsPost.data.reverse().map(dataPost =>
      append('.'+idContentDashBoard, renderTitle(dataPost)+deBase64(dataPost.base64Html))
    );

  })();


  }

}

new Home();
