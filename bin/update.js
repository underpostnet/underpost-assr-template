

'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors/safe.js');

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


shell.exec('node bin/build');







// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
