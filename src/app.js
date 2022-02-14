
'use strict';

import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import expressUserAgent from 'express-useragent';
import shell from 'shelljs';
import admZip from 'adm-zip';
import request from 'superagent';

import util from '../underpost-modules-v2/util.js';
import navDir from '../underpost-modules-v2/navDir.js';
import rest from '../underpost-modules-v2/rest.js';
import files from '../underpost-modules-v2/files.js';

// console.log('navDir test ->');
// console.log(navDir('../../'));
// console.log(navDir('..'));
// console.log(navDir());
// console.log(navDir('/test'));

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
      info: req => {
        return {
          ip: req.connection.remoteAddress || req.headers['x-forwarded-for'],
          date: new Date(),
          host: req.headers.host,
          lang: req.acceptsLanguages(),
          browser: req.useragent.browser,
          version: req.useragent.version,
          os: req.useragent.os,
          platform: req.useragent.platform,
          geoIp: util.jsonSave(req.useragent.geoIp),
          source: req.useragent.source
        }
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

    this.data = JSON.parse(fs.readFileSync(navDir('../data/data.json'), 'utf8'));

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

    // ! fs.existsSync(navDir('/fontawesome')) ?
    // fs.mkdirSync(navDir('/fontawesome')) : null;

    // fs.writeFileSync(
    //   navDir(nameFile),
    //   await rest.getRaw('https://underpost.net/fontawesome-5.3.1'+path),
    //   this.data.charset
    // )

    // request
    //   .get('https://underpost.net/download/fontawesome-free-5.3.1.zip')
    //   .on('error', function(error) {
    //     console.log(error);
    //   })
    //   .pipe(fs.createWriteStream(navDir('/fontawesome-5.3.1.zip')))
    //   .on('finish', function() {
    //     console.log('finished dowloading');
    //     const zip = new admZip(navDir('/fontawesome-5.3.1.zip'));
    //     console.log('start unzip');
    //     zip.extractAllTo(navDir('/fontawesome/'), true);
    //     console.log('finished unzip');
    //   });

    // -------------------------------------------------------------------------
    // statics paths
    // -------------------------------------------------------------------------

    this.data.statics.map( dir => {
      files.readRecursive( '../'+dir, outDir => {
        const uri = outDir.split(dir)[1];
        // console.log(colors.green('set static path:'+uri));
        // console.log(navDir('../underpost-library/'+uri));
        this.app.get(uri, (req, res) => res.sendFile(navDir('../underpost-library/'+uri)));
      });
    });

    // -------------------------------------------------------------------------
    // views paths
    // -------------------------------------------------------------------------

    this.data.views.map( path =>
    this.app.get(path.uri, (req, res) => {
      // npm response-time
      console.log(colors.yellow(' path info ->'));
      console.log(path);
      const reqInfo = this.req.info(req);
      console.log(colors.yellow(' req info ->'));
      console.log(reqInfo);
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
    // -------------------------------------------------------------------------


  }

}

new MainProcess();
