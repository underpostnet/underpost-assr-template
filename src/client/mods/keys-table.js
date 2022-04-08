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

                  <div class='in' style='padding: 10px;'>
                      `+renderLang({
                        en: 'Select Type Key',
                        es: 'Seleccione tipo de llave'
                      })+`
                  </div>


            </in-key-options>

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

      <table-keys class='in' style='margin: 5px'>

      </table-keys>

    `);

  
    const fontSize = 12;
    let checksBox = [
      {
        id: 'asymmetric-input',
        state: false,
        text: '<span style="font-size: '+fontSize+'px">asymmetric</span>'
      },
      {
        id: 'symmetric-input',
        state: false,
        text: '<span style="font-size: '+fontSize+'px">symmetric</span>'
      }
    ];

    checksBox.map( (v,i,a) => {
      append('in-key-options', renderChecbox({
        ...v,
        extraClassContent: '',
        click: stateEvent => {
            console.log(v.id, stateEvent);
            checksBox[i].state = stateEvent;
            if(stateEvent===true){
              checksBox.map( (v_,i_,a_) => {
                if(i_!=i && v_.state===true){
                    s('.'+checksBox[i_].id).click();
                }
              });
            }
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

      (async ()=>{

              const fontSize = 10;
              const fontFamily = 'retro-font';
              const dataKeys = await new Rest().FETCH('/network/keys', 'GET');
              const obj = {
                divContent: 'table-keys',
                data: dataKeys.map( (v,i,a) => {
                  return {
                    path: v
                  }
                })
              };

              append(obj.divContent, renderTableV1( obj.data, {
                style: {
                  header_row_style: `
                  padding-bottom: 10px;
                  padding-top: 10px;
                  `+'font-family: '+fontFamily+'; border-bottom: 3px solid red; font-size: '+fontSize+'px;',
                  header_cell_style: '',
                  row_style: 'font-family: '+fontFamily+'; border-bottom: 3px solid yellow; font-size: '+fontSize+'px;',
                  cell_style: `
                  padding-bottom: 5px;
                  padding-top: 5px;
                  `,
                  minWidth: 'none'
                }/*,
                plugin: index => {
                  let render_ = `<div class='inl cell-key-`+index+`'>
                  test `+index+`
                  </div>`;
                  setTimeout(()=>{
                    s('.cell-key-'+index).onclick = ()=>{
                      alert("index: "+index);
                    };
                  },0);
                  return render_;
                },
                name_plugin: 'plugin'
                */
              }
            ));

            append('render', spr('<br>', 5));

      })()

  }

}

export { KeysTable }
