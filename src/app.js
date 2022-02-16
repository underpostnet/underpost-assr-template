
'use strict';

import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import expressUserAgent from 'express-useragent';
import shell from 'shelljs';

import { util, navi, rest, files }
from '../underpost_modules/underpost.js';

// console.log('navi test ->');
// console.log(navi('../../'));
// console.log(navi('..'));
// console.log(navi());
// console.log(navi('/test'));

class MainProcess {

  constructor(obj){

    this.dev = process.argv.slice(2)[0]=='d' ? true: false;
    console.log(process.argv);

    // -------------------------------------------------------------------------
    // utility methods
    // -------------------------------------------------------------------------

    this.util = {
      buildUrl: uri =>
            this.data.server.visiblePort ?
            this.data.server.host + ':' + this.data.server.httpPort + util.uriValidator(uri):
            this.data.server.host + util.uriValidator(uri)
    };

    // -------------------------------------------------------------------------
    // req methods
    // -------------------------------------------------------------------------

    this.req = {
      info: (req, path, groupTable) => {
          const reqInfo = {
            ip: req.connection.remoteAddress || req.headers['x-forwarded-for'],
            date: new Date().toISOString(),
            host: req.headers.host,
            lang: req.acceptsLanguages().join('|'),
            browser: req.useragent.browser,
            version: req.useragent.version,
            os: req.useragent.os,
            platform: req.useragent.platform,
            geoIp: util.jsonSave(req.useragent.geoIp)
          };
          if(groupTable===true){
            console.log('');
            console.log(colors.bgBrightYellow(colors.black(util.tu(' path info '))));
            console.table(path);
            console.log(colors.bgBrightYellow(colors.black(util.tu(' req info '))));
            console.table(reqInfo);
            console.log(colors.bgBrightYellow(colors.black(util.tu(' source info '))));
            console.table(req.useragent.source);
            console.log(colors.bgBrightYellow(colors.black(util.tu(' resume '))));
          }
          return {
            ...path,
            ...reqInfo,
            ...{source: req.useragent.source}
          }
      },
      logInfo: (req, path) => {
        const dataPath = this.paths.filter(x=>x.path==path.uri)[0];
        console.log(
          ' \n > '
         + colors.bgYellow(colors.black(' '
         + util.tu(dataPath.methods)
         + ' '))
         + colors.green(' .'+path.uri));
        const display_ = this.req.info(req, path);
        const source_ = display_.source;
        delete display_.source;
        console.table({ ...dataPath, ...display_ });
        console.log(' source: '+colors.green(source_));
      }
    };

    // -------------------------------------------------------------------------
    // render methods
    // -------------------------------------------------------------------------

    this.render = {
      font: dataFont => `
      <style>
      @font-face {
        font-family: '`+dataFont.name+`';
        src: URL('`+dataFont.url+`') format('`+dataFont.type+`');
      }
      </style>
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
        				<meta property='og:title' content='`+path.title+`'>
        				<meta property='og:description' content='`+path.description+`'>
        				<meta property='og:image' content='`+this.util.buildUrl()+path.image+`'>
        				<meta property='og:url' content='`+this.util.buildUrl(path.uri)+`'>
        				<meta name='twitter:card' content='summary_large_image'>
        				<meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
        				<meta name='viewport' content='width=device-width, user-scalable=no'>
                <!-- <link rel='stylesheet' href='/css/all.min.css'> -->
                <link rel='stylesheet' href='/style/simple.css'>
                `+this.data.fonts.map( dataFont => this.render.font(dataFont) ).join('')+`
                <script src='/util.js'></script>
                <script src='/vanilla.js'></script>
            </head>
            <body>
                    <div class='inl' style='border: 2px solid red; padding: 10px; margin: 5px;'>
                        <img src='/img/underpost-social.jpg'>
                        <br>
                        <span style='font-family: gothic'>Hello World</span>
                        <br>
                        <i class='fas fa-lock'></i>
                    </div>
            </body>
        </html>
        `
    };

    // -------------------------------------------------------------------------
    // instance data
    // -------------------------------------------------------------------------

    this.data = JSON.parse(fs.readFileSync(navi('../data/data.json'), 'utf8'));

    if(this.dev){
          // console.log(colors.yellow('save colors config ->'))
          // fs.writeFileSync(
          //   navi('../data/colors.json'),
          //   util.jsonSave(colors),
          //   this.data.charset
          // );

    }

    // -------------------------------------------------------------------------
    // instance server
    // -------------------------------------------------------------------------

    this.app = express();
    this.server = server.Server(this.app)
    .listen(this.data.server.httpPort);

    console.log(colors.yellow(
      'HTTP SERVER ON PORT:'
      +this.data.server.httpPort
      +' MODE:'+(this.dev==true?'DEV':'PROD')
    ));

    // -------------------------------------------------------------------------
    // middlewares
    // -------------------------------------------------------------------------

    this.app.use(expressUserAgent.express());

    // -------------------------------------------------------------------------
    // fontawesome 5.3.1 source
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // statics paths
    // -------------------------------------------------------------------------

    this.data.statics.map( dir => {
      files.readRecursive( '../'+dir, outDir => {
        const uri = outDir.split(dir)[1];
        const srcPath = navi('../'+dir+uri);
        // console.log(colors.green('set static path:'+uri));
        // console.log(srcPath);
        this.app.get(uri, (req, res) => res.sendFile(srcPath));
      });
    });

    // -------------------------------------------------------------------------
    // views paths
    // -------------------------------------------------------------------------

    this.data.views.map( path =>
    this.app.get(path.uri, (req, res) => {
      // npm response-time
      // console.log(req);
      this.req.logInfo(req, path);
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


  }

}

new MainProcess();
