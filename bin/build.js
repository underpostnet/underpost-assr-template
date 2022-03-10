

'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const { promises: fs } = require('fs');
const shell = require('shelljs');
const path = require('path');
const colors = require('colors/safe.js');
const _fs = require('fs');

const ignore = ['.git', '.gitignore'];
const dev = process.argv.slice(2)[0]=='d' ? true: false;
const charset = 'utf-8';

console.log(process.argv);

const copyDir = async (src, dest, ignore) => {
   ignore == undefined ? ignore = [] : null;
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

  ! _fs.existsSync( './underpost_modules' ) ?
  _fs.mkdirSync( './underpost_modules' ) : null;

  console.log(colors.yellow(' build -> underpost_modules'));
  _fs.writeFileSync(
    './underpost_modules/underpost.js',
    _fs.readFileSync( '../underpost.net/underpost.js', charset ),
    charset
  );
  _fs.writeFileSync(
    './underpost_modules/package.json',
    _fs.readFileSync( '../underpost.net/package.json', charset ),
    charset
  );

  console.log(colors.yellow(' build -> underpost-modules-v1'));
  await copyDir('../underpost.net/underpost-modules-v1', './underpost_modules/underpost-modules-v1', ignore);

  console.log(colors.yellow(' build -> underpost-modules-v2'));
  await copyDir('../underpost.net/underpost-modules-v2', './underpost_modules/underpost-modules-v2', ignore);

  console.log(colors.yellow(' build -> underpost-library'));
  await copyDir('../underpost-library', './underpost_modules/underpost-library', ignore);

  console.log(colors.yellow(' build -> underpost-data-template'));
  await copyDir('../underpost-data-template', './underpost_modules/underpost-data-template', ignore);



  _fs.writeFileSync(
    './data/handlebars/robots.txt',
    _fs.readFileSync( './underpost_modules/underpost-data-template/handlebars/robots.txt', charset ),
    charset
  );

  _fs.writeFileSync(
    './data/structs/jsonld.json',
    _fs.readFileSync( './underpost_modules/underpost-data-template/structs/jsonld.json', charset ),
    charset
  );

  _fs.writeFileSync(
    './data/structs/post.json',
    _fs.readFileSync( './underpost_modules/underpost-data-template/structs/post.json', charset ),
    charset
  );

  if(dev === true){
    shell.exec('node src/app d');
    // eslint formatter npm rename files js
  }
};

build();

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------



















// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
