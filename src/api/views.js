
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
          fs.readFileSync('./data/handlebars/robots.txt', MainProcess.data.charset)
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

    readJSONLD(MainProcess, type){
      return JSON.parse(
        fs.readFileSync('./data/structs/jsonld.json', MainProcess.charset)
      ).find(jsonld=>jsonld["$id"] == type);
    }

    jsonld(MainProcess, path){
      return path.jsonld.map( jsonldType =>
        this.readJSONLD(MainProcess, jsonldType) != undefined ?
          (()=>{
            switch (jsonldType) {
              case "WebSite":

                  const websiteJSONLDSchema =
                  this.readJSONLD(MainProcess, jsonldType);
                  const potentialActionJSONLDSchema =
                  this.readJSONLD(MainProcess, "potentialAction");

                  let websiteJSONLD = {};
                  websiteJSONLD["@type"] = jsonldType;
                  websiteJSONLD["@id"] = MainProcess.util.buildUrl();
                  websiteJSONLD["url"] = MainProcess.util.buildUrl();
                  websiteJSONLD["name"] = path.title;
                  websiteJSONLD["description"] = path.description;
                  websiteJSONLD["inLanguage"] = path.lang;

                  websiteJSONLD["potentialAction"] = [JSON.parse(`{
                       "@type":"SearchAction",
                       "target":"`+MainProcess.util.buildUrl('/')+`?s={search_term_string}",
                       "query-input":"required name=search_term_string"
                  }`)];

                  const ajv = new Ajv({schemas: [
                    websiteJSONLDSchema,
                    potentialActionJSONLDSchema
                  ]});

                  const validate = ajv.getSchema(jsonldType);

                  if(!validate(websiteJSONLD)){
                    console.log(colors.red('error | jsonld(path, MainProcess) => invalid jsonld Schema'));
                    return '';
                  }else{
                    return `<script type="application/ld+json">
                               `+util.jsonSave(websiteJSONLD)+`
                            </script>`
                  }

                break;
              default:
                console.log(colors.red('error | jsonld(path, MainProcess) => not found type jsonld'));
                return '';
            }
        })():
        (()=>{
          console.log(colors.red('error | jsonld(path, MainProcess) => not found jsonld'));
          return '';
        })()
      ).join('');
    }

    view(MainProcess, path){ return `
        <!DOCTYPE html>
        <html dir='`+path.dir+`' lang='`+path.lang+`'>
          <head>
              <meta charset='`+MainProcess.data.charset+`'>
              `+this.jsonld(MainProcess, path)+`
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

    const xmlStyleData = fs.readFileSync(
      navi('../underpost_modules/underpost-library/xml/sitemap.xsl'), MainProcess.data.charset
    ).replace('https://www.nexodev.org/api/sitemap', MainProcess.util.buildUrl('/xml'));

    MainProcess.app.get(uri.replace('xml','xsl'), (req, res) =>
      {
        res.writeHead( 200, {
          'Content-Type': ('application/vnd.ms-excel; charset='+MainProcess.data.charset)
        });
        return res.end(xmlStyleData);
      }
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
