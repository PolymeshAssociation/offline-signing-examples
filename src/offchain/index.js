const { addCddClaim } = require('./add-cdd-claim');
const { addSecondaryKey } = require('./add-secondary-key');
const { joinIdentity } = require('./join-identity');
const { registerIdentity } = require('./register-identity');
const { transferWithMemo } = require('./transfer-with-memo');

module.exports = {
  addCddClaim,
  addSecondaryKey,
  joinIdentity,
  registerIdentity,
  transferWithMemo,
};