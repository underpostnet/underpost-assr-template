
import { Rest } from '/mods/rest.js';

class LogIn {

  constructor(){

    append('render', `



    <br>
    <br>
    <img class='in' alt='underpost.net' src='`+window.underpost.assets.socialImg+`' style='width: 300px; margin: auto; height: auto;'>

    <br>
    <br>


    `);

    append('render', `



        <br>
        <br>

        <form class='in signin-form' style='max-width: 500px; margin: auto; '>




        </form>




    `);

    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: makeid(5),
      id_input: 'form-input-email',
      type: 'text',
      required: true,
      style_content_input: '',
      style_input: window.underpost.styles.input.style_input,
      style_label: window.underpost.styles.input.style_label,
      style_outline: true,
      style_placeholder: window.underpost.styles.input.style_placeholder,
      textarea: false,
      username: true,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: 'Email',
      tag_label: makeid(5),
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent: window.underpost.styles.input.botContent,
      placeholder: ''
    }));


    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: makeid(5),
      id_input: 'form-input-password',
      type: 'password',
      required: true,
      style_content_input: '',
      style_input: window.underpost.styles.input.style_input,
      style_label: window.underpost.styles.input.style_label,
      style_outline: true,
      style_placeholder: window.underpost.styles.input.style_placeholder,
      textarea: false,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: renderLang({en: 'Password', es: 'Contraseña'}),
      tag_label: makeid(5),
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent: window.underpost.styles.input.botContent,
      placeholder: ''
    }));

    append('.signin-form', renderInput({
      underpostClass: 'in',
      id_content_input: makeid(5),
      id_input: 'form-input-password-repeat',
      type: 'password',
      required: true,
      style_content_input: '',
      style_input: window.underpost.styles.input.style_input,
      style_label: window.underpost.styles.input.style_label,
      style_outline: true,
      style_placeholder: window.underpost.styles.input.style_placeholder,
      textarea: false,
      active_label: true,
      initLabelPos: 5,
      endLabelPos: -20,
      text_label: renderLang({en: 'Repeat Password', es: 'Repetir Contraseña'}),
      tag_label: makeid(5),
      fnOnClick: async () => {
        console.log('click input');
      },
      value: ``,
      topContent: '',
      botContent: window.underpost.styles.input.botContent,
      placeholder: ''
    }));


      append('.signin-form', `

          <div class='in' style='text-align: center;'>

                <div class='inl btn-underpost btn-signin' style='margin: 10px;'>
                    `+renderLang({en: 'SIGN IN', es: 'INICIAR SESIÓN'})+`
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







    append('render', spr('<br>', 5));

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
