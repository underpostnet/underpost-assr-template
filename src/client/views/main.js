

import { KeysTable } from '../mods/keys-table.js';
import { UnderpostConfig } from '../mods/config.js';
import { Editor } from '../mods/editor.js';
import { LogIn } from '../mods/login.js';

import { MainProcess } from '../main.js';

window.underpost.view = UriView =>
new MainProcess( UriView, PATH => {

  append('render', `

      <style>
      @media only screen and (max-width: 600px) {
        ._col { width: 100%; }
      }
      @media only screen and (min-width: 600px) {
        ._col { width: 50%; }
      }
      </style>

      <div class='fl'>
          <div class='in fll _col col-0'>
          </div>
          <div class='in fll _col col-1'>
          </div>
      </div>
      <div class='fl'>
          <div class='in fll _col col-2'>
          </div>
          <div class='in fll _col col-3'>
          </div>
      </div>

  `);

  switch (PATH) {
    case '/':
      break;
    case '/editor':
      new Editor();
      break;
    case '/user':
      new LogIn();
      new UnderpostConfig();
      break;
    case '/keys':
      new Editor({ MainRender: '.col-0' });
      new KeysTable({ MainRender: '.col-1' });
      new UnderpostConfig({ MainRender: '.col-2' });
      new LogIn({ MainRender: '.col-3' });
      break;
    case '/config':
      new UnderpostConfig();
      break;
    default:
      location.href = UriView;
  }
});

window.underpost.view();
