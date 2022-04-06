
import Sortable from '/lib/sortable.complete.esm.js';


class Menu {

  constructor(){

    const renderMenuDiv = 'menu-content';
    const factor_ = 0.95;
    const intervalTimeMenuRender = 10;

    append('render', `

        <`+renderMenuDiv+`-render class='in'>

                <`+renderMenuDiv+` class='abs center' style='border: 2px solid gray;'>

                </`+renderMenuDiv+`>

        </`+renderMenuDiv+`-render>


    `);

    this.MenuContentRenderController =
    responsiveRender(intervalTimeMenuRender, (w_, h_) => {
      s(renderMenuDiv+'-render').style.height = h_ + 'px';
      if(w_>h_){
        s(renderMenuDiv).style.width = h_*factor_ + 'px';
        s(renderMenuDiv).style.width = h_*factor_ + 'px';
      }else{
        s(renderMenuDiv).style.width = w_*factor_ + 'px';
        s(renderMenuDiv).style.width = w_*factor_ + 'px';
      }
    });




    const cellGrid = () => {
      return {
        cell: `

          width: 85%;
          height: 85%;
          border: 3px solid rgb(15,15,15);
          transition: .3s;
          border-radius: 10%;

        `,
        cell_hover: `

          border: 3px solid yellow;
          border-radius: 50%;
          width: 90%;
          height: 90%;

        `,
        content_cell_modal: `
          border-radius: 10px;
          border: 4px solid #670667;
          display: none;
          z-index: 1003;
          background: #161616;
          width: 274px;
          /* height: 255px; */
        `,
        cell_modal: `

              border: 10px solid #161616;
              /* overflow: auto; */
              transition: .3s;
              width: 254px;
              /* height: 235px; */

        `,
        cell_gfx: `

          width: 50px;
          height: auto;
          transition: .3s;

        `,
        close_btn_content: `
            top: -10px;
            left: -10px;
            width: 30px;
            height: 30px;
            border: 4px solid #670667;
            border-radius: 50%;
            background: #161616;
            transition: .3s;
            z-index: 999;
        `,
        close_btn_content_hover: `

            border: 4px solid yellow;
        `,
        close_btn_simbol: `<i class="fas fa-times"></i>`,
        cell_btn_render_back: `

        border: 3px solid #670667;
        width: 30px;
        height: 30px;
        transition: .3s;
        font-size: 25px;
        background: rgb(22,22,22);
        border-radius: 50%;
        left: 0%;

        `,
        cell_btn_render_back_value: `

          <div class='abs center hover-row-v1'>
              <i class="fas fa-angle-left"></i>
          </div>

        `,
        cell_btn_render_next: `

        border: 3px solid #670667;
        width: 30px;
        height: 30px;
        transition: .3s;
        font-size: 25px;
        background: rgb(22,22,22);
        border-radius: 50%;
        left: 100%;

        `,
        cell_btn_render_next_value: `

          <div class='abs center hover-row-v1'>
            <i class="fas fa-angle-right"></i>
          </div>

        `
      };
    };


    append('render', '<menu-modal></menu-modal>');

    const dimGridMenu = 5;

    this.processGrid = renderGridsModal({
      row: dimGridMenu,
      col: dimGridMenu,
      delayInit: 0,
      dataType: undefined,
      id_cell: 'menu-cell',
      divRenderModal: 'menu-modal',
      dataCell: [{test: 'asd'},{test: 'asd'},{test: 'asd'}],
      intervalRender: intervalTimeMenuRender,
      onCLick: (dataCell, idModal, id_cell_grid, idGrid) => {
            const dataInput = {
              dataCell,
              idModal,
              id_cell_grid,
              idGrid
            };
            console.log(dataInput);

      },
      style: cellGrid()
    });

    // this.processGrid != undefined ?
    // clearInterval(this.processGrid.intervalGridModal):null;
    append(renderMenuDiv, this.processGrid.render);

    for(let rowId of range(1, dimGridMenu)){
      new Sortable(s('.row-content-'+rowId+'-'+this.processGrid.idGrid), {
        swap: true,
        animation: 150,
        group: 'nested',
    		// fallbackOnBody: true,
    		// swapThreshold: 0.65
      });
    }

    //


    }

}


export { Menu };
