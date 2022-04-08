
import { Style } from '../mods/style.js';
import { UnderpostSW } from '../mods/underpost-sw.js';
import { Notifi } from '../mods/notifi.js';
import { KeysTable } from '../mods/keys-table.js';
import { NavBar } from '../mods/nav-bar.js';

class View {
  constructor(){
    // Execute rendering in instruction order
    new Style();
    new UnderpostSW();
    new Notifi();
    new KeysTable();
    new NavBar();
    // Cumulative Layout Shift Controller
    setTimeout( () => {
      s('.loading').style.display = 'none';
      s('render').style.display = 'block';
    }, 200);
  }
}

new View();
