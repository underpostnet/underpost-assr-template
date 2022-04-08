
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import Ajv from 'ajv';

import { util, info }
from '../../underpost_modules/underpost.js';

/* WORKER */
class Posts {

  constructor(MainProcess){
      this.JSON_POSTS_PATH = './data/raw/posts.json';
      this.JSON_STRUCT_PATH = './data/structs/post.json';
      this.postPost(MainProcess, '/posts');
      this.getPosts(MainProcess, '/posts');
  }

  async readDataPosts(MainProcess){
    return JSON.parse(await fs.readFileSync(this.JSON_POSTS_PATH, MainProcess.data.charset));
  }
  async writeDataPosts(MainProcess, newData){
    await fs.writeFileSync( this.JSON_POSTS_PATH, util.jsonSave(newData), MainProcess.data.charset);
  }
  async checkDataDir(MainProcess){
    ! await fs.existsSync( this.JSON_POSTS_PATH ) ?
    await this.writeDataPosts(MainProcess, []) : null;
  }

  async searchPostByTitle(MainProcess, searchTerm){
    let posts = [];
    const dataPosts = await this.readDataPosts(MainProcess);
    dataPosts.map( post => {
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
    MainProcess.app.get(uri, async (req, res) => {
      info.api(req, { uri, apiModule: 'Posts' } );
      try {
        await this.checkDataDir(MainProcess);
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: true,
          data: req.query.s ?
            await this.searchPostByTitle(MainProcess, req.query.s):
            await this.readDataPosts(MainProcess)
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

  async validateStruct(MainProcess, post){
    // https://thabo-ambrose.medium.com/use-custom-date-time-format-for-ajv-schema-validation-38e336dbd6ed
    const postStruct = JSON.parse(await fs.readFileSync(this.JSON_STRUCT_PATH, MainProcess.charset));
    const ajv = new Ajv({schemas: [postStruct]});
    ajv.addFormat('date-ISO8601', {
      validate: dateTimeString => util.isoDateRegex().test(dateTimeString)
    });
    const validate = ajv.getSchema(postStruct["$id"]);
    return validate(post);
  }

  postPost(MainProcess, uri){
    MainProcess.app.post(uri, async (req, res) => {
      info.api(req, { uri, apiModule: 'Posts' } );
      try {
        // console.log(colors.yellow(' BODY -> '));
        // console.log(colors.green(util.jsonSave(req.body)));
        await this.checkDataDir(MainProcess);
        let JSON_POSTS_DATA = await this.readDataPosts(MainProcess);
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
                success = await this.validateStruct(MainProcess, req.body);
                success ? JSON_POSTS_DATA[indPost] = req.body: req.body = 'struct error';
              }
              break;
            }
            indPost++;
          }
        }else{
          req.body.id = util.makeid(1) + '-' + util.getHash().split('-').pop();
          success = await this.validateStruct(MainProcess, req.body);
          success ? JSON_POSTS_DATA.push(req.body): req.body = 'struct error';
        }
        await this.writeDataPosts(MainProcess, JSON_POSTS_DATA);
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
/* WORKER */

export { Posts };
