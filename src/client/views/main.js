
import { View } from '../mods/view.js';
import { KeysTable } from '../mods/keys-table.js';
import { UnderpostConfig } from '../mods/config.js';
import { Editor } from '../mods/editor.js';
import { LogIn } from '../mods/login.js';

window.underpost.view = UriView =>
new View( UriView, PATH => {
  switch (PATH) {
    case '/':
      break;
    case '/editor':
      new Editor();
      break;
    case '/user':
      new LogIn();
      break;
    case '/keys':
      new Editor();
      new KeysTable();
      new UnderpostConfig();
      break;
    case '/config':
      new UnderpostConfig();
      break;
    default:
      location.href = UriView;
  }
});

window.underpost.view();
