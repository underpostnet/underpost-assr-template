

import { Test } from '../mods/test.js';
import { UnderpostQuillEditor } from '../mods/underpost-quill-editor.js';
import { UnderpostInteract } from '../mods/underpost-interact.js';


class Home {

  constructor(){

    append('body', `
        <div class='in editor-content'>
            test
        </div>
    `);

    new Test({
      divContent: 'body'
    });


    new UnderpostQuillEditor({
        divContent: '.editor-content',
        style:  {
            tr: `{
              background: #cfcfcf;
            }`,
            td: `{
              min-width: 100px;
              border: 1px solid black;
            }`,
            ql_editor: `{
              min-height: 600px;
              border: 2px solid red;
              background: #ebeceb;
              overflow: hidden !important;
            }`,
            standalone_container: `{
              background: #c7c9c7;
              color: black;
              border: 2px solid yellow;
              max-width: 600px;
            }`,
        },
        fonts: ['gothic', 'retro-font'],
        text_sizes: range(1, 80).map(size_=>size_+'px'),
        scientific_tools: false,
        image: false,
        video: false,
        table: true
    });


    new UnderpostInteract( {
      type: 'quill'
    });

  }

}

new Home();
