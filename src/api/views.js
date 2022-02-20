
'use strict';

import colors from 'colors/safe.js';

import { UtilMod } from '../mods/util.js';

import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Views {

    constructor(obj){

      this.data = obj.data;
      this.app = obj.app;

      this.util = new UtilMod().initDataTools(this);

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
                console.log('                Load View: '+colors.green('Home'));
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
          return res.end(this.data.fonts.map( dataFont => this.font(dataFont) ).join(''));
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
          return res.end(this.view(path));
        }catch(error){
          console.log(colors.red(error));
          res.writeHead( 500, {
            'Content-Type': ('text/html; charset='+this.data.charset),
            'Content-Language': path.lang
          });
          return res.end('Error 500');
        }
      }) );

    }

    font(dataFont){ return `
      @font-face {
        font-family: '`+dataFont.name+`';
        src: URL('`+dataFont.url+`') format('`+dataFont.type+`');
      }
      `
    }

    view(path){ return `
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
  }

}



export { Views };
