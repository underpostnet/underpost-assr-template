
import { UnderpostQuillEditor } from '/mods/underpost-quill-editor.js';
import { UnderpostInteract } from '/mods/underpost-interact.js';
import { Rest } from '/mods/rest.js';

class Editor {

  constructor(){

    const sizeTitle = 15;
    const sizeContent = 15;
    const idContentEditable = 'ql-editor-main';
    let lastIDedit = null;
    let currentsPost = [];
    const contentDisplayEditor = 'display-editor';
    const idContentDashBoard = 'dashboard-post';

    const renderAllPost = () => {
      console.log('currentsPost ->');
      console.log(currentsPost);
      console.log('currentsPost Size ->');
      console.log(getSizeJSON(currentsPost));

      let orderPost = newInstance(currentsPost).map(dataPost => {
        dataPost.date = new Date(dataPost.date).getTime();
        return dataPost;
      });
      orderPost = orderArrayFromAttrInt(orderPost, "date", false);
      orderPost = orderPost.map(dataPost => {
        dataPost.date = new Date(dataPost.date).toISOString();
        return dataPost;
      });
      orderPost.map(dataPost =>
        append('.'+idContentDashBoard, renderCard(dataPost))
      );

    };

    append('render', `

            <div class='in `+contentDisplayEditor+`' style='display: none; padding: 5px;'>

            </div>
    `);

    append('.'+contentDisplayEditor, renderInput({
      underpostClass: 'in',
      id_content_input: 'a1',
      id_input: 'underpost-ql-title',
      type: 'text',
      required: true,
      style_content_input: '',
      style_input: window.underpost.styles.input.style_input,
      style_label: window.underpost.styles.input.style_label,
      style_outline: true,
      style_placeholder: '',
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
      placeholder: renderLang({en: 'Title', es: 'Titulo' })
    }));




      append('.'+contentDisplayEditor, `

          <style>

                .btn-cards {
                  transition: .3s;
                  `+window.underpost.theme.cursorPointer+`
                  font-size: 15px;
                  width: 50px;
                  height: 50px;
                  top: -10px;
                }

                .btn-cards:hover {
                      font-size: 17px;
                      color: `+window.underpost.theme.mark+`;
                }

          </style>

      `);

      const renderTooltipEditor =  (_id, content_, value_) => renderTooltipV1({
            idTooltip: _id,
            tooltipStyle: '',
            contentUnderpostClass: 'abs center',
            originContent:  content_,
            tooltipContent: `
              <div class='abs center' style='top: -18px; width: 100px;'>
                    <div class='inl' style='
                    font-size: 8px;
                    padding: 5px;
                    background: rgba(0, 0, 0, 0.82);
                    color: rgb(215, 215, 215);
                    border-radius: 3px;
                    '>
                        `+value_+`
                    </div>
              </div>
            `,
            transition: {
              active: false,
              time: '.3s'
            }
          });

      let lastNew = null;
      const renderCard = (obj_, state) => ( () => {

        setTimeout(()=>{

          append('.btn-edit-'+obj_.id, renderTooltipEditor(
            'tooltip-edit-'+obj_.id,
            '<i class="fas fa-edit abs center"></i>',
            renderLang({es: 'Editar', en: 'Edit'})
          ));

          append('.btn-delete-'+obj_.id, renderTooltipEditor(
            'tooltip-delete-'+obj_.id,
            '<i class="fas fa-trash abs center"></i>',
            renderLang({es: 'Eliminar', en: 'Delete'})
          ));


          s('.btn-edit-'+obj_.id).onclick = () =>
          {
            htmls('.'+idContentEditable, deBase64(obj_.B64HTMLeditble).replaceAll(
              'class="underpost-child-', 'reset="'
            ));
            // s('html').scrollTop = s('.underpost-ql-title').offsetTop;
            s('.underpost-ql-title').value = obj_.title;
            s('.card-'+obj_.id).style.display = 'none';
            s('.btn-new-post').click();
            lastIDedit = obj_.id;
            setTimeout( ()=> s('.underpost-ql-title').click(), 500);
          },
          s('.btn-delete-'+obj_.id).onclick = async () => {
            obj_.del = true;
            const response = await new Rest().FETCH('/posts', 'post', obj_);
            if(response.success === true){
              s('.card-'+obj_.id).remove();
              let indPost = 0;
              for(let post of currentsPost){
                  if(post.id==obj_.id){
                    currentsPost.splice(indPost, 1);
                    break
                  }
                  indPost++;
              }
              return   notifi.display(
                 window.underpost.styles.notifi.backgroundNotifi,
                 renderLang({es: 'Eliminado', en: 'Success delete'}),
                 2000,
                 'success'
               );
            }else{
              return   notifi.display(
                 window.underpost.styles.notifi.backgroundNotifi,
                 renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                 2000,
                 'error'
               );
            }
          }
        }, 0);


        if(state=='new'){
          if(lastNew!=null){
            if(s('.card-'+lastNew)){
              s('.card-'+lastNew).style.border = 'none';
            }
          }
          lastNew = obj_.id;
        }

        return `

        <div class='card-`+obj_.id+`' style=' margin: 5px; `+(state=='new'?'border: 3px solid '+window.underpost.theme.mark+';':'')+`'>

          <div class='in' style='color: `+window.underpost.theme.section_btn_color+`; background: `+window.underpost.theme.section_btn+`; min-height: 60px;'>

                <div class='fl'>

                    <div class='in fll' style='width: 85%;'>

                        <div class='in' style='font-size: 20px; padding: 5px;'>
                            `+obj_.title+`
                        </div>
                        <div class='in' style='font-size: 10px; padding: 5px; color: `+window.underpost.theme.mark+`;'>
                            `+renderLang({en: 'Last Update', es:'Actualizado hace'})+` <span class='time-since-`+obj_.id+`'>`+timeSince(new Date(obj_.date), s('html').lang, -1)+`</span>
                        </div>
                        <div class='in' style='font-size: 10px; padding: 5px; color: #c1c1c1;'>
                            `+obj_.date.split('.')[0].replace('T', ' ')+`
                        </div>

                    </div>

                    <div class='in fll' style='width: 15%; text-align: center;'>

                            <div class='inl btn-cards btn-cards-edit btn-edit-`+obj_.id+`'>

                            </div>

                            <div class='inl btn-cards btn-cards-delete btn-delete-`+obj_.id+`'>

                            </div>

                    </div>

                </div>

           </div>
        `+ deBase64(obj_.B64HTMLdisplay) + `
        </div>
        `;
      })();

      const toDashBoard = () =>{
        s('.'+contentDisplayEditor).style.display = 'none';
        s('.btn-send-underpost').style.display = 'none';
        s('.btn-cancel-send-underpost').style.display = 'none';
        fadeGlobal(true, '.btn-new-post', 250, 'inline-table', 'inline-table');
        fadeGlobal(true, '.'+idContentDashBoard, 250, 'block', 'block');
        if(lastIDedit!=null){
          s('.card-'+lastIDedit).style.display = 'block';
          s('.underpost-ql-title').value = '';
          htmls('.'+idContentEditable,'');
        }
      };

      this.editor = new UnderpostQuillEditor({
          divContent: '.'+contentDisplayEditor,
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
                background: white;
                color: black;
                overflow: hidden !important;
              `,
              standalone_container: `
                background: #c7c9c7;
                color: black;
              `,
              placeholder: `
                /* color: #0f0f0f; */
                content: attr(data-placeholder);
                font-style: normal;
              `
          },
          fontDefault: window.underpost.theme.font.split(':')[1].split(';')[0],
          fonts: ['gothic', 'retro-font', 'arial', 'Verdana', 'Times'],
          placeholder: renderLang({es: 'Componer una epopeya...', en: 'Compose an epic...' }),
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
                                window.underpost.styles.notifi.backgroundNotifi,
                                renderLang({en: 'Empty content', es: 'Sin Contenido'}),
                                2000,
                                'error'
                              );
                           }

                           if(title==''){
                             return   notifi.display(
                                window.underpost.styles.notifi.backgroundNotifi,
                                renderLang({en: 'Empty title', es: 'Sin Titulo'}),
                                2000,
                                'error'
                              );
                           }

                           // displayValue = displayValue.replace('contenteditable="true"', 'style="background: none"');
                           displayValue = displayValue.replace('contenteditable="true"', '');
                           displayValue = displayValue.replaceAll('transform: translate', 'none: ');
                           displayValue = displayValue.replace('ql-editor-main', '');

                           const date = new Date((new Date().getTime()-offTime())).toISOString();

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
                           // navigator.onLine ?
                           if(response.success===true){
                             dataPost.id = response.data.id;
                             if(lastIDedit!=null){
                               let indPost = 0;
                               for(let post of currentsPost){
                                 if(post.id==lastIDedit){
                                   currentsPost[indPost] = dataPost;
                                   s('.card-'+post.id).remove();
                                   break;
                                 }
                                 indPost++;
                               }
                               lastIDedit = null;
                             }else {
                               currentsPost.push(response.data);
                             }
                            toDashBoard();
                            prepend('.'+idContentDashBoard, renderCard(dataPost, 'new'));
                             this.editor.reset();
                             return notifi.display(
                                window.underpost.styles.notifi.backgroundNotifi,
                                renderLang({en: 'Success', es: 'Enviado'}),
                                2000,
                                'success'
                              );
                           }

                           return notifi.display(
                              window.underpost.styles.notifi.backgroundNotifi,
                              renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                              2000,
                              'error'
                            );
          }
      });

      append('render', `



          <div class='inl btn-underpost btn-new-post'>

                `+renderLang({en: 'NEW POST', es: 'NUEVO POST'})+` <i class="fas fa-comment-alt"></i>

          </div>

          <div class='inl btn-underpost btn-cancel-send-underpost' style='display: none;'>

                <i class="fas fa-times"></i>

          </div>

          <div class='inl btn-underpost btn-send-underpost' style='display: none;'>

                `+renderLang({en: 'SEND', es: 'ENVIAR'})+`

          </div>

          <div class='in `+idContentDashBoard+`'>

          </div>

      `);

      s('.btn-cancel-send-underpost').onclick = () => toDashBoard();

      s('.btn-new-post').onclick = () => {
        const fadeInTime = 250;
        fadeGlobal(true, '.'+contentDisplayEditor, fadeInTime, 'block', 'block');
        fadeGlobal(true, '.btn-send-underpost', fadeInTime, 'inline-table', 'inline-table');
        fadeGlobal(true, '.btn-cancel-send-underpost', fadeInTime, 'inline-table', 'inline-table');
        s('.'+idContentDashBoard).style.display = 'none';
        s('.btn-new-post').style.display = 'none';
      };

      (async () => {

          const responsePosts = await new Rest().FETCH('/posts/'+getRawQuery(), 'get');
          currentsPost = responsePosts.data;
          renderAllPost();

          const renderTimeSinces = () => currentsPost.map( post =>
            htmls('.time-since-'+post.id, timeSince(new Date(post.date), s('html').lang, -1))
          );
          const intervalUpdateTimeSince = 5000;

          renderTimeSinces();
          setInterval(() => renderTimeSinces(), intervalUpdateTimeSince);

          s('a.ql-action').href = '#';
          s('a.ql-remove').href = '#';



      })();

  }
}

export { Editor };
