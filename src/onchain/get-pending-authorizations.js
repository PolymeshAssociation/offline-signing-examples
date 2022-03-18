const { getPolkadotApi } = require('../utils');

/**
 * Get all pending non-expired "Join Identity" authorization request IDs for an address.
 * These IDs can later be used with `joinIdentity` to accept the authorization request
 * and add the address as a secondary key to the Identity
 * 
 * @param {string} userAddress
 * 
 * @returns {number[]} ids of pending authorizations
 */
async function getPendingAuthorizations(userAddress) {
  const api = await getPolkadotApi();

  const pendingAuths = await api.rpc.identity.getFilteredAuthorizations(
    { Account: userAddress },
    true,
    'JoinIdentity',
  );
  
  const ids = pendingAuths.map(({ auth_id }) => auth_id.toNumber());

  console.log('======================');
  console.log('Pending authorization IDs:', ids);
  console.log('======================');

  return ids;
}

module.exports = {
  getPendingAuthorizations,
};