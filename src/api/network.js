
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Network {

  constructor(MainProcess){
      this.nameModule = 'Network';
      this.consoleFolderName = '/underpost-console';
      this.consoleAbsolutePath = 'c:/dd';
      this.consoleRelativePath = '../..';
      this.getKeys(MainProcess, '/network/keys');
  }

  getKeys(MainProcess, uri){
    MainProcess.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try {
        const uriPathKeys = '/data/network/keys';
        const pathReadKeys = this.consoleRelativePath+this.consoleFolderName+uriPathKeys;
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end((()=>{
          let PathsKeys = [];
          files.readRecursive(pathReadKeys,
          dir => PathsKeys.push(dir));
          PathsKeys = PathsKeys.map(x=>x.split(uriPathKeys)[1]);
          console.log(colors.yellow(' Network > get paths >'));
          console.log(PathsKeys);
          return JSON.stringify(PathsKeys);
        })());
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end('Error 500');
      }
    });
  }

}

export { Network };
