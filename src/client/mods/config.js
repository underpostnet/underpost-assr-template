

import '/lib/jscolor.min.js';


class UnderpostConfig {
  constructor(){


    const COLOR_ATTR = [
      "background",
      "text",
      "sub_background",
      "sub_text",
      "section_btn",
      "section_btn_color",
      "mark"
    ];

    COLOR_ATTR.map( optionColor => {

      append('render', `

                <div class='inl' style='margin: 5px;'>
                    `+cap(optionColor.replaceAll('_', ' '))+`
                </div>
              <br>
              `+renderInput({
                underpostClass: 'in',
                id_content_input: 'a1',
                id_input: optionColor,
                type: 'color',
                required: true,
                style_content_input: '',
                style_input: 'margin: 5px;',
                style_label: '',
                style_outline: true,
                style_placeholder: '',
                textarea: false,
                active_label: false,
                initLabelPos: 3,
                endLabelPos: -25,
                text_label: 'Title',
                tag_label: 'a3',
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
    });


    append('render', `

        <br>
        <div class='inl btn-underpost gen-theme'>

            `+renderLang({
              en: 'Generate',
              es: 'Generar'
            })+`

        </div>

        <div class='inl btn-underpost res-theme'>

            `+renderLang({
              en: 'Restore',
              es: 'Restaurar'
            })+`

        </div>

        <div class='inl btn-underpost rand-theme'>

            `+renderLang({
              en: 'Random',
              es: 'Aleatorio'
            })+`

        </div>

    `);


    s('.gen-theme').onclick = () => {
        window.underpost.theme = newInstance(window.underpost.defaultTheme);
        COLOR_ATTR.map( optionColor => {
          console.log(s('.'+optionColor).value);
          window.underpost.theme[optionColor] = s('.'+optionColor).value;
        });
        localStorage.setItem("theme", JSON.stringify(window.underpost.theme));
        console.warn('theme -> set theme ', window.underpost.theme);
        htmls('render', '');
        window.underpost.view();
    };

    s('.rand-theme').onclick = () => {
        window.underpost.theme = newInstance(window.underpost.defaultTheme);
        COLOR_ATTR.map( optionColor => {
          console.log(s('.'+optionColor).value);
          window.underpost.theme[optionColor] = getRandomColor();
        });
        localStorage.setItem("theme", JSON.stringify(window.underpost.theme));
        console.warn('theme -> set theme ', window.underpost.theme);
        htmls('render', '');
        window.underpost.view();
    };

    s('.res-theme').onclick = () => {
        window.underpost.theme = newInstance(window.underpost.defaultTheme);
        localStorage.setItem("theme", JSON.stringify(window.underpost.theme));
        console.warn('theme -> set theme ', window.underpost.theme);
        htmls('render', '');
        window.underpost.view();
    };

  }
}


export { UnderpostConfig };
