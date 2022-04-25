

class UnderpostConfig {
  constructor(){

    append('render', spr('<br>', 3));

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    const renderHeaderAcc = obj => {
      append('render', renderAccordion({
        id: obj.idAcc,
        open: window.underpost[obj.idAcc] ? true : false,
        classHeader: 'btn-underpost',
        styleIcon: `
          font-size: 30px;
          transition: .3s;
        `,
        width: 80,
        height: '0.1px',
        contentHeader: `
          <div class='abs center'>
            `+obj.text+`
          </div>
        `,
        onOpen: () => {
          obj.open();
          window.underpost[obj.idAcc] = true;
        },
        onClose: () => {
          obj.close();
          window.underpost[obj.idAcc] = undefined;
        }
      }));
    };

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    const configColorID = 'config-colors';
    const configThemeID = 'config-themes';
    const configFontsID =  'config-fonts';

    const exclusiveAcc = exep => {

      exep != configColorID && window.underpost[configColorID] ?
      s('.header-'+configColorID).click(): null;

      exep != configThemeID && window.underpost[configThemeID] ?
      s('.header-'+configThemeID).click(): null;

      exep != configFontsID && window.underpost[configFontsID] ?
      s('.header-'+configFontsID).click(): null;

    };

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    renderHeaderAcc({
      idAcc: configColorID,
      text: renderLang({
        es: 'Colores de la Interfas',
        en: 'Interface Colors'
      }),
      close: () => {
        fadeOut(s('config-colors-theme'));
      },
      open: () => {
        fadeIn(s('config-colors-theme'));
        exclusiveAcc(configColorID);
      }
    });


    const COLOR_ATTR = [
      "background",
      "text",
      "sub_background",
      "sub_text",
      "section_btn",
      "section_btn_color",
      "mark"
    ];

    const renderTheme = obj_ => {
      window.underpost.theme = newInstance(window.underpost.themes[0]);
      if(obj_){
        if(obj_.type === 'random'){
          COLOR_ATTR.map( optionColor => {
            console.log(s('.'+optionColor).value);
            window.underpost.theme[optionColor] = getRandomColor();
          });
          console.warn('theme -> set random theme ', window.underpost.theme);
        }
        if(obj_.type === 'theme'){
          window.underpost.theme = obj_.theme;
          console.warn('theme -> set theme ', window.underpost.theme);
        }
      }else{
        COLOR_ATTR.map( optionColor => {
          console.log(s('.'+optionColor).value);
          window.underpost.theme[optionColor] = s('.'+optionColor).value;
        });
        console.warn('theme -> set custom theme ', window.underpost.theme);
      }
      localStorage.setItem("theme", JSON.stringify(window.underpost.theme));
      window.underpost.outSpinner = true;
      window.underpost.view();
    }

    append('render', `
        <config-colors-theme style='display: none'></config-colors-theme>
    `);

    COLOR_ATTR.map( optionColor => {

      append('config-colors-theme', `

                <div class='inl' style='margin: 5px;'>
                    `+cap(optionColor.replaceAll('_', ' '))+`
                </div>
              <br>
              `+renderInput({
                underpostClass: 'in',
                id_content_input: makeid(5),
                id_input: optionColor,
                type: 'color',
                required: true,
                style_content_input: '',
                style_input: 'margin: 5px; '+window.underpost.theme.cursorPointer,
                style_label: '',
                style_outline: true,
                style_placeholder: '',
                textarea: false,
                active_label: false,
                initLabelPos: 3,
                endLabelPos: -25,
                text_label: 'Color',
                tag_label:  makeid(5),
                fnOnClick: async () => {
                  console.log('click input');
                },
                value: window.underpost.theme[optionColor],
                topContent: '',
                botContent: '',
                placeholder: renderLang({en: 'Color', es: 'Color' })
              })+`

              <br>


      `);

      s('.'+optionColor).onblur = () => {
        console.warn('onchangue color', optionColor);
        renderTheme();
      }
    });

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    renderHeaderAcc({
      idAcc: configThemeID,
      text: renderLang({
        es: 'Temas',
        en: 'Themes'
      }),
      close: () => {
        fadeOut(s('themes'));
      },
      open: () => {
        fadeIn(s('themes'));
        exclusiveAcc(configThemeID);
      }
    });

    append('render', '<themes class="in" style="display: none"></themes>');
    for(let theme_ of window.underpost.themes){
      const idTheme = makeid(4);
      append('themes', `<div class='inl `+idTheme+` btn-underpost' style='
      width: 100px;
      height: 50px;
      margin: 5px;
      '>


      </div>`);
      const totalThemes = l(COLOR_ATTR);
      COLOR_ATTR.map( (optionColor, i, a) => {
        if(i==0){
          append('.'+idTheme, `

              <div class='in fll' style='
              height: 100%;
              width: 50%;
              background: `+theme_[optionColor]+`;
              '>
              </div>

          `);
        }else{
          append('.'+idTheme, `

              <div class='in fll' style='
              height: 100%;
              width: `+(50/totalThemes)+`%;
              background: `+theme_[optionColor]+`;
              '>
              </div>

          `);
        }
      });
      s('.'+idTheme).onclick = () =>
      renderTheme({type: 'theme', theme: theme_})
    }


    append('themes', `

        <br>

        <div class='inl btn-underpost rand-theme'>

            `+renderLang({
              en: 'Random',
              es: 'Aleatorio'
            })+`

        </div>

    `);

    s('.rand-theme').onclick = () => renderTheme({type: 'random'});

    // window.underpost.intervalTheme != undefined ?
    // clearInterval(window.underpost.intervalTheme):null;
    // window.underpost.intervalTheme =
    // setInterval(()=>renderTheme(), 500);

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    renderHeaderAcc({
      idAcc: configFontsID,
      text: renderLang({
        es: 'Fuentes de Letra',
        en: 'Fonts'
      }),
      close: () => {
        fadeOut(s('config-fonts-content'));
      },
      open: () => {
        fadeIn(s('config-fonts-content'));
        exclusiveAcc(configFontsID);
      }
    });

    append('render', `
      <config-fonts-content class="in" style="display: none">
          `+window.underpost.fonts.map( font_ => {

            let idFont = makeid(4);
            setTimeout( () => {
              s('.'+idFont).onclick = () => {
                localStorage.setItem("font", font_);
                window.underpost.outSpinner = true;
                window.underpost.view();
              };
            }, 0);

            return `

                <div class='inl btn-underpost `+idFont+`' style='font-family: `+font_+`'>
                      `+font_+`
                </div>

              `;
          }).join('')+`
      </config-fonts-content>
    `);

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    append('render', spr('<br>', 3));






    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

  }
}


export { UnderpostConfig };
