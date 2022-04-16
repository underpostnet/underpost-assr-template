
import { View } from '../mods/view.js';
import { KeysTable } from '../mods/keys-table.js';

window.underpost.view = () =>
new View(() => {
  new KeysTable();
});

window.underpost.view();
