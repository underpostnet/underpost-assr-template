
'use strict';

import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import expressUserAgent from 'express-useragent';
import shell from 'shelljs';
import responseTime from 'response-time';

import { util, navi, rest, files, info }
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
                `+this.data.fonts.map( dataFont => this.render.font(dataFont) ).join('')+`
                <script src='/util.js'></script>
                <script src='/vanilla.js'></script>
                <script type='module' src='/views/`+path.view+`'></script>
            </head>
            <body></body>
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

    this.app.use(responseTime( (req, res, time) => {
      this.data.server.log_all_ms_response?
      console.log(req.originalUrl.padStart(30," ")+' '+colors.green(time+'ms'))
      :req.originalUrl.split('.')[1]==undefined ?
      console.log((' response time ['+req.originalUrl)+']: '+colors.green(time+'ms'))
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
      info.req(req, util.newInstance(path));
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

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


  }

}

new MainProcess();
