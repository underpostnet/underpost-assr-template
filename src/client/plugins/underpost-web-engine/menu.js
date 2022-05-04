
import Sortable from '/lib/sortable.complete.esm.js';

class Menu {

  constructor(MainInput){


    const renderMenuDiv = makeid(5);
    const factor_ = 0.95;
    const intervalTimeMenuRender = 10;
    const renderDiv = MainInput ? MainInput.renderDiv : makeid(5);

    // Menu Controller
    append('render', `
      <`+renderDiv+` class='`+(MainInput ? MainInput.underpostClass : 'fix' )+`' style='
        display: `+(MainInput ? MainInput.initDisplay : 'none' )+`;
         `+(MainInput ? MainInput.styleContentGrid : `
           width: 100%;
           height: 100%;
           top: 0%;
           left: 0%;
           z-index: `+window.underpost.styles.zIndex.contentMenu+`;
           background: `+window.underpost.theme.background+`;
           ` )+`

      '></`+renderDiv+`>
    `);

    MainInput ? null: ( () => {

    const renderTooltipNavBar = (_id, content_, value_) => renderTooltipV1({
          idTooltip: _id,
          tooltipStyle: '',
          contentUnderpostClass: 'abs center',
          originContent:  content_,
          tooltipContent: `
            <div class='abs center' style='top: -30px; width: 100px;'>
                  <div class='inl' style='
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
              width: `+window.underpost.theme.fontSize._p+`;
              height: `+window.underpost.theme.fontSize._p+`;
              transition: .3s;
              z-index: `+window.underpost.styles.zIndex.btnMenu+`;
            }
            .btn-nav:hover {
                bottom: 5px;
                right: 5px;
                z-index: `+window.underpost.styles.zIndex.btnMenu+`;
             }

        </style>

                <btns-views-content>

                  <div class='fix btn-underpost btn-nav btn-nav-up' style='bottom: 3px; left: 3px; display: none'>

                  </div>

                </btns-views-content>

                <div class='fix btn-underpost btn-nav btn-nav-home' style='bottom: 3px; right: 3px;'>

                </div>

                <div class='fix btn-underpost btn-nav btn-nav-close' style='bottom: 3px; right: 3px; display: none;'>

                </div>




    `);

    append('.btn-nav-home', renderTooltipNavBar(
      'btn-nav-home',
      '<i class="fas fa-th"></i>',
      renderLang({es: 'Menu', en: 'Menu'})
    ));

    append('.btn-nav-close', renderTooltipNavBar(
      'btn-nav-close',
      '<i class="fas fa-times"></i>',
      renderLang({es: 'Cerrar<br>Menu', en: 'Close Menu'})
    ));

    s('.btn-nav-home').onclick = () => {
      s('.btn-nav-home').style.display = 'none';
      fadeIn(s('.btn-nav-close'));
      s('btns-views-content').style.display = 'none';
      s('html').style.overflow = 'hidden';
      fadeIn(s(renderDiv));
    };

    s('.btn-nav-close').onclick = () => {
      s('.btn-nav-close').style.display = 'none';
      fadeIn(s('.btn-nav-home'));
      s('btns-views-content').style.display = 'block';
      s('html').style.overflow = 'auto';
      fadeOut(s(renderDiv));
    };

    append('.btn-nav-up', renderTooltipNavBar(
      'btn-nav-up',
      '<i class="fas fa-arrow-up"></i>',
      renderLang({es: 'Subir', en: 'Top'})
    ));

    s('.btn-nav-up').onclick = () => {
      s('html').scrollTop = s('html').offsetTop;
    };

      window.underpost.scroll.fnUpBtn =
      toUpBtn('.btn-nav-up', 300);

    } )();

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    const APPS = MainInput ? MainInput.APPS : window.underpost.paths;

    append(renderDiv, `

        <`+renderMenuDiv+`-render class='in'>

                <`+renderMenuDiv+` class='`+(MainInput ? MainInput.underpostClassSubGrid : 'abs center' )+`'
                style='
                `+(MainInput ? MainInput.styleMainContent : `border: 2px solid `+window.underpost.theme.text+`; border-radius: 10px;`)+`
                '>

                </`+renderMenuDiv+`>

        </`+renderMenuDiv+`-render>


    `);

    let idExternResponsive = MainInput ? MainInput.idContentGridResponsive : "MenuContentRenderController";
    window.underpost.intervals[idExternResponsive] != undefined ?
    clearInterval(window.underpost.intervals[idExternResponsive]):null;
    window.underpost.intervals[idExternResponsive] =
    responsiveRender(intervalTimeMenuRender, (w_, h_) => {

      if(!(s(renderMenuDiv+'-render') && s(renderMenuDiv+'-render'))){
        console.warn('no grid render div');
        return;
      }

      MainInput ?
      s(renderMenuDiv+'-render').style.height = 'auto':
      s(renderMenuDiv+'-render').style.height = h_ + 'px';

      if(w_>h_){
        if(MainInput){
          s(renderMenuDiv).style.width = MainInput.mainContentWidth;
          s(renderMenuDiv).style.margin = 'auto';
        }else {
          s(renderMenuDiv).style.width = h_*factor_ + 'px';
        }
      }else{
        if(MainInput){
          s(renderMenuDiv).style.width = MainInput.mainContentWidth;
          s(renderMenuDiv).style.margin = 'auto';
        }else {
          s(renderMenuDiv).style.width = w_*factor_ + 'px';
        }
      }
    });




    const cellGrid = () => {
      return {
        cell: MainInput ? MainInput.cellStyle : `

          width: 85%;
          height: 85%;
          border: 3px solid `+window.underpost.theme.text+`;
          transition: .3s;
          border-radius: 10%;

        `,
        cell_hover: MainInput ? MainInput.hoverCellStyle : `

          border: 3px solid `+window.underpost.theme.mark+`;
          border-radius: 50%;
          width: 90%;
          height: 90%;
          `+window.underpost.theme.cursorPointer+`
          color: `+window.underpost.theme.mark+`;

        `,
        content_cell_modal: `
        /*  border-radius: 10px;
          border: 4px solid #670667; */
          display: none;
          z-index: `+window.underpost.styles.zIndex.contentModalGrid+`;
          background: `+window.underpost.theme.sub_background+`;
          color: `+window.underpost.theme.sub_text+`;
          width: 274px;
          /* height: 255px; */
        `,
        cell_modal: `

              border: 10px solid `+window.underpost.theme.sub_text+`;
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
            border: 4px solid `+window.underpost.theme.sub_text+`;
            border-radius: 50%;
            background: `+window.underpost.theme.sub_background+`;
            transition: .3s;
            z-index: `+window.underpost.styles.zIndex.contentModalGrid+`;
            `+window.underpost.theme.cursorPointer+`
        `,
        close_btn_content_hover: `

            border: 4px solid `+window.underpost.theme.mark+`;
            color: `+window.underpost.theme.mark+`;
        `,
        close_btn_simbol: `<i class="fas fa-times"></i>`,
        cell_btn_render_back: `

        border: 3px solid #670667;
        width: 30px;
        height: 30px;
        transition: .3s;
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

    const menuModalId = MainInput && MainInput.mainIdGrid ? 'modal-' + MainInput.mainIdGrid : makeid(5);
    // style="display: none"
    append(renderDiv, '<'+menuModalId+' class="in" ></'+menuModalId+'>');

    const dimGridMenu = 5;
    const id_cell = MainInput ? MainInput.id_cell : 'menu-cell';
    const idExtern = MainInput ? MainInput.intervalCellGrid : "processGrid";
    window.underpost.intervals[idExtern] != undefined ?
    getKeys(window.underpost.intervals[idExtern].intervalReturn).map( intervalKey => {
      clearInterval(window.underpost.intervals[idExtern].intervalReturn[intervalKey]);
    }):null;
    window.underpost.intervals[idExtern] = renderGridsModal({
      row: ( MainInput ? MainInput.row : dimGridMenu ),
      col: ( MainInput ? MainInput.col : dimGridMenu ),
      setHeight: ( MainInput ? MainInput.setHeight : undefined ),
      classSubContentCell: ( MainInput ? MainInput.classSubContentCell : undefined ),
      disableRowNavModal: true,
      delayInit: 0,
      mainIdGrid: MainInput ? MainInput.mainIdGrid : undefined,
      clickRowOpenModal: MainInput ? MainInput.clickRowOpenModal : undefined,
      dataType: undefined,
      id_cell,
      divRenderModal: menuModalId,
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
            if(MainInput){
              return MainInput.click(dataInput);
            }
            s('.loading').style.display = 'block';
            window.underpost.view(dataCell.path);

      },
      style: cellGrid(),
      factorCell: MainInput ? MainInput.factorCell : 0.9
    });

    append(renderMenuDiv, window.underpost.intervals[ MainInput ? idExtern : "processGrid" ].render);


    let totalCell;
    if(MainInput){
      totalCell = (MainInput.col*MainInput.row) - 1;
    }else{
      totalCell = (dimGridMenu*dimGridMenu) -1 ;
    }

    const iconStyle = `
      font-size: `+window.underpost.theme.fontSize._h1+`;
      top: 40%;
    `;
    const textStyle = `
      top: 90%;
    `;

    for(let idCellMenu of range(0, totalCell)){
      if(APPS[idCellMenu] && MainInput == undefined){
        const selectorCell = '.'+id_cell+'-'+idCellMenu;
        // s(selectorCell).classList.add(window.underpost.theme.classPointer);
        htmls(selectorCell, `

        <div class='abs center' style='`+iconStyle+`'>
              `+APPS[idCellMenu].icon+`
        </div>
        <div class='abs center' style='`+textStyle+`'>
              `+APPS[idCellMenu].name+`
        </div>

          `);
      }
      // const mainSelectorCell =  '.main-cell-'+id_cell+`-`+idCellMenu;
      // s(mainSelectorCell)['data-id'] = 'menu-storage-'+idCellMenu;
      // console.log(s(mainSelectorCell)['data-id']);
    }

    let onClick = true;
    new Sortable(s('.'+window.underpost.intervals[ MainInput ? idExtern : "processGrid" ].idGrid+'-content'), {
        // swap: true,
        animation: 150,
        group: (MainInput ? MainInput.sortableGroup : 'menu-storage' ),
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
