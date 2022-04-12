import { Rest } from '/mods/rest.js';

class KeysTable {

  constructor(obj){


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

                  <div class='in' style='`+underpost_section_title+`'>
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
              id_content_input: 'a3-1',
              id_input: 'key-pass',
              type: 'password',
              required: true,
              style_content_input: '',
              style_input,
              style_label,
              style_outline: true,
              style_placeholder,
              textarea: false,
              active_label: true,
              initLabelPos: 5,
              endLabelPos: -20,
              text_label: renderLang({en: 'Password', es: 'Contraseña'}),
              tag_label: 'a3-2',
              fnOnClick: async () => {
                console.log('click input');
              },
              value: ``,
              topContent: '',
              botContent,
              placeholder: ''
            })+`

          <div class='inl btn-underpost cancel-key' style='left: -5px;'>

                <i class="fas fa-times" style='font-size: 20px;'></i>

          </div>

          <div class='inl btn-underpost create-key-btn' style='left: -23px;'>
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
            width: 32%;
          }

      </style>

      <table-keys class='in' style='margin: 5px'>

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
          `,
          widthText: 140,
          pointer: true,
          background: COLOR_THEME_B,
          border: '2px solid yellow',
          width: 41,
          height: 41,
          radio: undefined,
          hover: `
            background: `+COLOR_THEME_B_HOVER+`;
          `,
          icon: `
            <i class='fas fa-check' style='color: white; font-size: 20px'>
            </i>
          `
        }
      }));
    });

    s('.create-form-open').onclick = () => {
      s('.create-form-open').style.display = 'none';
      fadeIn(s('.form-keys'));
    };
    s('.cancel-key').onclick = () => {
      s('.form-keys').style.display = 'none';
      fadeIn(s('.create-form-open'));
      s('.create-form-open').style.display = 'inline-table';
    };
    s('.create-key-btn').onclick = async () => {

        if(
          checksBox[0].state == false
          &&
          checksBox[1].state == false){
            return   notifi.display(
               backgroundNotifi,
               renderLang({en: 'Select Key Type', es: 'Seleccione tipo de llave'}),
               2000,
               'error'
             );
        }

        if(s('.key-pass').value==''){
            return   notifi.display(
               backgroundNotifi,
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
              backgroundNotifi,
              renderLang({es: 'Llaves creadas', en: 'Success create keys'}),
              2000,
              'success'
            );
        }else{
          return  notifi.display(
             backgroundNotifi,
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
         const fontFamily = 'retro-font';
         const obj = {
           divContent: 'table-keys',
           data: await new Rest().FETCH('/network/keys', 'GET')
         };

         htmls(obj.divContent, renderTableV1( obj.data, {
           idMark: inObj.mark,
           style: {
             header_row_style: `
             padding-bottom: 10px;
             padding-top: 10px;
             `+'font-family: '+fontFamily+'; border-bottom: 3px solid red; font-size: '+fontSize+'px;',
             header_cell_style: '',
             row_style: `

              font-family: `+fontFamily+`;
              border-bottom: 3px solid rgb(22, 22, 22);
              font-size: `+fontSize+`px;

              `,
             cell_style: `
             padding-bottom: 5px;
             padding-top: 5px;
             overflow: hidden;
             `,
             minWidth: 'none',
             mark_row_style: `

             font-family: `+fontFamily+`;
             border: 3px solid yellow;
             font-size: `+fontSize+`px;

             `
           }/* */,
           plugin: index => {
             let render_ = `


             <div class='in fll underpost-pointer b-yellow plugin-icon-content-table'>

                        <i class='fas fa-eye' style='font-size: 16px;'></i>

             </div>

             <div class='in fll underpost-pointer b-yellow plugin-icon-content-table'>

                        <i class='fas fa-download' style='font-size: 16px;'></i>

             </div>

             <div class='in fll underpost-pointer b-red plugin-icon-content-table'>

                        <i class='fas fa-trash' style='font-size: 16px;'></i>

             </div>
             `;
             // setTimeout(()=>{
             //   s('.cell-key-'+index).onclick = ()=>{
             //     alert("index: "+index);
             //   };
             // },0);
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
       ));

       append('render', spr('<br>', 5));
  }

}

export { KeysTable }
