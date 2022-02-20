
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Network {

  constructor(MainProcess){
      this.getPaths(MainProcess, '/network/get-paths');
  }

  getPaths(MainProcess, uri){
    MainProcess.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'Network' } );
      try {
        const path = MainProcess.data.network.consolePath+'/src/data';
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify(fs.existsSync( navi(MainProcess.path) ) ?
            (()=>{
              let PathsNetwork = [];
              files.readRecursive(path,
              dir => PathsNetwork.push(dir));
              console.log(colors.yellow(' Network > get paths >'));
              console.log(PathsNetwork);
              return PathsNetwork;
            })():
            (()=>{
              console.log(colors.red(' Network > no console data available'));
              return [];
            })()
        ));
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
