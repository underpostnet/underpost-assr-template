
import { View } from '../mods/view.js';
import { UnderpostConfig } from '../mods/config.js';

window.underpost.view = () =>
new View(() => {
  new UnderpostConfig();
});

window.underpost.view();
