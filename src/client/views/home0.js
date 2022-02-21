import { Test } from '../mods/test.js';
import { UnderpostQuillEditor } from '../mods/underpost-quill-editor.js';
import { UnderpostInteract } from '../mods/underpost-interact.js';
import { Table } from '../mods/table.js';
import { Rest } from '../mods/rest.js';


class Home {


  constructor(){

    const quillPlaceHolder = 'Compose an epic...';
    new UnderpostQuillEditor({
        divContent: 'body',
        style:  {
            tr: `{
              background: #cfcfcf;
            }`,
            td: `{
              min-width: 100px;
              border: 1px solid black;
            }`,
            ql_editor: `{
              min-height: 300px;
              border: 2px solid red;
              background: #ebeceb;
              overflow: hidden !important;
              font-size: 20px;
            }`,
            standalone_container: `{
              background: #c7c9c7;
              color: black;
              border: 2px solid yellow;
            }`,
        },
        fonts: ['gothic', 'retro-font'],
        placeholder: quillPlaceHolder,
        initContent: '',
        text_sizes: range(1, 80).filter(size_=>size_%5==0).map(size_=>size_+'px'),
        scientific_tools: true,
        image: true,
        video: true,
        table: true,
        interactQuill: new UnderpostInteract( {
          type: 'quill'
        })
    });



    append('body', `


        <style>

              .btn-send-underpost {

                transition: .3s;
                padding: 15px;
                margin: 5px;
                background: rgba(212, 0, 0, 0.8);
                cursor: pointer;
                font-size: 13px;
                font-family: retro-font;

              }
              .btn-send-underpost:hover {
                background: rgba(212, 0, 0, 1);
              }
        </style>

        <div class='inl btn-send-underpost'>

              SEND

        </div>


    `);


    const fontSizeNotifi = 20;
    notifi.load({
    			 AttrRender: {
    				 error: `

    							<i class="fas fa-times" style='font-size: `+fontSizeNotifi+`px;'></i>

    				 `,
    				 success: `

    						<i class="fas fa-check"></i>

    				 `
    			 },
    			 style: {
    				 notifiValidator: `
    				 border-radius: 10px;
    				 /* border: 2px solid yellow; */
    				 color: white;
    				 font-size: `+fontSizeNotifi+`px;
    				 z-index: 9999;
    				 height: 50px;
    				 transform: translate(-50%, 0);
             bottom: 10px;
    				 left: 50%;
    				 width: 300px;
    				 `,
    				 notifiValidator_c1: `
    				 width: 80px;
    				 height: 100%;
    				 /* border: 2px solid blue; */
    				 top: 0%;
    				 left: 0%;
    				 `,
    				 notifiValidator_c2: `
    				 height: 100%;
    				 /* border: 2px solid blue; */
    				 top: 0%;
    				 left: 80px;
    				 width: 220px;
    				 `

    			 }
    		 });





  }

}

new Home();
