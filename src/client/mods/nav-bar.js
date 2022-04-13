


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


    append('body', `

        <style>
            .underpost-nav-bar {
              background: none; /* #131313 */
              height: 40px;
              width: 100%;
              bottom: 0px;
            }
            .btn-nav {
              bottom: 3px;
              right: 3px;
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
        <!--
        <div class='fix underpost-nav-bar'>
        </div>
        -->
                <a href='/' alt='home'>
                  <div class='fix btn-underpost btn-nav btn-nav-home'>

                  </div>
                </a>




    `);

        append('.btn-nav-home', renderTooltipNavBar(
          'tooltip-btn-nav-home',
          '<i class="fas fa-th abs center"></i>',
          renderLang({es: 'Home', en: 'Home'})
        ));

  }
}


export { NavBar };
