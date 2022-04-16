
import { View } from '../mods/view.js';
import { Editor } from '../mods/editor.js';

window.underpost.view = () =>
new View(() => {
  new Editor();
});

window.underpost.view();
