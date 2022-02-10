

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import fs from 'fs';
import colors from 'colors/safe.js';
import server  from 'http';
import express from 'express';
import expressUserAgent from 'express-useragent';

const buildDir = dir => dir.replace(/\\/g, '/');
const __filename = buildDir(fileURLToPath(import.meta.url));
const __dirname = buildDir(dirname(__filename));
console.log(colors.green('__dirname:'+__dirname));
console.log(colors.green('__filename:'+__filename));

class MainProcess {

  constructor(obj){

    // -------------------------------------------------------------------------
    // utility methods
    // -------------------------------------------------------------------------

    this.util = {
      timer: ms => new Promise(res => setTimeout(res, ms)),
      jsonSave: obj => JSON.stringify(obj, null, 4),
      uriValidator: uri => uri == undefined ? '' : uri,
      buildUrl: uri =>
                this.data.server.visiblePort ?
                this.data.server.host + ':' + this.data.server.httpPort + this.util.uriValidator(uri):
                this.data.server.host + this.util.uriValidator(uri)
    };

    // -------------------------------------------------------------------------
    // files methods
    // -------------------------------------------------------------------------

    this.fileGestor = {

      // recursive iterator delete

      // recursive iterator read
      readRecursive: (dir, out) =>
        fs.existsSync(__dirname+dir) ?
        fs.readdirSync(__dirname+dir).forEach( async file =>
        fs.lstatSync(__dirname+dir+'/'+file).isDirectory() ?
        this.fileGestor.readRecursive(dir+'/'+file, out) :
        out(__dirname+dir+'/'+file)) :
        console.log(colors.red(' readRecursive: (dir, out) => no directory found:'+__dirname+dir))

    }

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
          geoIp: this.util.jsonSave(req.useragent.geoIp),
          source: req.useragent.source
        }
      }
    };

    // -------------------------------------------------------------------------
    // render methods
    // -------------------------------------------------------------------------

    this.render = {
      view: path => `
  				<!DOCTYPE html>
          <html dir='`+path.dir+`' lang='`+path.lang+`'>
            <head>
        				<meta charset='`+path.charset+`'>
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
            </head>
            <body>
                    <img src='/img/underpost-social.jpg'>
                    <br>
                    Hello World
            </body>
        </html>
        `
    };

    // -------------------------------------------------------------------------
    // instance data
    // -------------------------------------------------------------------------

    this.data = JSON.parse(fs.readFileSync(__dirname+'/data.json', 'utf8'));

    // -------------------------------------------------------------------------
    // instance server
    // -------------------------------------------------------------------------

    this.app = express();
    this.server = server.Server(this.app)
    .listen(this.data.server.httpPort);

    console.log(colors.yellow(
      'HTTP SERVER ON PORT:'
      +this.data.server.httpPort
    ));

    // -------------------------------------------------------------------------
    // middlewares
    // -------------------------------------------------------------------------

    this.app.use(expressUserAgent.express());

    // -------------------------------------------------------------------------
    // statics paths
    // -------------------------------------------------------------------------

    this.data.statics.map( dir => {
      this.fileGestor.readRecursive( dir, outDir => {
        const uri = outDir.split(dir)[1];
        console.log(colors.green('set static path:'+uri));
        console.log(outDir);
        this.app.get(uri, (req, res) => res.sendFile(outDir));
      });
    });

    // -------------------------------------------------------------------------
    // views paths
    // -------------------------------------------------------------------------

    this.data.views.map( path =>
    this.app.get(path.uri, (req, res) => {
      console.log(colors.yellow(' path info ->'));
      console.log(path);
      const reqInfo = this.req.info(req);
      console.log(colors.yellow(' req info ->'));
      console.log(reqInfo);
      try {
        res.writeHead( 200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Language': path.lang
        });
        return res.end(this.render.view(path));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Language': path.lang
        });
        return res.end('Error 500');
      }
    }) );

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // TEST ZONE





    // setTimeout(async ()=>{
    //   console.log(
    //     colors.redBG(colors.black(
    //       this.util.jsonSave(this)
    //     ))
    //   );
    //   await this.util.timer(1000);
    //   console.log('1');
    //   await this.util.timer(1000);
    //   console.log('2');
    //   await this.util.timer(1000);
    //   console.log('3');
    // },3000);




    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

  }

}

new MainProcess();
