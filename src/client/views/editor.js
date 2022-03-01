import { Rest } from '/mods/rest.js';
import { UnderpostQuillEditor } from '/mods/underpost-quill-editor.js';
import { UnderpostInteract } from '/mods/underpost-interact.js';
import { Base } from '../mods/base.js';


class Editor {
  constructor(){

    new Base();

    const sizeTitle = 15;
    const sizeContent = 15;
    const idContentEditable = 'ql-editor-main';
    const backgroundNotifi = 'rgba(0, 0, 0, 0.9)';
    let lastIDedit = null;

    append('body', renderInput({
      underpostClass: 'in',
      id_content_input: 'a1',
      id_input: 'underpost-ql-title',
      type: 'text',
      required: true,
      style_content_input: '',
      style_input: `

          padding: 12px 15px;
          font-family: retro-font;
          font-size: `+sizeTitle+`px;
          background: black;
          color: white;

      `,
      style_label: 'color: red; font-size: 12px;',
      style_outline: true,
      style_placeholder: 'font-style: italic;',
      textarea: false,
      active_label: false,
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
      placeholder: 'Title'
    }));




      append('body', `

          <style>

                .btn-cards {
                  background: black;
                  color: white;
                  transition: .3s;
                  cursor: pointer;
                  font-size: 15px;
                  width: 50px;
                  height: 50px;
                  top: -10px;
                }

                .btn-cards-delete:hover {
                  font-size: 17px;
                  color: red;
                }

                .btn-cards-edit:hover {
                  font-size: 17px;
                  color: yellow;
                }

          </style>

      `);


      const renderCard = obj_ => ( () => {

        setTimeout(()=>{
          s('.btn-edit-'+obj_.id).onclick = () =>
          {
            htmls('.'+idContentEditable, deBase64(obj_.B64HTMLeditble).replaceAll(
              'class="underpost-child-', 'reset="'
            ));
            s('html').scrollTop = s('body').offsetTop;
            s('.underpost-ql-title').value = obj_.title;
            s('.card-'+obj_.id).remove();
            lastIDedit = obj_.id;
          },
          s('.btn-delete-'+obj_.id).onclick = () =>
          alert('del')
        }, 0);

        return `

        <div class='card-`+obj_.id+`'>

          <div class='in' style='color: white; background: rgb(198, 0, 0); min-height: 60px;'>

                <div class='fl'>

                    <div class='in fll' style='width: 85%;'>

                        <div class='in' style='font-size: 20px; padding: 5px;'>
                            `+obj_.title+`
                        </div>
                        <div class='in' style='font-size: 10px; padding: 5px;'>
                            `+obj_.date.split('.')[0].replace('T', ' ')+`
                        </div>

                    </div>

                    <div class='in fll' style='width: 15%; text-align: center;'>

                            <div class='inl btn-cards btn-cards-edit btn-edit-`+obj_.id+`'>
                                  <i class="fas fa-edit abs center"></i>
                            </div>

                            <div class='inl btn-cards btn-cards-delete btn-delete-`+obj_.id+`'>
                                  <i class="fas fa-trash abs center"></i>
                            </div>

                    </div>

                </div>

           </div>
        `+ deBase64(obj_.B64HTMLdisplay) + `
        </div>
        `;
      })();
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
                /* background: #ebeceb; */
                background: black;
                color: white;
                overflow: hidden !important;
              `,
              standalone_container: `
                background: #c7c9c7;
                color: black;
              `,
              placeholder: `
                color: red;
                content: attr(data-placeholder);
                font-style: normal;
                left: 15px;
                pointer-events: none;
                position: absolute;
                right: 15px;
                font-style: italic;
              `
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
          idContentEditable,
          interactQuill: new UnderpostInteract( {
            type: 'quill',
            idContentEditable
          }),
          onSubmit: async (displayValue, editableValue, quillLength) => {

                        const title = s('.underpost-ql-title').value;

                           if(quillLength<=1){
                             return   notifi.display(
                                backgroundNotifi,
                                'Empty content',
                                2000,
                                'error'
                              );
                           }

                           if(title==''){
                             return   notifi.display(
                                backgroundNotifi,
                                'Empty title',
                                2000,
                                'error'
                              );
                           }

                           displayValue = displayValue.replace('contenteditable="true"', 'style="background: none"');
                           displayValue = displayValue.replaceAll('transform: translate', 'none: ');
                           displayValue = displayValue.replace('ql-editor-main', '');

                           const date = new Date().toISOString();

                           let dataPost  = {
                             title,
                             date,
                             B64HTMLdisplay: enBase64(displayValue),
                             B64HTMLeditble: enBase64(editableValue)
                           };

                           if(lastIDedit!=null){
                             dataPost.id = lastIDedit;
                           }

                           const response = await new Rest().FETCH('/posts', 'post', dataPost);

                           console.log('POST /posts ->');
                           console.log(response);

                           if(response.success===true){
                             dataPost.id = response.data.id;
                             prepend('.'+idContentDashBoard, renderCard(dataPost));
                             this.editor.reset();
                             lastIDedit = null;
                             return notifi.display(
                                backgroundNotifi,
                                'Success',
                                2000,
                                'success'
                              );
                           }

                           return notifi.display(
                              backgroundNotifi,
                              'Error service',
                              2000,
                              'error'
                            );
          }
      });




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


      let currentsPost = [];

      const renderAllPost = () => {
        console.log('currentsPost ->');
        console.log(currentsPost);
        console.log('currentsPost Size ->');
        console.log(getSizeJSON(currentsPost));
        currentsPost.data.reverse().map(dataPost =>
          append('.'+idContentDashBoard, renderCard(dataPost))
        );
      };

      (async () => {

          currentsPost = await new Rest().FETCH('/posts/'+getRawQuery(), 'get');
          renderAllPost();

      })();

  }
}

new Editor();
