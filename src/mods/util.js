
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class UtilMod {
  initDataTools(app){
    app.util = {
      buildUrl: uri =>
            app.data.server.visiblePort ?
            app.data.server.host + ':' + app.data.server.httpPort + util.uriValidator(uri):
            app.data.server.host + util.uriValidator(uri)
    };
    app.dev = process.argv.slice(2)[0]=='d' ? true: false;
    console.log(process.argv);
  }
}

export { UtilMod };
