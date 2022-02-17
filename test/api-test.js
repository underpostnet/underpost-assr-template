
'use strict';

import assert from  'assert';
import colors from 'colors/safe.js';

import { util, navi, rest, files, info }
from '../underpost_modules/underpost.js';

class MochaApiTest {
  constructor(){



    describe('api-test.js', () => {

      describe('POST /test', () => {
        const testData = {
          data: 'test'
        };
        const expected = JSON.stringify(testData);
        it('Expected response -> '+expected, async () =>
          assert.equal(expected, JSON.stringify(
          await rest.FETCH(
            'post',
            'http://localhost:5000/test',
             testData
        ))));
      });

    });



  }
}

new MochaApiTest();
