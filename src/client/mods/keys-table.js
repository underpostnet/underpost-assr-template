import { Rest } from '/mods/rest.js';
import { Menu } from './menu.js';

class KeysTable {

  constructor(obj){

    this.idSortableContentTable = 'sortable-table-keys';
    this.id_cell  = 'table-cell-keys';
    this.mainWidthTable = '98%';

    append('render', `

      <div class='inl btn-underpost create-form-open' style='margin: 5px'>
          `+renderLang({
            es: 'Crear Llave',
            en: 'Create Key'
          })+`
          <i class='fas fa-plus' style='font-size: 20px'></i>
      </div>

      <form class='in form-keys' style='display: none; margin: 5px'>

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

                <i class="fas fa-times" style='font-size: 20px;'></i>

          </div>

          <div class='inl btn-underpost create-key-btn'>
              `+renderLang({
                es: 'Crear',
                en: 'Create'
              })+`
              <i class='fas fa-key' style='font-size: 20px'></i>
          </div>

      </form>




      <style>

          .plugin-icon-content-table {
            text-align: center;
            width: 33%;
          }

          .btn-plug-table {
            `+window.underpost.theme.cursorPointer+`
            transition: .3s;
          }

          .btn-plug-table:hover {
            color: `+window.underpost.theme.mark+`;
          }

      </style>

      <view-key style='display: none'>

            <view-key-menu class='in'>

                    <div class='inl btn-underpost cancel-view-key'>

                          <i class="fas fa-times"></i>

                    </div>

                    <div class='inl btn-underpost btn-view-key-raw'>
                        `+renderLang({
                          es: 'ver datos json en bruto',
                          en: 'view json raw data'
                        })+`
                        <i class='fas fa-eye'></i>
                    </div>

            </view-key-menu>

            <pre class='key-raw-data' style='display: none'>

            </pre>


      </view-key>

      <table-keys class='in'>
            <table-keys-header class='in' style='width: `+this.mainWidthTable+`; margin: auto'> </table-keys-header>

            <`+this.idSortableContentTable+`></`+this.idSortableContentTable+`>
      </table-keys>

    `);

    const fontSize = 12;
    let checksBox = [
      {
        id: 'asymmetric-input',
        state: false,
        text: '<span style="font-size: '+fontSize+'px">'+renderLang({es: 'asimetrica', en: 'asymmetric'})+'</span>'
      },
      {
        id: 'symmetric-input',
        state: false,
        text: '<span style="font-size: '+fontSize+'px">'+renderLang({es: 'simetrica', en: 'symmetric'})+'</span>'
      }
    ];

    checksBox.map( (v,i,a) => {
      append('in-key-options', renderChecbox({
        ...v,
        extraClassContent: '',
        click: stateEvent => {
            console.log(v.id, stateEvent);
            checksBox[i].state = stateEvent;
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

      (async () => await this.renderTableKeys())();

  }


  async renderTableKeys(inObj){

         inObj == undefined ? inObj = {} : null;

         const fontSize = 10;
         const fontFamily = window.underpost.theme.font;
         const obj = {
           divContent: 'table-keys',
           data: await new Rest().FETCH('/network/keys', 'GET')
         };

         // htmls(obj.divContent, );

         htmls(this.idSortableContentTable, '');
         new Menu({
               row: l(obj.data),
               col: 1,
               renderDiv: this.idSortableContentTable,
               idContentGridResponsive: 'interval-keys-table',
               intervalCellGrid: 'interval-keys-cell',
               styleMainContent: '',
               factorCell: 1,
               cellStyle:   `
                   width: `+this.mainWidthTable+`;
                   height: auto;
                   border: 3px solid `+window.underpost.theme.background+`;
                   transition: .3s;
                   text-align: left;
                   overflow-y: auto;
                   overflow-x: hidden;
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

               },
               id_cell: this.id_cell,
               sortableGroup: 'group-table-keys',
               // default content cell is replaced for orderPost.map
               APPS: []
             });


         renderTableV1( obj.data, {
           onRenderStyle: renderStyle =>
           append(this.idSortableContentTable, renderStyle),
           onHeaderRender: renderHeader =>
           htmls('table-keys-header', renderHeader),
           onRenderDataRow: (renderRow, dataRow, indexRow) => {
             console.log('onRenderDataRow', dataRow);
             const selectorCell = '.'+this.id_cell+'-'+indexRow;
             htmls(selectorCell, renderRow);
             s(selectorCell).onclick = () => s('.view-'+indexRow).click();
           },
           idMark: inObj.mark,
           style: {
             header_row_style: `
             padding-bottom: 10px;
             padding-top: 10px;
             `+'font-family: '+fontFamily+'; border-bottom: 3px solid '+window.underpost.theme.section_btn+'; font-size: '+fontSize+'px;',
             header_cell_style: '',
             row_style: `

              font-family: `+fontFamily+`;
              border-bottom: 3px solid `+window.underpost.theme.sub_background+`;
              font-size: `+fontSize+`px;

              `,
             cell_style: `
             padding-bottom: 5px;
             padding-top: 5px;
             overflow: auto;
             `,
             minWidth: 'none',
             mark_row_style: `

             font-family: `+fontFamily+`;
             border: 3px solid `+window.underpost.theme.mark+`;
             font-size: `+fontSize+`px;

             `
           }/* */,
           plugin: index => {
             let render_ = `


             <div class='in fll plugin-icon-content-table btn-plug-table view-`+index+`'>

                        <i class='fas fa-eye' style='font-size: 16px;'></i>

             </div>

             <div class='in fll plugin-icon-content-table btn-plug-table'>

                        <i class='fas fa-download' style='font-size: 16px;'></i>

             </div>

             <div class='in fll plugin-icon-content-table btn-plug-table delete-`+index+`'>

                        <i class='fas fa-trash' style='font-size: 16px;'></i>

             </div>
             `;
             setTimeout(()=>{
               s('.delete-'+index).onclick = async ()=>{
                 console.warn('on delete key', obj.data[index]);
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

               s('.cancel-view-key').onclick = async () => {
                 s('view-key').style.display = 'none';
                 fadeIn(s('.create-form-open'));
                 s('.create-form-open').style.display = 'inline-table';
                 s('.key-raw-data').style.display = 'none';
                 fadeIn(s('table-keys'));
               };

               s('.view-'+index).onclick = async ()=>{
                 console.warn('on view key', obj.data[index]);
                 let response = await new Rest().FETCH('/network/keys/'+obj.data[index].type+'/'+obj.data[index].id, 'GET');
                 if(response.success === true){

                   s('.form-keys').style.display = 'none';
                   // s('html').scrollTop = s('html').offsetTop;
                   s('.create-form-open').style.display = 'none';
                   s('table-keys').style.display = 'none';

                   fadeIn(s('view-key'));
                   s('.btn-view-key-raw').onclick = () => {
                      htmls('.key-raw-data', jsonSave(response.dataFileKey));
                      fadeIn(s('.key-raw-data'));
                   };

                   notifi.display(
                      window.underpost.styles.notifi.backgroundNotifi,
                      renderLang({es: 'Informacion Obtenida', en: 'Success get info keys'}),
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

             },0);
             return render_;
           },
           name_plugin: `


           <div class='in fll plugin-icon-content-table'>

                     `+renderLang({en: 'view', es: 'ver'})+`

           </div>

           <div class='in fll plugin-icon-content-table'>

                     `+renderLang({en: 'download', es: 'descargar'})+`

           </div>

           <div class='in fll plugin-icon-content-table'>

                     `+renderLang({en: 'delete', es: 'eliminar'})+`

           </div>
           `

         }
       );

  }

}

export { KeysTable }
