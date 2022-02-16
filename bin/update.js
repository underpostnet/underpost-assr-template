

'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors/safe.js');
const admZip = require('adm-zip');
const request = require('superagent');

const projectName = 'underpost-assr-template';
const charset = 'utf8';

const getProjectName = dep => dep.split('/').pop();

const install = dep => {
  console.log(colors.yellow(' install -> '+getProjectName(dep)));
  shell.cd('..');
  shell.exec('git clone '+dep);
  shell.cd(projectName);
};

const update = dep => {
  console.log(colors.yellow(' update -> '+getProjectName(dep)));
  shell.cd('..');
  shell.cd(getProjectName(dep));
  shell.exec('git pull origin master');
  shell.cd('..');
  shell.cd(projectName);
};

[
  'https://github.com/underpostnet/underpost.net',
  'https://github.com/underpostnet/underpost-data-template',
  'https://github.com/underpostnet/underpost-library'
].map( dep => fs.existsSync('../'+getProjectName(dep) ) ?
        update(dep) : install(dep) );


request
  .get('https://underpost.net/download/fontawesome-free-5.3.1.zip')
  .on('error', function(error) {
    console.log(error);
  })
  .pipe(fs.createWriteStream('./fontawesome-5.3.1.zip'))
  .on('finish', function() {
    console.log('finished dowloading');
    const zip = new admZip('./fontawesome-5.3.1.zip');
    console.log('start unzip');
    zip.extractAllTo('./underpost_modules', true);
    console.log('finished unzip');
    fs.unlinkSync('./fontawesome-5.3.1.zip');
    fs.renameSync(
      './underpost_modules/fontawesome-free-5.3.1-web',
      './underpost_modules/fontawesome'
    );

    shell.exec('node bin/build');

  });










// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
