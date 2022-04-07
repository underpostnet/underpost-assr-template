
import Sortable from '/lib/sortable.complete.esm.js';


class Menu {

  constructor(){

    const renderMenuDiv = 'menu-content';
    const factor_ = 0.95;
    const intervalTimeMenuRender = 10;

    const iconStyle = `
      font-size: 35px;
      top: 40%;
    `;
    const textStyle = `
      font-size: 8px;
      top: 90%;
    `;

    const APPS = [
      {
        path: '/editor',
        render: () => `
            <i class="fas fa-edit abs center" style='`+iconStyle+`'>
            </i>
            <div class='abs center' style='`+textStyle+`'>
                `+renderLang({es: 'Editor', en: 'Editor'})+`
            </div>
        `
      },
      {
        path: '/user',
        render: () => `
            <i class="fas fa-user abs center" style='`+iconStyle+`'>
            </i>
            <div class='abs center' style='`+textStyle+`'>
                `+renderLang({es: 'Usuario', en: 'User'})+`
            </div>
        `
      }
    ];

    append('render', `

        <`+renderMenuDiv+`-render class='in'>

                <`+renderMenuDiv+` class='abs center' style='border: 2px solid #0e0e0e; border-radius: 10px;'>

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


    append('render', '<menu-modal style="display: none"></menu-modal>');

    const dimGridMenu = 5;
    const id_cell = 'menu-cell';

    this.processGrid = renderGridsModal({
      row: dimGridMenu,
      col: dimGridMenu,
      delayInit: 0,
      dataType: undefined,
      id_cell,
      divRenderModal: 'menu-modal',
      dataCell: APPS,
      intervalRender: intervalTimeMenuRender,
      onCLick: (dataCell, idModal, id_cell_grid, idGrid) => {
            const dataInput = {
              dataCell,
              idModal,
              id_cell_grid,
              idGrid
            };
            console.log(dataInput);
            location.href = dataCell.path;

      },
      style: cellGrid(),
      factorCell: 0.9
    });

    // this.processGrid != undefined ?
    // clearInterval(this.processGrid.intervalGridModal):null;
    append(renderMenuDiv, this.processGrid.render);


    const totalCell = (dimGridMenu*dimGridMenu)-1;
    for(let idCellMenu of range(0, totalCell)){
      if(APPS[idCellMenu]){
        const selectorCell = '.'+id_cell+'-'+idCellMenu;
        s(selectorCell).classList.add('underpost-pointer');
        htmls(selectorCell, APPS[idCellMenu].render());
      }
      // const mainSelectorCell =  '.main-cell-'+id_cell+`-`+idCellMenu;
      // s(mainSelectorCell)['data-id'] = 'menu-storage-'+idCellMenu;
      // console.log(s(mainSelectorCell)['data-id']);
    }

    // for(let rowId of range(1, dimGridMenu)){  }
    //  new Sortable(s('.row-content-'+rowId+'-'+this.processGrid.idGrid), {
    new Sortable(s('.'+this.processGrid.idGrid+'-content'), {
        // swap: true,
        animation: 150,
        group: 'menu-storage',
    		// fallbackOnBody: true,
    		// swapThreshold: 0.65
        store: {
      		/**
      		 * Get the order of elements. Called once during initialization.
      		 * @param   {Sortable}  sortable
      		 * @returns {Array}
      		 */
      		get: function (sortable) {
      			let order = localStorage.getItem(sortable.options.group.name);
            console.log('get menu sortable', order);
      			return order ? order.split('|') : [];
      		},

      		/**
      		 * Save the order of elements. Called onEnd (when the item is dropped).
      		 * @param {Sortable}  sortable
      		 */
      		set: function (sortable) {
      			let order = sortable.toArray();
            console.log('set menu sortable', order);
      			localStorage.setItem(sortable.options.group.name, order.join('|'));
      		}
      	}
      });





    }

}


export { Menu };
