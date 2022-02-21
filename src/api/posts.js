
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Posts {

  constructor(MainProcess){
      this.postPost(MainProcess, '/posts');
      this.getPost(MainProcess, '/posts');
  }

  getPost(MainProcess, uri){
    MainProcess.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'Posts' } );
      try {

        console.log(colors.yellow(' BODY -> '));
        console.log(colors.green(util.jsonSave(req.body)));

        const JSON_POSTS_PATH = './data/posts.json';

        ! fs.existsSync( JSON_POSTS_PATH ) ?
        fs.writeFileSync( JSON_POSTS_PATH, '[]', MainProcess.data.charset)
        : null;

        let JSON_POSTS_DATA = JSON.parse(fs.readFileSync(JSON_POSTS_PATH, MainProcess.data.charset));

        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });

        return res.end(JSON.stringify({
          success: true,
          data: JSON_POSTS_DATA
        }));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: false,
          data: 'Error 500'
        }));
      }
    });
  }

  postPost(MainProcess, uri){
    MainProcess.app.post(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'Posts' } );
      try {

        console.log(colors.yellow(' BODY -> '));
        console.log(colors.green(util.jsonSave(req.body)));

        const JSON_POSTS_PATH = './data/posts.json';

        ! fs.existsSync( JSON_POSTS_PATH ) ?
        fs.writeFileSync( JSON_POSTS_PATH, '[]', MainProcess.data.charset)
        : null;

        let JSON_POSTS_DATA = JSON.parse(fs.readFileSync(JSON_POSTS_PATH, MainProcess.data.charset));

        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });

        JSON_POSTS_DATA.push(req.body);

        fs.writeFileSync( JSON_POSTS_PATH, util.jsonSave(JSON_POSTS_DATA), MainProcess.data.charset);
        return res.end(JSON.stringify({
          success: true,
          data: JSON_POSTS_DATA
        }));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: false,
          data: 'Error 500'
        }));
      }
    });
  }

}

export { Posts };
