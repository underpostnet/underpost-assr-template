
import Sortable from '/lib/sortable.complete.esm.js';

class Menu {

  constructor(){


    const renderMenuDiv = 'menu-content';
    const factor_ = 0.95;
    const intervalTimeMenuRender = 10;
    const renderDiv = 'menu-nav';

    // Menu Controller
    append('render', `
      <menu-nav class='fix' style='
        display: none;
        width: 100%;
        height: 100%;
        top: 0%;
        left: 0%;
        z-index: `+window.underpost.styles.zIndex.contentMenu+`;
        background: `+window.underpost.theme.background+`;
      '></menu-nav>
    `);

    const renderTooltipNavBar = (_id, content_, value_) => renderTooltipV1({
          idTooltip: _id,
          tooltipStyle: '',
          contentUnderpostClass: 'abs center',
          originContent:  content_,
          tooltipContent: `
            <div class='abs center' style='top: -50px; width: 100px;'>
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


    append('render', `

        <style>

            .btn-nav {
              width: 15px;
              height: 15px;
              font-size: 20px;
              transition: .3s;
              z-index: `+window.underpost.styles.zIndex.btnMenu+`;
            }
            .btn-nav:hover {
                bottom: 5px;
                right: 5px;
                width: 25px;
                height: 25px;
                font-size: 30px;
                z-index: `+window.underpost.styles.zIndex.btnMenu+`;
             }

        </style>

                <btns-views-content>
                  <div class='fix btn-underpost btn-nav btn-nav-up' style='bottom: 3px; left: 3px; display: none'>

                        <div class='abs center'>
                              <i class="fas fa-arrow-up"></i>
                        </div>

                  </div>
                </btns-views-content>

                <div class='fix btn-underpost btn-nav btn-nav-home' style='bottom: 3px; right: 3px;'>

                </div>

                <div class='fix btn-underpost btn-nav btn-nav-close' style='bottom: 3px; right: 3px; display: none;'>

                </div>




    `);

    append('.btn-nav-home', renderTooltipNavBar(
      'btn-nav-home',
      '<i class="fas fa-th abs center"></i>',
      renderLang({es: 'Menu', en: 'Menu'})
    ));

    append('.btn-nav-close', renderTooltipNavBar(
      'btn-nav-close',
      '<i class="fas fa-times abs center"></i>',
      renderLang({es: 'Cerrar<br>Menu', en: 'Close Menu'})
    ));

    s('.btn-nav-home').onclick = () => {
      // location.href = '/';
      s('.btn-nav-home').style.display = 'none';
      fadeIn(s('.btn-nav-close'));
      s('btns-views-content').style.display = 'none';
      s('html').style.overflow = 'hidden';
      fadeIn(s(renderDiv));
    };

    s('.btn-nav-close').onclick = () => {
      // location.href = '/';
      s('.btn-nav-close').style.display = 'none';
      fadeIn(s('.btn-nav-home'));
      s('btns-views-content').style.display = 'block';
      s('html').style.overflow = 'auto';
      fadeOut(s(renderDiv));
    };

    s('.btn-nav-up').onclick = () => {
      s('html').scrollTop = s('html').offsetTop;
    };



    toUpBtn('body', '.btn-nav-up', 300);


    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

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
      },
      {
        path: '/keys',
        render: () => `
            <i class="fas fa-key abs center" style='`+iconStyle+`'>
            </i>
            <div class='abs center' style='`+textStyle+`'>
                `+renderLang({es: 'Llaves', en: 'Keys'})+`
            </div>
        `
      },
      {
        path: '/config',
        render: () => `
            <i class="fas fa-cog abs center" style='`+iconStyle+`'>
            </i>
            <div class='abs center' style='`+textStyle+`'>
                `+renderLang({es: 'Configuración', en: 'Setting'})+`
            </div>
        `
      }
    ];

    append(renderDiv, `

        <`+renderMenuDiv+`-render class='in'>

                <`+renderMenuDiv+` class='abs center' style='border: 2px solid `+window.underpost.theme.text+`; border-radius: 10px;'>

                </`+renderMenuDiv+`>

        </`+renderMenuDiv+`-render>


    `);

    window.underpost.intervals.MenuContentRenderController != undefined ?
    clearInterval(window.underpost.intervals.MenuContentRenderController):null;
    window.underpost.intervals.MenuContentRenderController =
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
          border: 3px solid `+window.underpost.theme.text+`;
          transition: .3s;
          border-radius: 10%;

        `,
        cell_hover: `

          border: 3px solid `+window.underpost.theme.mark+`;
          border-radius: 50%;
          width: 90%;
          height: 90%;
          `+window.underpost.theme.cursorPointer+`
          color: `+window.underpost.theme.mark+`;

        `,
        content_cell_modal: `
          border-radius: 10px;
          border: 4px solid #670667;
          display: none;
           /* z-index: none; */
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
          /* z-index: none; */
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


    append(renderDiv, '<menu-modal style="display: none"></menu-modal>');

    const dimGridMenu = 5;
    const id_cell = 'menu-cell';

    window.underpost.intervals.processGrid != undefined ?
    getKeys(window.underpost.intervals.processGrid.intervalReturn).map( intervalKey => {
      clearInterval(window.underpost.intervals.processGrid.intervalReturn[intervalKey]);
    }):null;
    window.underpost.intervals.processGrid = renderGridsModal({
      row: dimGridMenu,
      col: dimGridMenu,
      delayInit: 0,
      dataType: undefined,
      id_cell,
      divRenderModal: 'menu-modal',
      dataCell: APPS,
      intervalRender: intervalTimeMenuRender,
      onCLick: (dataCell, idModal, id_cell_grid, idGrid) => {
            s('.loading').style.display = 'block';
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

    append(renderMenuDiv, window.underpost.intervals.processGrid.render);


    const totalCell = (dimGridMenu*dimGridMenu)-1;
    for(let idCellMenu of range(0, totalCell)){
      if(APPS[idCellMenu]){
        const selectorCell = '.'+id_cell+'-'+idCellMenu;
        // s(selectorCell).classList.add(window.underpost.theme.classPointer);
        htmls(selectorCell, APPS[idCellMenu].render());
      }
      // const mainSelectorCell =  '.main-cell-'+id_cell+`-`+idCellMenu;
      // s(mainSelectorCell)['data-id'] = 'menu-storage-'+idCellMenu;
      // console.log(s(mainSelectorCell)['data-id']);
    }

    // for(let rowId of range(1, dimGridMenu)){  }
    //  new Sortable(s('.row-content-'+rowId+'-'+window.underpost.intervals.processGrid.idGrid), {
    let onClick = true;
    new Sortable(s('.'+window.underpost.intervals.processGrid.idGrid+'-content'), {
        // swap: true,
        animation: 150,
        group: 'menu-storage',
        forceFallback: true,
        fallbackOnBody: true,
    		// swapThreshold: 0.65
        onUnchoose: function(/**Event*/evt) {
  				if(onClick === true){
            s('.'+evt.item.className.split(' ')[1]).click();
          }
          onClick = true;
  			},
        onChange: function(/**Event*/evt) {
      		onClick = false;
      	},
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
