

import { Base } from '../mods/base.js';
import { LogIn } from '../mods/login.js';
import { Style } from '../mods/style.js';
import { Editor } from '../mods/editor.js';
import { UnderpostSW } from '../mods/underpost-sw.js';
import { Menu } from '../mods/menu.js';

class Home {
  constructor(){


        new Style();
        new UnderpostSW();
        new Base();
        new Menu();
        /*
        new Editor();

    append('render', `



    <br>
    <br>
    <img class='in' alt='underpost.net' src='`+IMG_UNDERPOST_SOCIAL+`' style='width: 300px; margin: auto; height: auto;'>

    <br>
    <br>


    `);

    new LogIn();
    */

    setTimeout( () => {
      // s('a.ql-action').href = '#';
      // s('a.ql-remove').href = '#';
      s('.loading').style.display = 'none';
      s('render').style.display = 'block';
    }, 200);

  }
}

new Home();
