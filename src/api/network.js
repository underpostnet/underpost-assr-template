
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Network {

  constructor(obj){
    // init instances
    this.data = obj.data;
    this.path = obj.data.network.consolePath+'/src/data';
    this.app = obj.app;
    // router instances
    this.getPaths('/network/get-paths');
  }

  getPaths(uri){
    this.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'Network' } );
      try {
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+this.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify(fs.existsSync( navi(this.path) ) ?
            (()=>{
              let PathsNetwork = [];
              files.readRecursive(this.path,
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
          'Content-Type': ('application/json; charset='+this.data.charset),
          'Content-Language': '*'
        });
        return res.end('Error 500');
      }
    });
  }

}

export { Network };
