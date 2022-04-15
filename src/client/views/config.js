
import { Style } from '../mods/style.js';
import { UnderpostSW } from '../mods/underpost-sw.js';
import { Notifi } from '../mods/notifi.js';
import { UnderpostConfig } from '../mods/config.js';
import { NavBar } from '../mods/nav-bar.js';

window.underpost.view = function(){
  // Execute rendering in instruction order
  htmls('render', '');
  new Style();
  new UnderpostSW();
  new Notifi();
  new UnderpostConfig();
  new NavBar();
  // Cumulative Layout Shift Controller
  setTimeout( () => {
    s('.loading').style.display = 'none';
    s('render').style.display = 'block';
  }, 200);
}

window.underpost.view();
