
'use strict';

import colors from 'colors/safe.js';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Errors {
  constructor(MainProcess){

    // return res.status(num_error).redirect(301, '/error/'+num_error);

    MainProcess.app.use( (req, res, next) => {
      for(let num_error of util.range(400, 499)){
        num_error == 400 ? num_error = 404 : null;
        return res.status(num_error).end('Error: '+num_error);
      }
    });

    MainProcess.app.use( (req, res, next) => {
       for(let num_error of util.range(500, 599)){
         return res.status(num_error).end('Error: '+num_error);
       }
    });

  }
}

export { Errors };
