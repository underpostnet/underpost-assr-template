
'use strict';

import assert from  'assert';
import colors from 'colors/safe.js';
import fs from 'fs';

import { util, navi, rest, files, info }
from '../underpost_modules/underpost.js';

import { UtilMod } from '../src/mods/util.js';

class MochaApiTest {
  constructor(){

    this.data = JSON.parse(fs.readFileSync(navi('../../../data/params/global.json'), 'utf8'));

    new UtilMod(this);

    describe(' Module: '+colors.green('Apitest'), () => {
      const endPointTest = this.util.buildUrl('/test');
      describe('POST '+endPointTest, () => {
        const testData = { data: 'test' };
        const expected = JSON.stringify(testData);
        it('Expected response -> '+expected, async () =>
          assert.equal(expected, JSON.stringify(
          await rest.FETCH(
             'post',
             endPointTest,
             testData
        ))));
      });
    });

    describe(' Module: '+colors.green('Network'), () => {
      const endPointTest = this.util.buildUrl('/network/get-paths');
      describe('GET '+endPointTest, () => {
        const expected = 'object';
        it('Expected response -> '+expected, async () =>
          assert.equal(expected, typeof(
          await rest.FETCH(
            'get',
             endPointTest
        ))));
      });
    });

  }
}

new MochaApiTest();
