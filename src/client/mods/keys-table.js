import { Rest } from '/mods/rest.js';

class KeysTable {

  constructor(obj){

      (async ()=>{

              const fontSize = 10;
              const fontFamily = 'retro-font';
              const dataKeys = await new Rest().FETCH('/network/keys', 'GET');
              const obj = {
                divContent: 'render',
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
                  `
                },
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
              }
            ));

            append('render', spr('<br>', 5));

      })()

  }

}

export { KeysTable }
