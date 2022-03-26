
import { Rest } from '/mods/rest.js';

class LogIn {

  constructor(){

    append('body', `



        <br>
        <br>

        <form class='in signin-form' style='max-width: 500px; margin: auto; '>




        </form>




    `);

    const style_input = `

        padding: 12px 15px;
        font-family: retro-font;
        font-size: 14px;
        background: #1d1d1c;
        color: white;
        margin: 10px 10px 30px 10px;

    `;

    const style_label = `

        color: red;
        font-size: 12px;
        left: 15px;

    `;

    const style_placeholder = `

        font-style: italic;

    `;

    const botContent = '';

    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: 'a1-1',
      id_input: 'form-input-email',
      type: 'text',
      required: true,
      style_content_input: '',
      style_input,
      style_label,
      style_outline: true,
      style_placeholder,
      textarea: false,
      username: true,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: 'Email',
      tag_label: 'a1-2',
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent,
      placeholder: ''
    }));


    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: 'a3-1',
      id_input: 'form-input-password',
      type: 'password',
      required: true,
      style_content_input: '',
      style_input,
      style_label,
      style_outline: true,
      style_placeholder,
      textarea: false,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: renderLang({en: 'Password', es: 'Contraseña'}),
      tag_label: 'a3-2',
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent,
      placeholder: ''
    }));

    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: 'a4-1',
      id_input: 'form-input-password-repeat',
      type: 'password',
      required: true,
      style_content_input: '',
      style_input,
      style_label,
      style_outline: true,
      style_placeholder,
      textarea: false,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: renderLang({en: 'Repeat Password', es: 'Repetir Contraseña'}),
      tag_label: 'a4-2',
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent,
      placeholder: ''
    }));


      append('.signin-form', `

          <div class='in' style='text-align: center;'>

                <div class='inl btn-underpost btn-signin' style='margin: 10px;'>
                    `+renderLang({es: 'SIGN IN', es: 'INICIAR SESIÓN'})+`
                </div>

          </div>


      `);

      s('.btn-signin').onclick = () => {

        if(s('.form-input-password').value==s('.form-input-password-repeat').value){
          console.log(jsonSave({
            email: s('.form-input-email').value,
            password: s('.form-input-password').value
          }));
        }


      };







    append('body', spr('<br>', 5));

    s('html').onkeydown = () => {
    		switch (window.event.keyCode) {
    			case 13:
            s('.btn-signin').click();
    				break;
    			default:
    		}
    };



  }
}


export { LogIn };
