
import { Rest } from '../deps/rest.js';
import { Menu } from '../deps/menu.js';
import { UnderpostTitle } from '../deps/title.js';

import '/lib/jszip.min.js';

class KeysTable {

  constructor(obj){

    this.idSortableContentTable = 'sortable-table-keys';
    this.id_cell  = 'table-cell-keys';
    this.mainWidthTable = '98%';
    const topSpace = spr('<br>', 4);
    const _RENDER = obj && obj.MainRender ? obj.MainRender : 'render';
    append(_RENDER, `

      <form class='in form-keys' style='display: none; margin: 5px'>

              `+new UnderpostTitle({path: '/keys', name: renderLang({
                es: 'Crear Llaves',
                en: 'New Keys'
              })}).render+`

            <in-key-options class='in'>

                  <div class='in' style='`+window.underpost.styles.section.underpost_section_title+`'>
                      `+renderLang({
                        en: 'Select Type Key',
                        es: 'Seleccione tipo de llave'
                      })+`
                  </div>
                  <br>


            </in-key-options>

            <br>

            `+renderInput({
              underpostClass: 'in',
              id_content_input: makeid(3),
              id_input: 'key-pass',
              type: 'password',
              required: true,
              style_content_input: '',
              style_input: window.underpost.styles.input.style_input,
              style_label: window.underpost.styles.input.style_label,
              style_outline: true,
              style_placeholder: window.underpost.styles.input.style_placeholder,
              textarea: false,
              active_label: true,
              initLabelPos: 5,
              endLabelPos: -20,
              text_label: renderLang({en: 'Password', es: 'Contraseña'}),
              tag_label: makeid(3),
              fnOnClick: async () => {
                console.log('click input');
              },
              value: ``,
              topContent: '',
              botContent: '',
              placeholder: ''
            })+`

          <div class='inl btn-underpost cancel-key'>

                <i class="fas fa-times"></i>

          </div>

          <div class='inl btn-underpost create-key-btn'>
              `+renderLang({
                es: 'CREAR',
                en: 'CREATE'
              })+`
              <i class='fas fa-key'></i>
          </div>

      </form>


      <form class='in form-sign-keys' style='display: none; margin: 5px'>

            `+new UnderpostTitle({path: '/keys', name: renderLang({
              es: 'Firmar Data  <span class="current-id-key-sign" style="color: '+window.underpost.theme.mark+'"></span>',
              en: 'Sigin Data  <span class="current-id-key-sign" style="color: '+window.underpost.theme.mark+'"></span>'
            })}).render+`

            `+renderInput({
              underpostClass: 'in',
              id_content_input: makeid(3),
              id_input: 'input-data-sign',
              type: 'text',
              required: true,
              style_content_input: '',
              style_input: window.underpost.styles.input.style_input,
              style_label: window.underpost.styles.input.style_label,
              style_outline: true,
              style_placeholder: window.underpost.styles.input.style_placeholder,
              textarea: true,
              active_label: true,
              initLabelPos: 5,
              endLabelPos: -20,
              text_label: '',
              tag_label: makeid(3),
              fnOnClick: async () => {
                console.log('click input');
              },
              value: ``,
              topContent: '',
              botContent: '',
              placeholder: renderLang({
                es: 'Ingrese Data',
                en: 'Enter Data'
              })
            })+`

            <br>

            `+renderInput({
              underpostClass: 'in',
              id_content_input: makeid(3),
              id_input: 'key-pass-sign',
              type: 'password',
              required: true,
              style_content_input: '',
              style_input: window.underpost.styles.input.style_input,
              style_label: window.underpost.styles.input.style_label,
              style_outline: true,
              style_placeholder: window.underpost.styles.input.style_placeholder,
              textarea: false,
              active_label: false,
              initLabelPos: 5,
              endLabelPos: -20,
              text_label: renderLang({en: 'Password', es: 'Contraseña'}),
              tag_label: makeid(3),
              fnOnClick: async () => {
                console.log('click input');
              },
              value: ``,
              topContent: '',
              botContent: '',
              placeholder: renderLang({en: 'Password', es: 'Contraseña'})
            })+`

            <br>

            <div class='inl btn-underpost btn-sign-cancel'>
                <i class='fas fa-times'></i>
            </div>

            <div class='inl btn-underpost btn-sign-key'>
                `+renderLang({
                  es: 'Firmar',
                  en: 'Sigin'
                })+`
            </div>

            <div class='inl btn-underpost btn-sign-paste'>
                <i class='fas fa-paste'></i>
            </div>

      </form>

      <div class='in result-sign-content' style='display: none'>

                  `+new UnderpostTitle({path: '/keys', name: renderLang({
                    es: 'Resultado de Firma',
                    en: 'Sigin Result'
                  })}).render+`

                  <pre
                    style='border: 2px solid black; padding: 5px'
                    class='in result-sign' >

                  </pre>
                  <br>
                  <div class='inl btn-underpost btn-sign-cancel-result'>
                      <i class='fas fa-times'></i>
                  </div>
                  <div class='inl btn-underpost btn-sign-copy-result'>
                      <i class='fas fa-copy'></i>
                  </div>

      </div>


      <style>

          .plugin-icon-content-table {
            text-align: center;
            width: 25%;
            `+window.underpost.theme.cursorPointer+`
            transition: .3s;
          }

          .plugin-icon-content-table:hover {
            color: `+window.underpost.theme.mark+`;
          }

          .col-header-table {
              padding-left: 2.5%;
              padding-right: 2.5%;
              padding-bottom: 10px;
              padding-top: 10px;
              width: 20%;
              text-align: center;
              border-bottom: 3px solid `+window.underpost.theme.section_btn+`;
          }

          .icon-table-keys {
            position: relative;
          }

      </style>

      <view-key style='display: none'>

            `+new UnderpostTitle({path: '/keys', name: renderLang({
              es: 'Ver Llaves',
              en: 'View Keys'
            })}).render+`

            <div class='in content-btns-raw-data'>
                    <div class='in fll btn-underpost icon-table-keys cancel-view-key'>

                          <i class="fas fa-times"></i>

                    </div>

                    <div class='in fll btn-underpost icon-table-keys copy-view-key'>

                          <i class="fas fa-copy"></i>

                    </div>
            </div>

            `+topSpace+`

            <pre class='key-raw-data'>

            </pre>

      </view-key>

      <table-keys class='in' style='min-height: 300px'>

            `+new UnderpostTitle({
              path: '/keys'
            }).render+`

            <div class='inl btn-underpost create-form-open'>
                `+renderLang({
                  es: 'Crear Llave',
                  en: 'Create Key'
                })+`
                <i class='fas fa-plus'></i>
            </div>

            <table-keys-header class='in' style='width: `+this.mainWidthTable+`; margin: auto'> </table-keys-header>

            <`+this.idSortableContentTable+`></`+this.idSortableContentTable+`>
      </table-keys>

    `);

    s('.btn-sign-paste').onclick = async () =>
    s('.input-data-sign').value = await getPasteContent();

    let checksBox = [
      {
        id: 'asymmetric-input',
        state: false,
        text: '<span>'+renderLang({es: 'asimetrica', en: 'asymmetric'})+'</span>'
      },
      {
        id: 'symmetric-input',
        state: false,
        text: '<span>'+renderLang({es: 'simetrica', en: 'symmetric'})+'</span>'
      }
    ];

    checksBox.map( (v,i,a) => {
      append('in-key-options', renderChecbox({
        ...v,
        extraClassContent: '',
        click: stateEvent => {
            console.log(v.id, stateEvent);
            checksBox[i].state = stateEvent;
            if(stateEvent === true && v.id=='asymmetric-input'){
              fadeIn(s('.asymmetric-info'));
            }
            if(stateEvent === false && v.id=='asymmetric-input'){
              fadeOut(s('.asymmetric-info'));
            }
            if(stateEvent === true && v.id=='symmetric-input'){
              fadeIn(s('.symmetric-info'));
            }
            if(stateEvent === false && v.id=='symmetric-input'){
              fadeOut(s('.symmetric-info'));
            }
            /*
            or exclusive
            if(stateEvent===true){
              checksBox.map( (v_,i_,a_) => {
                if(i_!=i && v_.state===true){
                    s('.'+checksBox[i_].id).click();
                }
              });
            }
            */
        },
        style: {
          content: `
            margin-bottom: 10px;
            color: `+window.underpost.theme.section_btn_color+`;
          `,
          widthText: 140,
          background: window.underpost.theme.section_btn,
          border: '3px solid '+window.underpost.theme.section_btn,
          width: 41,
          height: 41,
          radio: undefined,
          hover: `
            border: 3px solid `+window.underpost.theme.mark+`;
            `+window.underpost.theme.cursorPointer+`
          `,
          icon: `
            <i class='fas fa-check'>
            </i>
          `
        }
      }));
    });

    append('in-key-options', `
        <div class='in asymmetric-info' style='display: none'>
                Asymmetric Config:
                <pre>
                `+jsonSave({
                        modulusLength: 4096,
                        namedCurve: 'secp256k1',
                        publicKeyEncoding: {
                            type: 'spki',
                            format: 'pem'
                        },
                        privateKeyEncoding: {
                            type: 'pkcs8',
                            format: 'pem',
                            cipher: 'aes-256-cbc'
                        }
                })+`
                </pre>
        </div>

        <div class='in symmetric-info' style='display: none'>
            Symmetric Config:
            <pre>
            `+jsonSave({
                    algorithm: "aes-256-ctr",
                    hasher: "SHA1",
                    saltRandomArgument: (64/8),
                    keySize: (256/64) + (128/64),
                    ivSize: (128/64) * 4
            })+`
            </pre>
        </div>
    `);

    s('.create-form-open').onclick = () => {
      s('.create-form-open').style.display = 'none';
      s('table-keys').style.display = 'none';
      fadeIn(s('.form-keys'));
    };
    s('.cancel-key').onclick = () => {
      s('.form-keys').style.display = 'none';
      fadeIn(s('.create-form-open'));
      fadeIn(s('table-keys'));
      s('.create-form-open').style.display = 'inline-table';
    };
    s('.create-key-btn').onclick = async () => {

        if(
          checksBox[0].state == false
          &&
          checksBox[1].state == false){
            return   notifi.display(
               window.underpost.styles.notifi.backgroundNotifi,
               renderLang({en: 'Select Key Type', es: 'Seleccione tipo de llave'}),
               2000,
               'error'
             );
        }

        if(s('.key-pass').value==''){
            return   notifi.display(
               window.underpost.styles.notifi.backgroundNotifi,
               renderLang({en: 'Empty Password', es: 'Contraseña vacia'}),
               2000,
               'error'
             );
        }

        let bodyPost = {
          asymmetric: checksBox[0].state,
          symmetric: checksBox[1].state,
          keyPass: s('.key-pass').value
        };
        console.warn('create-key-btn', bodyPost);

        const response = await new Rest().FETCH('/network/keys', 'POST', bodyPost);
        console.log(response);
        if(response.success === true){
           // volver a ordenar por tiempo
           localStorage.removeItem('group-table-keys');
           await this.renderTableKeys({
             mark: [
               response.asymmetric,
               response.symmetric
             ]
           });
           checksBox.map( (v_,i_,a_) => {
             if(v_.state===true){
                 s('.'+checksBox[i_].id).click();
             }
           });
           s('.key-pass').value = '';
           s('.cancel-key').click();
           return   notifi.display(
              window.underpost.styles.notifi.backgroundNotifi,
              renderLang({es: 'Llaves creadas', en: 'Success create keys'}),
              2000,
              'success'
            );
        }else{
          return  notifi.display(
             window.underpost.styles.notifi.backgroundNotifi,
             renderLang({es: 'Error en el Servicio', en: 'Error service'}),
             2000,
             'error'
           );
        }

    };


          (async () => {
              await this.renderTableKeys();

          })();

  }

  renderTooltipTableKey(_id, content_, value_){
    return renderTooltipV1({
      idTooltip: _id,
      tooltipStyle: '',
      contentUnderpostClass: 'abs center',
      originContent:  content_,
      tooltipContent: `
        <div class='abs center' style='top: 0px; width: 100px;'>
              <div class='inl' style='
              padding: 2px;
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
  }

  async renderTableKeys(inObj){

         inObj == undefined ? inObj = {} : null;

         const fontFamily = window.underpost.theme.font;
         const obj = {
           divContent: 'table-keys',
           data: await new Rest().FETCH('/network/keys', 'GET')
         };
         const mainIdGrid = 'grids-table-keys';

         // htmls(obj.divContent, );

         htmls(this.idSortableContentTable, '');
         new Menu({
               row: l(obj.data),
               col: 1,
               renderDiv: this.idSortableContentTable,
               idContentGridResponsive: 'interval-keys-table',
               intervalCellGrid: 'interval-keys-cell',
               styleMainContent: '',
               mainIdGrid,
               clickRowOpenModal: false,
               factorCell: 1,
               cellStyle:   `
                   width: `+this.mainWidthTable+`;
                   height: auto;
                   border: 3px solid `+window.underpost.theme.background+`;
                   transition: .3s;
                   text-align: left;
                   margin: auto;
               `,
               hoverCellStyle: `
                   width: 99%;
                   height: 99%;
                   border: 3px solid `+window.underpost.theme.mark+`;
                   `+window.underpost.theme.cursorPointer+`
                  /* color: `+window.underpost.theme.mark+`;  */
               `,
               mainContentWidth: 'auto',
               classSubContentCell: 'in',
               setHeight: 'auto',
               initDisplay: 'block',
               styleContentGrid: `
                 z-index: `+window.underpost.styles.zIndex.contentLanding+`;
               `,
               underpostClassSubGrid: 'in',
               underpostClass: 'in',
               click: dataInput => {
                 console.log(dataInput);
               },
               id_cell: this.id_cell,
               sortableGroup: 'group-table-keys',
               // default content cell is replaced for orderPost.map
               APPS: obj.data
             });


         renderTableV1( obj.data, {
           onRenderStyle: renderStyle =>
           append(this.idSortableContentTable, renderStyle),
           onHeaderRender: renderHeader => {
             htmls('table-keys-header', `
                <div class='fl'>
                        <div class='in fll col-header-table'>
                          `+renderLang({en: 'Id', es: 'Id'})+`
                        </div>
                        <div class='in fll col-header-table'>
                          `+renderLang({en: 'Date', es: 'Fecha'})+`
                        </div>
                        <div class='in fll col-header-table'>
                          `+renderLang({en: 'Type', es: 'Tipo'})+`
                        </div>
                        <div class='in fll col-header-table'>
                          `+spr('<br>', 1)+`
                        </div>
                </div>
             `);
           },
           // htmls('table-keys-header', renderHeader),
           onRenderDataRow: (renderRow, dataRow, indexRow, rowClickId) => {
             console.log('onRenderDataRow', dataRow, rowClickId);
             const selectorCell = '.'+this.id_cell+'-'+indexRow;
             htmls(selectorCell, renderRow);
             s(rowClickId).onclick = () => s('.view-'+indexRow).click();
           },
           idMark: inObj.mark,
           id_table: 'underpost-table-keys',
           style: {
             header_row_style: `
             padding-bottom: 10px;
             padding-top: 10px;
             `+'font-family: '+fontFamily+'; border-bottom: 3px solid '+window.underpost.theme.section_btn+';',
             header_cell_style: '',
             row_style: `

              font-family: `+fontFamily+`;
              border-bottom: 3px solid `+window.underpost.theme.sub_background+`;

              `,
             cell_style: `
             padding-bottom: 10px;
             padding-top: 10px;
             overflow: auto;
             `,
             minWidth: 'none',
             mark_row_style: `

             font-family: `+fontFamily+`;
             border: 3px solid `+window.underpost.theme.mark+`;

             `,
             contentPlugStyle: `
              overflow-x: hidden;
             `
           }/* */,
           plugin: index => {
             let render_ = `

            <div class='in fll plugin-icon-content-table view-`+index+`'>
             `+this.renderTooltipTableKey('view-tl-'+index, `
                          <i class='fas fa-eye icon-table-keys'></i>
               `, renderLang({
                 en: 'View',
                 es: 'Ver'
               }))+`<br>
            </div>

             <div class='in fll plugin-icon-content-table download-`+index+`'>
             `+this.renderTooltipTableKey('view-tl-'+index, `
                          <i class='fas fa-download icon-table-keys'></i>
               `, renderLang({
                 en: 'Download',
                 es: 'Descargar'
               }))+`<br>
             </div>

             <div class='in fll plugin-icon-content-table delete-`+index+`'>
             `+this.renderTooltipTableKey('view-tl-'+index, `
                          <i class='fas fa-trash icon-table-keys'></i>
               `, renderLang({
                 en: 'Delete',
                 es: 'Eliminar'
               }))+`<br>
             </div>

             <div class='in fll plugin-icon-content-table sign-`+index+`'>
             `+this.renderTooltipTableKey('view-tl-'+index, `
                          <i class="fas fa-pen-nib icon-table-keys"></i>
               `, renderLang({
                 en: 'Sigin',
                 es: 'Firmar'
               }))+`<br>
             </div>

             `;
             setTimeout(()=>{

               const deleteKey = async () => {
                 let response = await new Rest().FETCH('/network/keys', 'DELETE', obj.data[index]);
                 if(response.success === true){
                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Llaves Eliminadas', en: 'Success delete keys'}),
                      2000,
                      'success'
                    );
                   await this.renderTableKeys();
                 }else{
                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                      2000,
                      'error'
                    );
                 }
               };

               s('.download-'+index).onclick = async () => {
                 let response = await new Rest()
                 .FETCH('/network/keys/'+obj.data[index].type+'/'+obj.data[index].id, 'GET');
                 if(response.success === true){


                   let zip = new JSZip();

                   // Add an top-level, arbitrary text file with contents
                   if(obj.data[index].type=='asymmetric'){
                     zip.file(response.dataFileKey.public.name, response.dataFileKey.public.raw);
                     zip.file(response.dataFileKey.private.name, response.dataFileKey.private.raw);
                   }else{
                     zip.file(response.dataFileKey.key.name, response.dataFileKey.key.raw);
                     zip.file(response.dataFileKey.iv.name, response.dataFileKey.iv.raw);
                   }

                   // Generate a directory within the Zip file structure
                   // let img = zip.folder("images");

                   // Add a file to the directory, in this case an image with data URI as contents
                   // img.file("smile.gif", imgData, {base64: true});

                   // Generate the zip file asynchronously
                   zip.generateAsync({ type: "blob" })
                   .then( content => {
                     // Force down of the Zip file
                     // application/zip
                     console.log(content);
                     downloader.BLOB(obj.data[index].id+'.zip', content);
                     notifi.display(
                        window.underpost.styles.notifi.backgroundNotifi,
                        renderLang({es: 'Llave Descargada', en: 'Key Downloaded'}),
                        2000,
                        'success'
                      );
                   }).catch(error => {
                     console.error(error);
                     notifi.display(
                        window.underpost.styles.notifi.backgroundNotifi,
                        renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                        2000,
                        'error'
                      );
                   });

                 }else{
                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                      2000,
                      'error'
                    );
                 }
               };

               s('.delete-'+index).onclick = async ()=>{
                 console.warn('on delete key', obj.data[index]);

                 htmls('.content-cell-modal-'+mainIdGrid, `
                    `+spr('<br>', 2)+`
                      `+renderLang({
                        es: '¿Desea Eliminar la Llave de ID <span style="color: '+window.underpost.theme.mark+'">'+obj.data[index].id+'</span>?',
                        en: 'You want to Delete the ID Key <span style="color: '+window.underpost.theme.mark+'">'+obj.data[index].id+'</span>?'
                      })+`
                        <br><br>
                        <div class='inl btn-underpost confirm-del-key' style='background: black; color: red; width: 75%'>
                              `+renderLang({
                                  es: 'Eliminar Llave',
                                  en: 'Delete Key'
                              })+`
                        </div>
                        <br>
                        <div class='inl btn-underpost cancel-del-key' style='background: black; color: gray; width: 75%'>
                              `+renderLang({
                                  es: 'Cancelar',
                                  en: 'Cancel'
                              })+`
                        </div>
                    `+spr('<br>', 2)+`
                 `);

                 s('.confirm-del-key').onclick = async () => {
                   await deleteKey();
                   fadeOut(s('.main-content-cell-modal-'+mainIdGrid));
                 };
                 s('.cancel-del-key').onclick = () =>
                 fadeOut(s('.main-content-cell-modal-'+mainIdGrid));

                 fadeIn(s('.main-content-cell-modal-'+mainIdGrid));
               };

               s('.cancel-view-key').onclick = async () => {
                 s('view-key').style.display = 'none';
                 fadeIn(s('.create-form-open'));
                 s('.create-form-open').style.display = 'inline-table';
                 fadeIn(s('table-keys'));
               };

               s('.btn-sign-cancel').onclick = () => {
                 fadeIn(s('.create-form-open'));
                 s('.create-form-open').style.display = 'inline-table';
                 s('.form-sign-keys').style.display = 'none';
                 fadeIn(s('table-keys'));
               };
               s('.btn-sign-cancel-result').onclick = () => {
                 fadeIn(s('.create-form-open'));
                 s('.create-form-open').style.display = 'inline-table';
                 s('.form-sign-keys').style.display = 'none';
                 s('.result-sign-content').style.display = 'none';
                 fadeIn(s('table-keys'));
               };

               s('.sign-'+index).onclick = () => {
                 s('.main-content-cell-modal-'+mainIdGrid).style.display = 'none';
                 htmls('.current-id-key-sign', '<br>'+renderLang({
                   es: 'Llave',
                   en: 'Key'
                 })+': '+obj.data[index].id);
                 // s('.form-keys').style.display = 'none';
                 s('.create-form-open').style.display = 'none';
                 s('table-keys').style.display = 'none';
                 s('.btn-sign-key').onclick = async () => {
                  if(s('.input-data-sign').value==''){
                    return  notifi.display(
                         window.underpost.styles.notifi.backgroundNotifi,
                         renderLang({en: 'Empty data', es: 'No hay datos'}),
                         2000,
                         'error'
                       );
                  }
                  if(s('.key-pass-sign').value==''){
                    return  notifi.display(
                         window.underpost.styles.notifi.backgroundNotifi,
                         renderLang({en: 'Empty password', es: 'Contraseña vacia'}),
                         2000,
                         'error'
                       );
                  }
                  const result = await new Rest().FETCH('network/sign-data', 'POST', {
                    data: s('.input-data-sign').value,
                    key: obj.data[index],
                    passphrase: s('.key-pass-sign').value
                  });
                  console.log('sign data response', result);
                  htmls('.result-sign', jsonSave(result));
                  s('.form-sign-keys').style.display = 'none';
                  fadeIn(s('.result-sign-content'));
                  s('.key-pass-sign').value = '';
                  if(result.success === true){

                    s('.btn-sign-copy-result').onclick = async () =>
                    await copyStrClipboard(result.data);
                    await s('.btn-sign-copy-result').click();

                    return notifi.display(
                       window.underpost.styles.notifi.backgroundNotifi,
                       renderLang({
                         es: 'Firma Generada y copiado al portapeles',
                         en: 'Success Sign and Copy to Clipboard'
                       }),
                       2000,
                       'success'
                     );
                  }else{

                    s('.btn-sign-copy-result').onclick = () =>
                    notifi.display(
                       window.underpost.styles.notifi.backgroundNotifi,
                       renderLang({es: 'Firma Invalida', en: 'Invalid Sign'}),
                       2000,
                       'error'
                     );;

                    return notifi.display(
                       window.underpost.styles.notifi.backgroundNotifi,
                       renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                       2000,
                       'error'
                     );
                  }
                }

                 fadeIn(s('.form-sign-keys'));
               };

               s('.view-'+index).onclick = async ()=>{
                 console.warn('on view key', obj.data[index]);
                 s('.main-content-cell-modal-'+mainIdGrid).style.display = 'none';
                 let response = await new Rest().FETCH('/network/keys/'+obj.data[index].type+'/'+obj.data[index].id, 'GET');
                 if(response.success === true){

                   s('.form-keys').style.display = 'none';
                   // s('html').scrollTop = s('html').offsetTop;
                   s('.create-form-open').style.display = 'none';
                   s('table-keys').style.display = 'none';

                   fadeIn(s('view-key'));

                   if(obj.data[index].type == 'symmetric' ){
                     delete response.dataFileKey.iv.buffer;
                     delete response.dataFileKey.key.buffer;
                   }else{
                     delete response.dataFileKey.public.buffer;
                     delete response.dataFileKey.private.buffer;
                   }

                   htmls('.key-raw-data', jsonSave(response.dataFileKey));

                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Informacion Obtenida', en: 'Success get info keys'}),
                      2000,
                      'success'
                    );
                   // await this.renderTableKeys();
                 }else{
                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Error en el Servicio', en: 'Error service'}),
                      2000,
                      'error'
                    );
                 }
               };

             },0);
             return render_;
           },
           name_plugin: ``

         }
       );

  }

}

export { KeysTable }
