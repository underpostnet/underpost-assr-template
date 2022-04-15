


class NavBar {

  constructor(){

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
            }
            .btn-nav:hover {
                bottom: 5px;
                right: 5px;
                width: 25px;
                height: 25px;
                font-size: 30px;
             }

        </style>

                <div class='fix btn-underpost btn-nav btn-nav-up' style='bottom: 3px; left: 3px; display: none'>

                      <div class='abs center'>
                            <i class="fas fa-arrow-up"></i>
                      </div>

                </div>

                <div class='fix btn-underpost btn-nav btn-nav-home' style='bottom: 3px; right: 3px;'>

                </div>




    `);

        append('.btn-nav-home', renderTooltipNavBar(
          'tooltip-btn-nav-home',
          '<i class="fas fa-th abs center"></i>',
          renderLang({es: 'Home', en: 'Home'})
        ));

        s('.btn-nav-home').onclick = () => {
          location.href = '/';
        };

        s('.btn-nav-up').onclick = () => {
          s('html').scrollTop = s('html').offsetTop;
        };

        mod_scroll.init(s('body'), false, scroll => {
          if(scroll>300 && s('.btn-nav-up').style.display == 'none'){
            fadeIn(s('.btn-nav-up'));
          }else if(scroll <= 300 &&  s('.btn-nav-up').style.display == 'block' ){
            fadeOut(s('.btn-nav-up'));
          }
        });


        append('render', `




                <br><br>
                `+spr(' ', 5)+`<a href='https://underpost.net' alt='underpost.net' >Powered By UNDERpost.net</a>
                <br><br>






        `);


  }
}


export { NavBar };
