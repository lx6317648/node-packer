'use strict';

const common = require('../common');

common.skipIfEslintMissing();

const RuleTester = require('../../tools/node_modules/eslint').RuleTester;
const rule = require('../../tools/eslint-rules/crypto-check');

const message = 'Please add a hasCrypto check to allow this test to be ' +
                'skipped when Node is built "--without-ssl".';

new RuleTester().run('crypto-check', rule, {
  valid: [
    'foo',
    'crypto',
    `
    if (!common.hasCrypto) {
      common.skip("missing crypto");
    }
    require("crypto");
    `
  ],
  invalid: [
    {
      code: 'require("common")\n' +
            'require("crypto")',
      errors: [{ message }],
      output: 'require("common")\n' +
              'if (!common.hasCrypto) {' +
              ' common.skip("missing crypto");' +
              '}\n' +
              'require("crypto")'
    },
    {
      code: 'require("common")\n' +
            'if (common.foo) {}\n' +
            'require("crypto")',
      errors: [{ message }],
      output: 'require("common")\n' +
              'if (!common.hasCrypto) {' +
              ' common.skip("missing crypto");' +
              '}\n' +
              'if (common.foo) {}\n' +
              'require("crypto")'
    }
  ]
});
