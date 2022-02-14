

'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const { promises: fs } = require('fs');
const shell = require('shelljs');
const path = require('path');
const colors = require('colors/safe.js');

const ignore = ['.git', '.gitignore'];
const dev = process.argv.slice(2)[0]=='d' ? true: false;
const charset = 'utf-8';

console.log(process.argv);

const copyDir = async (src, dest, ignore) => {
   await fs.mkdir(dest, { recursive: true });
   let entries = await fs.readdir(src, { withFileTypes: true });

   for (let entry of entries) {
       let srcPath = path.join(src, entry.name);
       let destPath = path.join(dest, entry.name);
       
       ignore.filter(x=>x==entry.name).length === 0 ?
       entry.isDirectory() ?
           await copyDir(srcPath, destPath, ignore)
           .catch( err => console.log(colors.red(err))) :
           await fs.copyFile(srcPath, destPath)
           .catch( err => console.log(colors.red(err))) :
           null;
   }
};

const build = async () => {

  // current bin folder

  console.log(colors.yellow(' build -> underpost-modules-v1'));
  await copyDir('../underpost.net/underpost-modules-v1', './underpost-modules-v1', ignore);
  console.log(colors.yellow(' build -> underpost-modules-v2'));
  await copyDir('../underpost.net/underpost-modules-v2', './underpost-modules-v2', ignore);
  console.log(colors.yellow(' build -> underpost-library'));
  await copyDir('../underpost-library', './underpost-library', ignore);
  if(dev === true){
    shell.exec('node src/app d');
  }
};

build();

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------



















// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
