
import { View } from '../mods/view.js';
import { KeysTable } from '../mods/keys-table.js';
import { UnderpostConfig } from '../mods/config.js';
import { Editor } from '../mods/editor.js';

window.underpost.view = () =>
new View(() => {
  new Editor();
  new KeysTable();
  new UnderpostConfig();
});

window.underpost.view();
