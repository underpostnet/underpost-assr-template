
import expressUserAgent from 'express-useragent';
import responseTime from 'response-time';
import cors from 'cors';
import express from 'express';
import colors from 'colors/safe.js';

import { UtilMod } from './util.js';

class Middlewares{

  constructor(obj){

    this.app = obj.app;
    this.data = obj.data;

    this.util = new UtilMod().initDataTools(this);

  }

  baseMiddlewares(){

    this.app.use(expressUserAgent.express());

    this.app.use(express.json({limit: this.data.server.limitSizeJSON}));
    this.app.use(express.urlencoded({limit: this.data.server.limitSizeJSON, extended: true}));

    this.app.use(cors({
      origin: [this.util.buildUrl()]
    }));

    this.app.use(responseTime( (req, res, time) => {
      this.data.server.log_all_ms_response?
      console.log(req.originalUrl.padStart(30," ")+' '+colors.green(time+'ms'))
      :req.originalUrl.split('.')[1]==undefined ?
      console.log((' '+colors.yellow('END-REQUEST')+' ['+req.originalUrl)+']: '+colors.green(time+'ms'))
      :null;
    }));

    return this.app;

  }


}

export { Middlewares };
