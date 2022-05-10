// servicio

// Beare con https://github.com/auth0/node-jsonwebtoken

// State
// logIn
// SignIn
// logOut


import colors from 'colors/safe.js';
import fs from 'fs';
import { util, navi, rest, files, info }
from '../../underpost_modules/underpost.js';
import jwt from 'jsonwebtoken';

class Auth {

  constructor(MainProcess){
    this.nameModule = "Auth";
    this.createToken(MainProcess, '/auth/token');
    this.verifyToken(MainProcess, '/auth/verify');
  }


  createToken(MainProcess, uri){
    MainProcess.app.post(uri, (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try{
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        return res.end(
          jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + (60 * 60 * MainProcess.data.api.EXPIRE),
              data: req.body
            },
            MainProcess.data.api.SECRET
          )
        );
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

  verifyToken(MainProcess, uri){
    MainProcess.app.post(uri, (req, res) => {
      info.api(req, { uri, apiModule: this.nameModule } );
      try{
        res.writeHead( 200, {
          'Content-Type': ('application/json; charset='+MainProcess.data.charset),
          'Content-Language': '*'
        });
        const authHeader = String(req.headers['authorization'] || '');
        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7, authHeader.length);
          console.log(token);
          return res.end(
            JSON.stringify(jwt.verify(token, MainProcess.data.api.SECRET))
          );
        }
        return res.end(
          "invalid bearer token"
        );
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


}

export { Auth };
