
import { Style } from '../mods/style.js';
import { UnderpostSW } from '../mods/underpost-sw.js';
import { Notifi } from '../mods/notifi.js';
import { LogIn } from '../mods/login.js';
import { NavBar } from '../mods/nav-bar.js';

window.underpost.view = function(){
  // Execute rendering in instruction order
  new Style();
  new UnderpostSW();
  new Notifi();
  new LogIn();
  new NavBar();
  // Cumulative Layout Shift Controller
  setTimeout( () => {
    s('.loading').style.display = 'none';
    s('render').style.display = 'block';
  }, 200);
}

window.underpost.view();
