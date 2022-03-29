
'use strict';

import expressUserAgent from 'express-useragent';
import responseTime from 'response-time';
import cors from 'cors';
import express from 'express';
import colors from 'colors/safe.js';
import compression from 'compression';

class Middlewares{
  constructor(MainProcess){

    MainProcess.app.use(expressUserAgent.express());

    MainProcess.app.use(express.json({limit: MainProcess.data.server.limitSizeJSON}));
    MainProcess.app.use(express.urlencoded({limit: MainProcess.data.server.limitSizeJSON, extended: true}));

    MainProcess.app.use(cors({
      origin: [MainProcess.util.buildUrl()]
    }));
    /*

    info (100–199),
    success (200–299),
    redirect (300–399),
    client (400–499),
    server (500–599).

    */
    MainProcess.app.use(responseTime( (req, res, time) => {
      MainProcess.data.server.log_all_ms_response?
      console.log(req.originalUrl.padStart(30," ")+' '+colors.green(time+'ms'))
      :req.originalUrl.split('.')[1]==undefined ?
      console.log((' '+colors.yellow('END-REQUEST')+' ['
      +(res.statusCode>=400?colors.red(res.statusCode):colors.blue(res.statusCode))
      +']['+colors.green(req.originalUrl))+']: '+colors.green(time+'ms'))
      :null;
    }));


    MainProcess.app.use(compression({ filter: shouldCompress }))
    function shouldCompress (req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
      }

      // fallback to standard filter function
      return compression.filter(req, res)
    }


  }
}

export { Middlewares };
