

class UnderpostConfig {
  constructor(){

    append('render', spr('<br>', 3));

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
      htmls('render', '');
      window.underpost.view();
    }


    COLOR_ATTR.map( optionColor => {

      append('render', `

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


    append('render', `
    <div class='inl' style='margin: 5px;'>
        `+renderLang({
          es: 'Temas',
          en: 'Themes'
        })+`
    </div>
    `)
    append('render', '<themes class="in"></themes>');
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
          append('.'+idTheme, `

              <div class='in fll' style='
              height: 100%;
              width: `+(100/totalThemes)+`%;
              background: `+theme_[optionColor]+`;
              '>
              </div>

          `);
      });
      s('.'+idTheme).onclick = () =>
      renderTheme({type: 'theme', theme: theme_})
    }


    append('render', `

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

    append('render', spr('<br>', 3));

  }
}


export { UnderpostConfig };
