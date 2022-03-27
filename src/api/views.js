
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

      const loadStatic = uri => console.log(' Load Static JS: '+colors.green(uri));

      MainProcess.data.statics.map( dir => {
        files.readRecursive( '../'+dir, outDir => {
          const uri = outDir.split(dir)[1];
          const srcPath = navi('../'+dir+uri);
          // console.log(colors.green('set static path:'+uri));
          // console.log(srcPath);
          if(validateUriJs(uri)){
            loadStatic(uri);
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
      // init view data
      // -------------------------------------------------------------------------

      const uriInitData = '/init.js';
      loadStatic(uriInitData);
      MainProcess.app.get(uriInitData, (req, res) => {
        let initData = MainProcess.dev ? '':`
            console.log = function(){};
        `;
        validateUriJs(uriInitData) ? initData =
        javaScriptObfuscator.obfuscate(initData)._obfuscatedCode
        : null;
        res.writeHead( 200, {
          'Content-Type': ('application/javascript; charset='+MainProcess.data.charset)
        });
        return res.end(initData);
      });

      // -------------------------------------------------------------------------
      // virtual robots txt
      // -------------------------------------------------------------------------

      const robotsSource = Handlebars.compile(
        fs.readFileSync('./data/handlebars/robots.txt', MainProcess.data.charset)
      )({
        Sitemap: MainProcess.util.buildUrl('/sitemap.xml')
      });
      MainProcess.app.get('/robots.txt', (req, res) => res.end(robotsSource));

      // -------------------------------------------------------------------------
      // instance sitemap
      // -------------------------------------------------------------------------

      this.getSitemap(MainProcess, '/sitemap.xml');

      // -------------------------------------------------------------------------
      // instance virtual src styles
      // -------------------------------------------------------------------------

      const fontsSource = MainProcess.data.fonts.map( dataFont => this.font(dataFont) ).join('');
      MainProcess.app.get('/fonts.css', (req, res) =>
        {
          res.writeHead( 200, {
            'Content-Type': ('text/css; charset='+MainProcess.data.charset)
          });
          return res.end(fontsSource);
        }
      );

      // -------------------------------------------------------------------------
      // views paths
      // -------------------------------------------------------------------------

      MainProcess.data.views.map( (path, index, array) => {

          // -------------------------------------------------------------------------
          // PWA instance
          // -------------------------------------------------------------------------

          index === 0 ? ( () => {

            const browserconfig = Handlebars.compile(
              fs.readFileSync('./data/handlebars/browserconfig.xml', MainProcess.data.charset)
            )({
              ASSETS_URL: MainProcess.data.pwa.assets,
              COLOR: MainProcess.data.pwa.theme_color
            });

            const uri_browserconfig = '/browserconfig.xml';

            MainProcess.app.get(uri_browserconfig, (req, res) => {
              res.writeHead( 200, {
                'Content-Type': ('application/xml; charset='+MainProcess.data.charset)
              });
              return res.end(browserconfig);
            });

          })() : null;

          const webmanifest = Handlebars.compile(
            fs.readFileSync('./data/handlebars/site.webmanifest', MainProcess.data.charset)
          )({
            NAME: path.title[path.langs[0]],
            SHORT_NAME: path.short_name,
            ASSETS_URL: MainProcess.data.pwa.assets,
            COLOR: MainProcess.data.pwa.theme_color,
            BACKGROUND_COLOR: MainProcess.data.pwa.background_color,
            DISPLAY: MainProcess.data.pwa.display,
            DESCRIPTION: path.description[path.langs[0]],
            START_URL: path.uri,
            ORIENTATION: MainProcess.data.pwa.orientation
          });

          const uri_webmanifest = '/'+path.short_name+'.webmanifest';
          MainProcess.app.get(uri_webmanifest, (req, res) => {
            res.writeHead( 200, {
              'Content-Type': ('application/manifest+json; charset='+MainProcess.data.charset)
            });
            return res.end(webmanifest);
          });

          // -------------------------------------------------------------------------
          // View path Instance
          // -------------------------------------------------------------------------

          MainProcess.app.get(path.uri, (req, res) => {
            try {
              const agentData = info.view(req, util.newInstance(path));
              res.writeHead( 200, {
                'Content-Type': ('text/html; charset='+MainProcess.data.charset),
                'Content-Language': agentData.lang
              });
              return res.end(this.view(MainProcess, path, agentData));
            }catch(error){
              console.log(colors.red(error));
              res.writeHead( 500, {
                'Content-Type': ('text/html; charset='+MainProcess.data.charset),
                'Content-Language': 'en'
              });
              return res.end('Error 500');
            }
          })

      });

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

    jsonld(MainProcess, path, agentData){
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
                  websiteJSONLD["name"] = path.title[agentData.lang];
                  websiteJSONLD["description"] = path.description[agentData.lang];
                  websiteJSONLD["inLanguage"] = agentData.lang;

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

    renderPWA(MainProcess, path, agentData){
      return `

      <meta name ='theme-color' content = '`+MainProcess.data.pwa.theme_color+`' />

      <link rel='apple-touch-icon' sizes='180x180' href='`+MainProcess.data.pwa.assets+`/apple-touch-icon.png'>
      <link rel='icon' type='image/png' sizes='32x32' href='`+MainProcess.data.pwa.assets+`/favicon-32x32.png'>
      <link rel='icon' type='image/png' sizes='16x16' href='`+MainProcess.data.pwa.assets+`/favicon-16x16.png'>

      <link rel='icon' type='image/png' sizes='36x36' href='`+MainProcess.data.pwa.assets+`/android-chrome-36x36.png'>
      <link rel='icon' type='image/png' sizes='48x48' href='`+MainProcess.data.pwa.assets+`/android-chrome-48x48.png'>
      <link rel='icon' type='image/png' sizes='72x72' href='`+MainProcess.data.pwa.assets+`/android-chrome-72x72.png'>
      <link rel='icon' type='image/png' sizes='96x96' href='`+MainProcess.data.pwa.assets+`/android-chrome-96x96.png'>
      <link rel='icon' type='image/png' sizes='144x144' href='`+MainProcess.data.pwa.assets+`/android-chrome-144x144.png'>
      <link rel='icon' type='image/png' sizes='192x192' href='`+MainProcess.data.pwa.assets+`/android-chrome-192x192.png'>
      <link rel='icon' type='image/png' sizes='256x256' href='`+MainProcess.data.pwa.assets+`/android-chrome-256x256.png'>
      <link rel='icon' type='image/png' sizes='512x512' href='`+MainProcess.data.pwa.assets+`/android-chrome-512x512.png'>
      <!-- <link rel='icon' type='image/png' sizes='384x384' href='`+MainProcess.data.pwa.assets+`/android-chrome-384x384.png'> -->

      <link rel='icon' type='image/png' sizes='16x16' href='`+MainProcess.data.pwa.assets+`/favicon-16x16.png'>
      <link rel='manifest' href='/`+path.short_name+`.webmanifest'>
      <link rel='mask-icon' href='`+MainProcess.data.pwa.assets+`/safari-pinned-tab.svg' color='`+MainProcess.data.pwa.theme_color+`'>

      <meta name='apple-mobile-web-app-title' content='`+path.title[agentData.lang]+`'>
      <meta name='application-name' content='`+path.title[agentData.lang]+`'>
      <meta name='msapplication-config' content='/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='`+MainProcess.data.pwa.theme_color+`'>
      <meta name='msapplication-TileImage' content='`+MainProcess.data.pwa.assets+`/mstile-144x144.png'>
      <meta name='theme-color' content='`+MainProcess.data.pwa.theme_color+`'>

      `;
    }

    view(MainProcess, path, agentData){ return `
        <!DOCTYPE html>
        <html dir='`+path.dir+`' lang='`+agentData.lang+`'>
          <head>
              <meta charset='`+MainProcess.data.charset+`'>
              <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
              <meta name='viewport' content='width=device-width, user-scalable=no'>
              `+this.jsonld(MainProcess, path, agentData)+`
              <title>`+path.title[agentData.lang]+`</title>
              <link rel='canonical' href='`+MainProcess.util.buildUrl(path.uri)+`'>
              <link rel='icon' type='image/png' href='`+MainProcess.util.buildUrl()+path.favicon+`'>
              <meta name ='title' content='`+path.title[agentData.lang]+`'>
              <meta name ='description' content='`+path.description[agentData.lang]+`'>
              <meta name='author' content='`+MainProcess.data.author+`' />
              <meta property='og:title' content='`+path.title[agentData.lang]+`'>
              <meta property='og:description' content='`+path.description[agentData.lang]+`'>
              <meta property='og:image' content='`+MainProcess.util.buildUrl()+path.image+`'>
              <meta property='og:url' content='`+MainProcess.util.buildUrl(path.uri)+`'>
              <meta name='twitter:card' content='summary_large_image'>
              `+(path.pwa===true?this.renderPWA(MainProcess, path, agentData):'')+`
              <link rel='stylesheet' href='/css/all.min.css'>
              <link rel='stylesheet' href='/style/simple.css'>
              <link rel='stylesheet' href='/style/place-bar-select.css'>
              <link rel='stylesheet' href='/fonts.css'>
              <script src='/init.js'></script>
              <script src='/util.js'></script>
              <script src='/vanilla.js'></script>
              <script type='module' src='/views/`+path.view+`'></script>
          </head>
          <body>
              <div style='display: none;'>
                <h1>`+path.title[agentData.lang]+`</h1> <h2>`+path.description[agentData.lang]+`</h2>
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
