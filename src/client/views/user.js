
import { View } from '../mods/view.js';
import { LogIn } from '../mods/login.js';

window.underpost.view = () =>
new View(() => {
  new LogIn();
});

window.underpost.view();
