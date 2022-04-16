
import { View } from '../mods/view.js';
import { Menu } from '../mods/menu.js';

window.underpost.view = () =>
new View(() => {
  new Menu();
});

window.underpost.view();
