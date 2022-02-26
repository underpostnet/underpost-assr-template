
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import javaScriptObfuscator from 'javascript-obfuscator';

import Handlebars from 'handlebars';
import Ajv from 'ajv';

import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Views {

    constructor(MainProcess){

      // -------------------------------------------------------------------------
      // statics paths
      // -------------------------------------------------------------------------

      const validateUriJs = uri => (
        uri.split('.').pop()=='js' &&
        uri.split('/')[1]!='lib' &&
        uri.split('/')[1]!='quill' &&
        uri.split('/')[1]!='js' &&
        MainProcess.dev === false
      );

      MainProcess.data.statics.map( dir => {
        files.readRecursive( '../'+dir, outDir => {
          const uri = outDir.split(dir)[1];
          const srcPath = navi('../'+dir+uri);
          // console.log(colors.green('set static path:'+uri));
          // console.log(srcPath);
          if(validateUriJs(uri)){
            console.log(' Load Static JS: '+colors.green(uri));
            const jsObfData = javaScriptObfuscator.obfuscate(
              fs.readFileSync(outDir, MainProcess.data.charset)
            )._obfuscatedCode;
            MainProcess.app.get(uri, (req, res) => {
              res.writeHead( 200, {
                'Content-Type': ('application/javascript; charset='+MainProcess.data.charset)
              });
              return res.end(jsObfData);
            });
          }else{
            return MainProcess.app.get(uri, (req, res) => res.sendFile(srcPath));
          }
        });
      });

      // -------------------------------------------------------------------------
      // virtual robots txt
      // -------------------------------------------------------------------------

      MainProcess.app.get('/robots.txt', (req, res) => {
        res.writeHead( 200, {
          'Content-Type': ('text/plain; charset='+MainProcess.data.charset)
        });
        let robotsTemplate = Handlebars.compile(
          fs.readFileSync('./handlebars/robots.txt', MainProcess.data.charset)
        );
        return res.end(robotsTemplate({
          Sitemap: MainProcess.util.buildUrl('/sitemap.xml')
        }));
      });

      // -------------------------------------------------------------------------
      // instance sitemap
      // -------------------------------------------------------------------------

      this.getSitemap(MainProcess, '/sitemap.xml');

      // -------------------------------------------------------------------------
      // instance virtual src styles
      // -------------------------------------------------------------------------

      MainProcess.app.get('/fonts.css', (req, res) =>
        {
          res.writeHead( 200, {
            'Content-Type': ('text/css; charset='+MainProcess.data.charset)
          });
          return res.end(MainProcess.data.fonts.map( dataFont => this.font(dataFont) ).join(''));
        }
      );

      // -------------------------------------------------------------------------
      // views paths
      // -------------------------------------------------------------------------

      MainProcess.data.views.map( path =>
      MainProcess.app.get(path.uri, (req, res) => {
        info.view(req, util.newInstance(path));
        try {
          res.writeHead( 200, {
            'Content-Type': ('text/html; charset='+MainProcess.data.charset),
            'Content-Language': path.lang
          });
          return res.end(this.view(MainProcess, path));
        }catch(error){
          console.log(colors.red(error));
          res.writeHead( 500, {
            'Content-Type': ('text/html; charset='+MainProcess.data.charset),
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

    readMicrodata(MainProcess, type){
      return JSON.parse(
        fs.readFileSync('./structs/microdata.json', MainProcess.charset)
      ).find(microdata=>microdata["$id"] == type);
    }

    microdata(MainProcess, path){
      return path.microdata.map( microdataType =>
        this.readMicrodata(MainProcess, microdataType) != undefined ?
          (()=>{
            switch (microdataType) {
              case "WebSite":

                  const websiteMicrodataSchema =
                  this.readMicrodata(MainProcess, microdataType);
                  const potentialActionMicrodataSchema =
                  this.readMicrodata(MainProcess, "potentialAction");

                  let websiteMicrodata = {};
                  websiteMicrodata["@type"] = microdataType;
                  websiteMicrodata["@id"] = MainProcess.util.buildUrl();
                  websiteMicrodata["url"] = MainProcess.util.buildUrl();
                  websiteMicrodata["name"] = path.title;
                  websiteMicrodata["description"] = path.description;
                  websiteMicrodata["inLanguage"] = path.lang;

                  websiteMicrodata["potentialAction"] = [JSON.parse(`{
                       "@type":"SearchAction",
                       "target":"`+MainProcess.util.buildUrl('/')+`?s={search_term_string}",
                       "query-input":"required name=search_term_string"
                  }`)];

                  const ajv = new Ajv({schemas: [
                    websiteMicrodataSchema,
                    potentialActionMicrodataSchema
                  ]});

                  const validate = ajv.getSchema(microdataType);

                  if(!validate(websiteMicrodata)){
                    console.log(colors.red('error | microdata(path, MainProcess) => invalid microdata Schema'));
                    return '';
                  }else{
                    return `<script type="application/ld+json">
                               `+util.jsonSave(websiteMicrodata)+`
                            </script>`
                  }
                  
                break;
              default:
                console.log(colors.red('error | microdata(path, MainProcess) => not found type microdata'));
                return '';
            }
        })():
        (()=>{
          console.log(colors.red('error | microdata(path, MainProcess) => not found microdata'));
          return '';
        })()
      ).join('');
    }

    view(MainProcess, path){ return `
        <!DOCTYPE html>
        <html dir='`+path.dir+`' lang='`+path.lang+`'>
          <head>
              <meta charset='`+MainProcess.data.charset+`'>
              `+this.microdata(MainProcess, path)+`
              <title>`+path.title+`</title>
              <link rel='canonical' href='`+MainProcess.util.buildUrl(path.uri)+`'>
              <link rel='icon' type='image/png' href='`+MainProcess.util.buildUrl()+path.favicon+`'>
              <meta name ='title' content='`+path.title+`'>
              <meta name ='description' content='`+path.description+`'>
              <meta name='author' content='`+MainProcess.data.author+`' />
              <meta property='og:title' content='`+path.title+`'>
              <meta property='og:description' content='`+path.description+`'>
              <meta property='og:image' content='`+MainProcess.util.buildUrl()+path.image+`'>
              <meta property='og:url' content='`+MainProcess.util.buildUrl(path.uri)+`'>
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

  getSitemap(MainProcess, uri){

    let sitemap = '';
    for(let renderSitemap of MainProcess.data.views){
      if(renderSitemap.sitemap.active){
        sitemap += `
        <url>
              <loc>`+MainProcess.util.buildUrl(renderSitemap.uri)+`</loc>
              <lastmod>`+renderSitemap.sitemap.lastmod+`</lastmod>
              <changefreq>`+renderSitemap.sitemap.changefreq+`</changefreq>
              <priority>`+renderSitemap.sitemap.priority+`</priority>
        </url>
        `;
      }
    }

    let baseSitemap = fs.readFileSync(
    './underpost_modules/underpost-library/xml/sitemap.xml', MainProcess.data.charset)
    .split('</urlset>');
    sitemap = baseSitemap[0].replace(
      '{sitemap-xsl-url}',
      MainProcess.util.buildUrl(uri.replace('xml','xsl'))) + sitemap + '</urlset>';

    MainProcess.app.get(uri.replace('xml','xsl'), (req, res) =>
      res.sendFile(navi('../underpost_modules/underpost-library/xml/sitemap.xsl'))
    );

    MainProcess.app.get(uri, (req, res) => {
      res.writeHead( 200, {
        'Content-Type': ('application/xml; charset='+MainProcess.data.charset)
      });
      return res.end(sitemap);
    });

  }

}



export { Views };
