
'use strict';

// Nodejs modules
import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import shell from 'shelljs';

// Underpost modules
import { util, navi, rest, files, info }
from '../underpost_modules/underpost.js';

// App mods
import { Middlewares } from './mods/middlewares.js';
import { UtilMod } from './mods/util.js';

// API services
import { ApiTest } from './api/api-test.js';
import { Network } from './api/network.js';
import { Views } from './api/views.js';


class MainProcess {

  constructor(obj){

    this.data = JSON.parse(fs.readFileSync(navi('../data/data.json'), 'utf8'));

    this.app = new Middlewares({
      app: express(),
      data: this.data
    }).baseMiddlewares();

    this.util = new UtilMod().initDataTools(this);

    this.processObj = {
      data: this.data,
      app: this.app
    };

    console.log(' Load API routes-services: '+colors.green( 'Views'));
    this.Views = new Views(this.processObj);

    console.log(' Load API routes-services: '+colors.green( 'ApiTest'));
    this.Apitest = new ApiTest(this.processObj);

    console.log(' Load API routes-services: '+colors.green( 'Network'));
    this.Network = new Network(this.processObj);

    this.server = server.Server(this.app)
    .listen(this.data.server.httpPort);

    console.log(process.argv);
    console.log(
      colors.yellow(
        ' HTTP SERVER ON PORT:')
        +colors.green(this.data.server.httpPort)
        +colors.yellow(' MODE:')+colors.green((this.dev==true?'DEV':'PROD'))
        +colors.yellow(' HOST:')+colors.green(this.util.buildUrl())
    );

  }

}

new MainProcess();
