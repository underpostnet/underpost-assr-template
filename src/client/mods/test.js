
class Test {

  constructor(){

      append('body', `
        <div class='inl' style='border: 2px solid red; padding: 10px; margin: 5px;'>
            <img src='/img/underpost-social.jpg'>
            <br>
            <span style='font-family: gothic'>Hello World</span>
            <br>
                <div class='inl'
                style='
                margin: 5px;
                padding: 5px;
                border: 3px solid yellow;
                font-size: 60px;'>
                <i class='fas fa-lock'></i> <br> <i class="fab fa-bitcoin"></i>
                </div>

        </div>
      `);

      append('body', renderInput({
    		underpostClass: 'inl',
    		id_content_input: 'a1',
    		id_input: 'a2',
    		type: 'text',
    		required: true,
    		style_content_input: '',
    		style_input: '',
    		style_label: '',
    		style_outline: true,
    		style_placeholder: '',
    		textarea: false,
    		active_label: false,
    		initLabelPos: 15,
    		endLabelPos: -30,
    		text_label: 'input test',
    		tag_label: 'a3',
    		fnOnClick: async () => {
    			console.log('click input');
    		},
    		value: ``,
    		topContent: '',
    		botContent: '',
    		placeholder: 'input test'
    	}));

  }

}

export { Test };
