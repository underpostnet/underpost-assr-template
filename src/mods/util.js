
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class UtilMod {
  constructor(MainProcess){
    MainProcess.util = {
      buildUrl: uri =>
            MainProcess.data.server.visiblePort ?
            MainProcess.data.server.host + ':' + MainProcess.data.server.httpPort + util.uriValidator(uri):
            MainProcess.data.server.host + util.uriValidator(uri)
    };
    MainProcess.dev = process.argv.slice(2)[0]=='d' ? true: false;
  }
}

export { UtilMod };
