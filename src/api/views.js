
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
        uri.split('/')[1]!='js'
      );

      const validateUriCss = uri => (
        uri.split('.').pop()=='css' &&
        (
          uri.split('/')[1]=='style'
          ||
          uri.split('/')[1]=='quill'
          ||
          uri.split('/')[1]=='css'
        )
      );

      const logStatic = uri => console.log(' Load Static : '+colors.green(uri));

      this.renderCss = '';

      MainProcess.data.statics.map( dir => {
        files.readRecursive( '../'+dir, outDir => {
          const uri = outDir.split(dir)[1];
          const srcPath = navi('../'+dir+uri);
          // console.log(colors.green('set static path:'+uri));
          // console.log(srcPath);
          if(validateUriJs(uri)){
            logStatic(uri);
            const renderJS = this.compilerJS(MainProcess, uri, outDir);
            MainProcess.app.get(uri, (req, res) => {
              res.writeHead( 200, {
                'Content-Type': ('application/javascript; charset='+MainProcess.data.charset)
              });
              return res.end(renderJS);
            });
          }else if(validateUriCss(uri)){
            logStatic(uri);
            const renderCss = MainProcess.dev ? fs.readFileSync(outDir, MainProcess.data.charset) : util.reduce(fs.readFileSync(outDir, MainProcess.data.charset));
            MainProcess.app.get(uri, (req, res) => {
              res.writeHead( 200, {
                'Content-Type': ('text/css; charset='+MainProcess.data.charset)
              });
              return res.end('');
            });
            this.renderCss += renderCss;
          }else{
            return MainProcess.app.get(uri, (req, res) => res.sendFile(srcPath));
          }
        });
      });

      // -------------------------------------------------------------------------
      // init view data
      // -------------------------------------------------------------------------

      /*

      image/gif
      image/jpg

      const IMG_A = "data:[];base64,`+
      fs.readFileSync(
        './underpost_modules/underpost-library/img/underpost-social.jpg'
      ).toString('base64')+`"


      */

      const uriInitData = '/init.js';
      let initData = `

          window.IMG_UNDERPOST_SOCIAL = 'data:image/png;base64,`+fs.readFileSync(
          './underpost_modules/underpost-library/assets/underpost-600x600.png'
        ).toString('base64')+`';

          window.COLOR_THEME_B = 'rgba(212, 0, 0, 0.8)';
          window.COLOR_THEME_B_HOVER = 'rgba(212, 0, 0, 1)';

        `;
      initData += MainProcess.dev ? '' :
      javaScriptObfuscator.obfuscate(util.reduce(`
          /*
          console.log = function(){};
          console.warn = function(){};
          console.error = function(){};
          */

          `))._obfuscatedCode;
      logStatic(uriInitData);
      MainProcess.app.get(uriInitData, (req, res) => {
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

      let fontsSource = MainProcess.data.fonts.map( dataFont => this.font(dataFont) ).join('');
      MainProcess.dev ? null : fontsSource = util.reduce(fontsSource);
      this.renderCss += fontsSource;
      /*
      MainProcess.app.get('/fonts.css', (req, res) =>
        {
          res.writeHead( 200, {
            'Content-Type': ('text/css; charset='+MainProcess.data.charset)
          });
          return res.end(fontsSource);
        }
      );
      */

      let cursorsSource = MainProcess.data.cursors.map( dataCursor => this.cursor(dataCursor) ).join('');
      MainProcess.dev ? null : cursorsSource = util.reduce(cursorsSource);
      this.renderCss += cursorsSource;
      /*
      MainProcess.app.get('/cursors.css', (req, res) =>
        {
          res.writeHead( 200, {
            'Content-Type': ('text/css; charset='+MainProcess.data.charset)
          });
          return res.end(cursorsSource);
        }
      );
      */

      this.renderCss += ' render {display: none; overflow: auto} .loading {width: 50px; height: 50px;}';

      // -------------------------------------------------------------------------
      // views paths
      // -------------------------------------------------------------------------

      const browserconfig = Handlebars.compile(
        fs.readFileSync('./data/handlebars/browserconfig.xml', MainProcess.data.charset)
      )({
        ASSETS_URL: MainProcess.data.pwa.assets,
        COLOR: MainProcess.data.pwa.theme_color
      });

      MainProcess.app.get('/browserconfig.xml', (req, res) => {
        res.writeHead( 200, {
          'Content-Type': ('application/xml; charset='+MainProcess.data.charset)
        });
        return res.end(browserconfig);
      });

      MainProcess.data.views.map( (path, index, array) => {

          path.pwa === true ? this.renderPathPwaManifest(MainProcess, path) : null;
          let sourceView = this.view(MainProcess, path);
          MainProcess.dev ? null : sourceView = util.reduce(sourceView);
          MainProcess.app.get(path.uri, (req, res) => {
            try {
              const agentData = info.view(req, util.newInstance(path));
              res.writeHead( 200, {
                'Content-Type': ('text/html; charset='+MainProcess.data.charset),
                'Content-Language': agentData.lang
              });
              return res.end(this.viewCompiler(path, agentData, sourceView));
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

    cursor(dataCursor){
      return `
      `+dataCursor.class+` {
        cursor: url('`+dataCursor.url+`') `+dataCursor.x+` `+dataCursor.y+`, auto;
      }
      `
    }

    readJSONLD(MainProcess, type){
      return JSON.parse(
        fs.readFileSync('./data/structs/jsonld.json', MainProcess.charset)
      ).find(jsonld=>jsonld["$id"] == type);
    }

    compilerJS(MainProcess, uri, outDir){
      let renderJS = fs.readFileSync(outDir, MainProcess.data.charset);
      renderJS = this.renderServiceWorker(MainProcess, uri, renderJS);
      ! MainProcess.dev ? renderJS =
      javaScriptObfuscator.obfuscate(
        util.reduce(renderJS)
      )._obfuscatedCode
        : null;
      return renderJS;
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
                  websiteJSONLD["name"] = "{{title}}";
                  websiteJSONLD["description"] = "{{description}}";
                  websiteJSONLD["inLanguage"] = "{{lang}}";

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

    renderPathPwaManifest(MainProcess, path){
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

      MainProcess.app.get('/'+path.short_name+'.webmanifest', (req, res) => {
        res.writeHead( 200, {
          'Content-Type': ('application/manifest+json; charset='+MainProcess.data.charset)
        });
        return res.end(webmanifest);
      });
    }

    renderPWA(MainProcess, path){
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

      <meta name='apple-mobile-web-app-title' content='{{title}}'>
      <meta name='application-name' content='{{title}}'>
      <meta name='msapplication-config' content='/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='`+MainProcess.data.pwa.theme_color+`'>
      <meta name='msapplication-TileImage' content='`+MainProcess.data.pwa.assets+`/mstile-144x144.png'>
      <meta name='theme-color' content='`+MainProcess.data.pwa.theme_color+`'>

      `;
    }

    renderServiceWorker(MainProcess, uri, renderJS){
      return uri == '/sw.js' ? `
      const _DEV = `+(MainProcess.dev ? 'true' : 'false' )+`;
      const _URL = '`+MainProcess.util.buildUrl()+`';
      const _ASSETS = JSON.parse('`+JSON.stringify(
        JSON.parse(
          fs.readFileSync('./data/params/pwa-cache.json', MainProcess.data.charset)
        )
      )+`');
      const _VIEWS = JSON.parse('`+JSON.stringify(
        JSON.parse(
          fs.readFileSync('./data/params/global.json', MainProcess.data.charset)
        ).views.map( viewData => viewData.uri )
      )+`');
      const _API = JSON.parse('`+JSON.stringify(
        JSON.parse(
          fs.readFileSync('./data/params/pwa-api.json', MainProcess.data.charset)
        )
      )+`');

      `+fs.readFileSync(
        './underpost_modules/underpost-modules-v2/util.js',
        MainProcess.data.charset).split('export default')[0]+`

      ` + renderJS.replace('/* POSTS VIRTUAL API */', fs.readFileSync(
        './src/api/posts.js',
        MainProcess.data.charset).split('/* WORKER */')[1]) : renderJS;
    }

    view(MainProcess, path){
      /*
      <link rel='stylesheet' href='/css/all.min.css'>
      <link rel='stylesheet' href='/style/simple.css'>
      <link rel='stylesheet' href='/style/place-bar-select.css'>
      <link rel='stylesheet' href='/fonts.css'>
      <link rel='stylesheet' href='/cursors.css'>
      */
      return `
        <!DOCTYPE html>
        <html dir='`+path.dir+`' lang='{{lang}}'>
          <head>
              <meta charset='`+MainProcess.data.charset+`'>
              <meta content=width=device-width,initial-scale=1.0 name=viewport>
              `+this.jsonld(MainProcess, path)+`
              <title>{{title}}</title>
              <link rel='canonical' href='`+MainProcess.util.buildUrl(path.uri)+`'>
              <link rel='icon' type='image/png' href='`+MainProcess.util.buildUrl(path.favicon)+`'>
              <meta name ='title' content='{{title}}'>
              <meta name ='description' content='{{description}}'>
              <meta name='author' content='`+MainProcess.data.author+`' />
              <meta property='og:title' content='{{title}}'>
              <meta property='og:description' content='{{description}}'>
              <meta property='og:image' content='`+MainProcess.util.buildUrl(path.image)+`'>
              <meta property='og:url' content='`+MainProcess.util.buildUrl(path.uri)+`'>
              <meta name='twitter:card' content='summary_large_image'>
              `+(path.pwa===true?this.renderPWA(MainProcess, path):'')+`
              <style>
              `+this.renderCss+`
              </style>
              <script defer src='/init.js'></script>
              <script defer src='/util.js'></script>
              <script defer src='/vanilla.js'></script>
              <script defer type='module' src='/views/`+path.view+`'></script>
          </head>
          <body>
              <img class='abs center loading' alt='loading' src='data:image/gif;base64,`+fs.readFileSync(
                './underpost_modules/underpost-library/assets/loading-opt.gif'
              ).toString('base64')+`'>
              <div style='display: none;'>
                <h1>{{title}}</h1> <h2>{{description}}</h2>
              </div>
              <render></render>
          </body>
      </html>
      `
  }

  viewCompiler(path, agentData, viewRender){
    return Handlebars.compile(viewRender)({
      lang: agentData.lang,
      title: path.title[agentData.lang],
      description: path.description[agentData.lang]
    });
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
