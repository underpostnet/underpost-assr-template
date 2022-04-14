

import '/lib/jscolor.min.js';


class UnderpostConfig {
  constructor(){

    append('render', `





            `+renderColorPicker({
              class: 'input-color in-outline',
              style: style_input,
              value: 'rgba(255, 0, 0, 1)',
            })+`

            <br>
          <div class='inl btn-underpost get-color'>
            `+renderLang({es: 'guardar', en: 'save'})+`
          </div>


    `);

    s('.get-color').onclick = () => console.log(s('.input-color').value);













  }
}


export { UnderpostConfig };
