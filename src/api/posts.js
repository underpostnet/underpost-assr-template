
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Posts {

  constructor(MainProcess){
      this.JSON_POSTS_PATH = './data/posts.json';
      this.postPost(MainProcess, '/posts');
      this.getPosts(MainProcess, '/posts');
  }

  readDataPosts(MainProcess){
    return JSON.parse(fs.readFileSync(this.JSON_POSTS_PATH, MainProcess.data.charset));
  }
  writeDataPosts(MainProcess, newData){
    fs.writeFileSync( this.JSON_POSTS_PATH, util.jsonSave(newData), MainProcess.data.charset);
  }
  checkDataDir(MainProcess){
    ! fs.existsSync( this.JSON_POSTS_PATH ) ?
    this.writeDataPosts(MainProcess, []) : null;
  }

  searchPostByTitle(MainProcess, searchTerm){
    let posts = [];
    this.readDataPosts(MainProcess).map( post => {
      let valid = false;
      for(let titlePart of post.title.split(' ')){
        for(let search of searchTerm.split(' ')){
            if(titlePart==search){
              valid = true;
            }
        }
      }
      if(valid){
        posts.push(post);
      }
    });
    return posts;
  }

  getPosts(MainProcess, uri){
    MainProcess.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: 'Posts' } );
      try {
        this.checkDataDir(MainProcess);
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: true,
          data: req.query.s ?
            this.searchPostByTitle(MainProcess, req.query.s):
            this.readDataPosts(MainProcess)
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
        // console.log(colors.yellow(' BODY -> '));
        // console.log(colors.green(util.jsonSave(req.body)));
        this.checkDataDir(MainProcess);
        let JSON_POSTS_DATA = this.readDataPosts(MainProcess);
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        JSON_POSTS_DATA.push(req.body);
        this.writeDataPosts(MainProcess, JSON_POSTS_DATA);
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
