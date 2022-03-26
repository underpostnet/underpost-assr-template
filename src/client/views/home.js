

import { Base } from '../mods/base.js';
import { LogIn } from '../mods/login.js';
import { Style } from '../mods/style.js';
import { Editor } from '../mods/editor.js';

class Home {
  constructor(){

    append('body', `



    <br>
    <br>
    <img class='in' src='/img/underpost-social.jpg' style='width: 300px; margin: auto; height: auto;'>

    <br>
    <br>


    `);

    new Base();
    new Style();
    new LogIn();
    new Editor();

  }
}

new Home();
