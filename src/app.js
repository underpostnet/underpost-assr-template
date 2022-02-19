
'use strict';

import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import expressUserAgent from 'express-useragent';
import shell from 'shelljs';
import responseTime from 'response-time';
import cors from 'cors';

import { ApiTest } from './api/api-test.js';
import { Network } from './api/network.js';
import { UtilMod } from './mods/util.js'

import { util, navi, rest, files, info }
from '../underpost_modules/underpost.js';

// console.log('navi test ->');
// console.log(navi('../../'));
// console.log(navi('..'));
// console.log(navi());
// console.log(navi('/test'));

class MainProcess {

  constructor(obj){


    // -------------------------------------------------------------------------
    // render methods
    // -------------------------------------------------------------------------

    this.render = {
      font: dataFont => `
      @font-face {
        font-family: '`+dataFont.name+`';
        src: URL('`+dataFont.url+`') format('`+dataFont.type+`');
      }
      `,
      view: path => `
  				<!DOCTYPE html>
          <html dir='`+path.dir+`' lang='`+path.lang+`'>
            <head>
        				<meta charset='`+this.data.charset+`'>
                <title>`+path.title+`</title>
                <link rel='canonical' href='`+this.util.buildUrl(path.uri)+`'>
                <link rel='icon' type='image/png' href='`+this.util.buildUrl()+path.favicon+`'>
        				<meta name ='title' content='`+path.title+`'>
        				<meta name ='description' content='`+path.description+`'>
                <meta name='author' content='`+this.data.author+`' />
        				<meta property='og:title' content='`+path.title+`'>
        				<meta property='og:description' content='`+path.description+`'>
        				<meta property='og:image' content='`+this.util.buildUrl()+path.image+`'>
        				<meta property='og:url' content='`+this.util.buildUrl(path.uri)+`'>
        				<meta name='twitter:card' content='summary_large_image'>
        				<meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
        				<meta name='viewport' content='width=device-width, user-scalable=no'>
                <link rel='stylesheet' href='/css/all.min.css'>
                <link rel='stylesheet' href='/style/simple.css'>
                <link rel='stylesheet' href='/style/place-bar-select.css'>
                <link rel='stylesheet' href='/fonts.css'>
                <script src='/util.js'></script>
                <script src='/vanilla.js'></script>
                <script type='module' src='/views/`+path.view+`'></script>
            </head>
            <body>
                <div style='display: none;'>
                  <h1>`+path.title+`</h1> <h2>`+path.description+`</h2>
                </div>
            </body>
        </html>
        `
    };

    // -------------------------------------------------------------------------
    // data instance and utility methods
    // -------------------------------------------------------------------------

    this.data = JSON.parse(fs.readFileSync(navi('../data/data.json'), 'utf8'));

    new UtilMod().initDataTools(this);

    // -------------------------------------------------------------------------
    // instance server
    // -------------------------------------------------------------------------

    this.app = express();
    this.server = server.Server(this.app)
    .listen(this.data.server.httpPort);

    console.log(
      colors.yellow(
        ' HTTP SERVER ON PORT:')
        +colors.green(this.data.server.httpPort)
        +colors.yellow(' MODE:')+colors.green((this.dev==true?'DEV':'PROD'))
        +colors.yellow(' HOST:')+colors.green(this.util.buildUrl())
    );

    // -------------------------------------------------------------------------
    // middlewares
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // statics paths
    // -------------------------------------------------------------------------

    this.data.statics.map( dir => {
      files.readRecursive( '../'+dir, outDir => {
        const uri = outDir.split(dir)[1];
        const srcPath = navi('../'+dir+uri);
        // console.log(colors.green('set static path:'+uri));
        // console.log(srcPath);
        switch (uri) {
          case '/views/home.js':
              console.log(' Load View: '+colors.green('Home'));
        }
        this.app.get(uri, (req, res) => res.sendFile(srcPath));
      });
    });

    // -------------------------------------------------------------------------
    // instance virtual src styles
    // -------------------------------------------------------------------------

    this.app.get('/fonts.css', (req, res) =>
      {
        res.writeHead( 200, {
          'Content-Type': ('text/css; charset='+this.data.charset)
        });
        return res.end(this.data.fonts.map( dataFont => this.render.font(dataFont) ).join(''));
      }
    );

    // -------------------------------------------------------------------------
    // views paths
    // -------------------------------------------------------------------------

    this.data.views.map( path =>
    this.app.get(path.uri, (req, res) => {
      // npm response-time
      // console.log(req);
      info.view(req, util.newInstance(path));
      try {
        res.writeHead( 200, {
          'Content-Type': ('text/html; charset='+this.data.charset),
          'Content-Language': path.lang
        });
        return res.end(this.render.view(path));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('text/html; charset='+this.data.charset),
          'Content-Language': path.lang
        });
        return res.end('Error 500');
      }
    }) );

    // -------------------------------------------------------------------------
    // load API routes-services
    // -------------------------------------------------------------------------

    this.globalApiModules = {
      data: this.data,
      app: this.app
    };

    console.log(' Load API routes-services: '+colors.green( 'ApiTest'));
    this.Apitest = new ApiTest(this.globalApiModules);
    console.log(' Load API routes-services: '+colors.green( 'Network'));
    this.Network = new Network(this.globalApiModules);

    // -------------------------------------------------------------------------
    // save info paths
    // -------------------------------------------------------------------------

    setTimeout( () => this.paths = this.app._router.stack
      .map((v,i,a) => true ?
      {
        index: i,
        path: v.route ? v.route.path: undefined,
        methods: v.route ? util.getKeys(v.route.methods).join('|'): undefined
      }
      :null
    ), 0);

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


  }

}

new MainProcess();
