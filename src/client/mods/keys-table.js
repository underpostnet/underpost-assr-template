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

          tipo <br>
          contraseña <br>

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
