
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
        it('Expected response -> '+expected, async () => {
          const response = JSON.stringify(await rest.postJSON(
            'http://localhost:5000/test',
             testData
          ));
          return assert.equal(expected, response);
        });
      });

    });



  }
}

new MochaApiTest();
