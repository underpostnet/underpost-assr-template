

'use strict';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const shell = require('shelljs');
const { promises: fs } = require('fs');
const _fs = require('fs');
const path = require('path');

const projectName = 'underpost-assr-template';

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath)
            .catch( err => null/*console.log(colors.red(err))*/) :
            await fs.copyFile(srcPath, destPath)
            .catch( err => null/*console.log(colors.red(err))*/);
    }
};

const colors = require('colors/safe.js');
const charset = 'utf8';

const getProjectName = dep => dep.split('/').pop();

const writeModules = async () => {
  await copyDir('../underpost.net/underpost-modules-v1', './underpost-modules-v1');
  await copyDir('../underpost.net/underpost-modules-v2', './underpost-modules-v2');
  await copyDir('../underpost-library', './underpost-library');
};

const install = async dep => {
  console.log(colors.yellow(' install -> '+getProjectName(dep)));
  shell.cd('..');
  shell.exec('git clone '+dep);
  shell.cd(projectName);
  await writeModules();
};
const update = async dep => {
  console.log(colors.yellow(' update -> '+getProjectName(dep)));
  shell.cd('..');
  shell.cd(getProjectName(dep));
  shell.exec('git pull origin master');
  shell.cd('..');
  shell.cd(projectName);
  await writeModules();
};

[
  'https://github.com/underpostnet/underpost.net',
  'https://github.com/underpostnet/underpost-data-template',
  'https://github.com/underpostnet/underpost-library'
].map( dep => _fs.existsSync('../'+getProjectName(dep) ) ?
        update(dep) : install(dep) );










// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
