
'use strict';

import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';

import { Keys } from '../../underpost_modules/underpost-modules-v1/keys/class/Keys.js';

class Network {

  constructor(MainProcess){
      this.nameModule = 'Network';
      this.consoleFolderName = '/underpost-console';
      this.consoleAbsolutePath = 'c:/dd';
      this.consoleRelativePath = '../..';
      this.uriPathKeys = '/data/network/keys';
      this.getKeys(MainProcess, '/network/keys');
      this.createKey(MainProcess, '/network/keys');
      this.deleteKey(MainProcess, '/network/keys');
  }

  getKeys(MainProcess, uri){
    MainProcess.app.get(uri, (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try {
        const pathReadKeys = this.consoleRelativePath+this.consoleFolderName+this.uriPathKeys;
        return res.end((()=>{
          let PathsKeys = [];
          files.readRecursive(pathReadKeys,
          dir => PathsKeys.push(dir));
          // PathsKeys = PathsKeys.map(x=>x.split(this.uriPathKeys)[1]);
          console.log(colors.yellow(' Network > get paths >'));
          console.log(PathsKeys);
          PathsKeys = PathsKeys.map((v,i,a) => {
            return   {
               id: v.split('symmetric/')[1] ? v.split('symmetric/')[1].split('/')[0] : ' - ',
               // path: v.split(this.uriPathKeys)[1],
               date: new Date(fs.statSync(v).birthtime).getTime(),
               type: v.split('/').includes('asymmetric') ? 'asymmetric' : 'symmetric'
             }
          });
          PathsKeys = PathsKeys.sort((a, b) =>  b['date'] - a['date']); // desc
          // a - b -> asc
          PathsKeys = PathsKeys.map( x => {
            x.date = new Date(x.date).toISOString();
            return x;
          });
          PathsKeys = PathsKeys.filter((v,i,a)=>i%2==0);
          res.writeHead( 200, {
            'Content-Type': ('application/json; charset='+MainProcess.data.charset),
            'Content-Language': '*'
          });
          return JSON.stringify(PathsKeys);
        })());
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end('Error 500');
      }
    });
  }

  createKey(MainProcess, uri){
    MainProcess.app.post(uri, async (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try {
        console.log(util.jsonSave(req.body));
        const path = this.consoleAbsolutePath+this.consoleFolderName+this.uriPathKeys;
        let success = false;
        let dataReturn = {};
        if(req.body.asymmetric === true){
          dataReturn.asymmetric = await new Keys().generateAsymmetricKeys({
            passphrase: req.body.keyPass,
            path
          });
        }
        if(req.body.symmetric === true){
          dataReturn.symmetric = await new Keys().generateSymmetricKeys({
            passphrase: req.body.keyPass,
            path
          });
        }
        if(
          dataReturn.asymmetric!=null
          ||
          dataReturn.symmetric!=null
        ){
          success = true;
        }
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success,
          ...dataReturn
        }));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: false,
          error
        }));
      }
    });


  }


  deleteKey(MainProcess, uri){
    MainProcess.app.delete(uri, (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try {
        console.log(util.jsonSave(req.body));
        const path = this.consoleAbsolutePath+this.consoleFolderName+this.uriPathKeys+'/'+req.body.type+'/'+req.body.id;
        console.log('del', path);
        files.deleteFolderRecursive(path);
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: true
        }));
      }catch(error){
        console.log(colors.red(error));
        res.writeHead( 500, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(JSON.stringify({
          success: false,
          error
        }));
      }
    });
  }

}

export { Network };
