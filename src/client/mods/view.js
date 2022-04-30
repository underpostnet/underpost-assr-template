
import { Style } from './style.js';
import { UnderpostSW } from './underpost-sw.js';
import { Notifi } from './notifi.js';
import { Footer } from './footer.js';
import { Menu } from './menu.js';

class View {
  constructor(UriView, mods){

    // view group paths
    window.underpost.paths = [
      {
        path: '/editor',
        name: renderLang({es: 'Editor', en: 'Editor'}),
        icon: '<i class="fas fa-edit"></i>'
      },
      {
        path: '/user',
        name: renderLang({es: 'Usuario', en: 'User'}),
        icon: '<i class="fas fa-user"></i>'
      },
      {
        path: '/keys',
        name: renderLang({es: 'Llaves', en: 'Keys'}),
        icon: '<i class="fas fa-key"></i>'
      },
      {
        path: '/config',
        name: renderLang({es: 'Configuración', en: 'Setting'}),
        icon: '<i class="fas fa-cog"></i>'
      }
    ];

    // Spinner Controller
    window.underpost.outSpinner ?
    window.underpost.outSpinner = undefined :
    s('.loading').style.display = 'block';

    // uri controller
    if(UriView){
      setURI(UriView);
    }

    // Clear Document
    htmls('render', '');

    // Execute rendering in instruction order
    new Style();
    new UnderpostSW();
    new Notifi();
    new Menu();
    mods(UriView == undefined ? getUriPath() : UriView);
    new Footer();

    // Cumulative Layout Shift Controller
    setTimeout(() =>
      {
        s('html').style.overflow = 'auto';
        s('.loading').style.display = 'none';
      }
    , window.underpost.viewDelay);

  }
}

// Browser and App
// navigator button controller
window.onpopstate = e =>
window.underpost.view();

export { View };
