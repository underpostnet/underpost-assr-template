
'use strict';

import expressUserAgent from 'express-useragent';
import responseTime from 'response-time';
import cors from 'cors';
import express from 'express';
import colors from 'colors/safe.js';

class Middlewares{
  constructor(MainProcess){

    MainProcess.app.use(expressUserAgent.express());

    MainProcess.app.use(express.json({limit: MainProcess.data.server.limitSizeJSON}));
    MainProcess.app.use(express.urlencoded({limit: MainProcess.data.server.limitSizeJSON, extended: true}));

    MainProcess.app.use(cors({
      origin: [MainProcess.util.buildUrl()]
    }));

    MainProcess.app.use(responseTime( (req, res, time) => {
      MainProcess.data.server.log_all_ms_response?
      console.log(req.originalUrl.padStart(30," ")+' '+colors.green(time+'ms'))
      :req.originalUrl.split('.')[1]==undefined ?
      console.log((' '+colors.yellow('END-REQUEST')+' ['+req.originalUrl)+']: '+colors.green(time+'ms'))
      :null;
    }));

  }
}

export { Middlewares };
