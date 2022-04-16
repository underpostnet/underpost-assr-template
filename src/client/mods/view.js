
import { Style } from './style.js';
import { UnderpostSW } from './underpost-sw.js';
import { Notifi } from './notifi.js';
import { NavBar } from './nav-bar.js';

class View {
  constructor(mods){
    // Execute rendering in instruction order
    window.underpost.outSpinner ?
    window.underpost.outSpinner = undefined :
    s('.loading').style.display = 'block';
    htmls('render', '');
    new Style();
    new UnderpostSW();
    new Notifi();
    mods();
    new NavBar();
    // Cumulative Layout Shift Controller
    setTimeout(() =>
      s('.loading').style.display = 'none'
    , window.underpost.viewDelay);
  }
}

export { View };
