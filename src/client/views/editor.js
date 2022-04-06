
import { Style } from '../mods/style.js';
import { UnderpostSW } from '../mods/underpost-sw.js';
import { Notifi } from '../mods/notifi.js';
import { Editor } from '../mods/editor.js';
import { NavBar } from '../mods/nav-bar.js';

class View {
  constructor(){
    // Execute rendering in instruction order
    new Style();
    new UnderpostSW();
    new Notifi();
    new Editor();
    new NavBar();
    // Cumulative Layout Shift Controller
    setTimeout( () => {
      s('a.ql-action').href = '#';
      s('a.ql-remove').href = '#';
      s('.loading').style.display = 'none';
      s('render').style.display = 'block';
    }, 200);
  }
}

new View();
