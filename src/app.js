
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

    this.app = express();
    this.data = JSON.parse(fs.readFileSync(navi('../data/data.json'), 'utf8'));

    console.log(' Load MOD Instance: '+colors.green('UtilMod'));
    new UtilMod(this);

    console.log(' Load MOD Instance: '+colors.green('Middlewares'));
    new Middlewares(this);

    console.log(' Load API Instance: '+colors.green('Views'));
    new Views(this);

    console.log(' Load API Instance: '+colors.green('ApiTest'));
    new ApiTest(this);

    console.log(' Load API Instance: '+colors.green('Network'));
    new Network(this);

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
