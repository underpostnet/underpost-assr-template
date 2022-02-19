
'use strict';

import colors from 'colors/safe.js';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class ApiTest {

  constructor(obj){
    // init instances
    this.app = obj.app;
    this.data = obj.data;
    // router instances
    this.postTest('/test');
  }

  postTest(uri){
    this.app.post(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'ApiTest' } );
      try {
        console.log(colors.yellow(' BODY -> '));
        console.log(colors.green(util.jsonSave(req.body)));
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+this.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify(req.body));
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

export { ApiTest };
