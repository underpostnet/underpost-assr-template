
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import Ajv from 'ajv';

import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

class Posts {

  constructor(MainProcess){
      this.JSON_POSTS_PATH = './data/raw/posts.json';
      this.JSON_STRUCT_PATH = './data/structs/post.json';
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
            if(util.tl(titlePart)==util.tl(search)){
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

  validateStruct(MainProcess, post){
    // https://thabo-ambrose.medium.com/use-custom-date-time-format-for-ajv-schema-validation-38e336dbd6ed
    const postStruct = JSON.parse(fs.readFileSync(this.JSON_STRUCT_PATH, MainProcess.charset));
    const ajv = new Ajv({schemas: [postStruct]});
    ajv.addFormat('date-ISO8601', {
      validate: dateTimeString => util.isoDateRegex().test(dateTimeString)
    });
    const validate = ajv.getSchema(postStruct["$id"]);
    return validate(post);
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
        let success = true;
        if(req.body.id!=undefined || req.body.del!=undefined){
          let indPost = 0;
          for(let post of JSON_POSTS_DATA){
            if(req.body.id == post.id){
              if(req.body.del!=undefined){
                JSON_POSTS_DATA.splice(indPost, 1);
              }else{
                success = this.validateStruct(MainProcess, req.body);
                success ? JSON_POSTS_DATA[indPost] = req.body: req.body = 'struct error';
              }
              break;
            }
            indPost++;
          }
        }else{
          req.body.id = util.makeid(1) + '-' + util.getHash().split('-').pop();
          success = this.validateStruct(MainProcess, req.body);
          success ? JSON_POSTS_DATA.push(req.body): req.body = 'struct error';
        }
        this.writeDataPosts(MainProcess, JSON_POSTS_DATA);
        return res.end(JSON.stringify({
          success,
          data: req.body
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
