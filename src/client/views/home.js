

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
      divContent: '.editor-content'
    });
    new UnderpostInteract( {
      type: 'quill'
    });

  }

}

new Home();
