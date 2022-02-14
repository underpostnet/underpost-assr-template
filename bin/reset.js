


'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const path = require('path');
const colors = require('colors/safe.js');
const fs = require('fs');
const charset = 'utf-8';

const deleteFolderRecursive = path => {
 if( fs.existsSync(path) ) {
     fs.readdirSync(path).forEach( file => {
       const curPath = path + "/" + file;
         if(fs.lstatSync(curPath).isDirectory()) { // recurse
             deleteFolderRecursive(curPath);
         } else { // delete file
             fs.unlinkSync(curPath);
         }
     });
     fs.rmdirSync(path);
   }
 };

[
  './node_modules',
  './underpost-library',
  './underpost-modules-v1',
  './underpost-modules-v2'
].map( path => deleteFolderRecursive(path) );





 // -----------------------------------------------------------------------------
 // -----------------------------------------------------------------------------
