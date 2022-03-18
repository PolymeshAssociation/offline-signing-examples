# Polymesh offline signing examples

## Components

### Schema

The `schema.js` file contains the custom Polymesh types and RPC signatures. These are necessary for transactions and storage queries to be encoded properly

### Utils

Most of the heavy lifting is done here. Take special note of the section where the `methods` object exported by `polkadot-txwrapper` is decorated with custom Polymesh transactions.

For these examples, on-chain data for offline transaction building and signing (such as the latest block, current account nonce, chain metadata, etc) is being requested via websocket. On-chain data used to pass to methods (such as authorization IDs and claim status) is being fetched using the polkadot.js API.

Exports:

- submitTx: submits a signed and serialized transaction via RPC
- constructSerializedTx: receives a private key, a transaction method and its arguments, and returns a serialized transaction ready to be submitted. It also deserializes it and prints out the result
- getPolkadotApi: helper function to instantiate and return a polkadot.js API client
- methods: `polkadot-txwrapper` methods decorated with custom Polymesh transactions

#### Customization

The `CONSTANTS` section contains the SS58 format, chain name, node URL and address type (sr25519 or ed25519) used to sign. These should be adjusted depending on the use case

The `getTxData` function can be adjusted or replaced to fit your specific use case (for example, if fetching this data from an internal API or just hard-coding it)

### Onchain

The `onchain` directory contains the following queries to the chain:

- getIdentityStatus: receives an address and returns its associated identity (if any) and whether it has a valid CDD claim
- getPendingAuthorizations: receives an address and returns the IDs of all its pending "JoinIdentity" authorization requests

### Offchain

The `offchain` directory contains functions that generate signed and serialized transaction payloads ready to be submitted to the chain. All of them take the private key that will sign as the first parameter:

- registerIdentity: takes an address and associates it to a new Identity
- addCddClaim: adds a Customer Due Diligence claim to an existing Identity
- addSecondaryKey: associates an address as a secondary key of an existing Identity. This creates an authorization request that must be accepted by the target address
- joinIdentity: accepts an authorization request to join an Identity as a secondary key
- transferWithMemo: transfers POLYX from the calling address to another one, with an optional message

#### Transaction Fees

All transactions are paid by the calling address, except for `joinIdentity`, which is paid by the address that created the invitation to join the Identity.

Example:

- Alice and Bob are both addresses in Polymesh. Alice is part of an Identity, while Bob is not
- Alice calls `addSecondaryKey` to invite Bob to join her Identity. Alice pays for this transaction and an authorization request is created
- Bob calls `joinIdentity` to accept the invitation. This transaction will also be paid for by Alice, since Bob cannot hold any POLYX until he becomes part of an Identity

## Workflows

For these examples, we will use Alice and Bob as separate addresses in the Polymesh blockchain

### Onboarding a user

Precondition: Alice is part of a CDD provider Identity, Bob is not

- Alice calls `offchain.registerIdentity` to create an Identity for Bob
- The new Identity's DID is fetched using `onchain.getIdentityStatus` for Bob
- Alice calls `offchain.addCddClaim` with the fetched DID to add a CDD claim to Bob's new Identity
- Bob is now properly onboarded. This can be verified by calling `onchain.getIdentityStatus` once again. They can now receive POLYX and interact with the Polymesh blockchain with no interference from Alice or anyone else

```javascript
// main.js
const onchain = require("./onchain");
const offchain = require("./offchain");
const { submitTx } = require("./utils");

(async () => {
  const registerTx = await offchain.registerIdentity(
    alice.privateKey,
    bob.address
  );

  await submitTx(registerTx);

  const { did } = await onchain.getIdentityStatus(bob.address);

  const cddTx = await offchain.addCddClaim(alice.privateKey, did);

  await submitTx(cddTx);

  // double check status (the function logs the results)
  await onchain.getIdentityStatus(user1.address);
})().catch((err) => console.error(err));
```

### Adding secondary keys to an Identity

Precondition: Alice is part of an Identity, Bob is not

- Alice calls `offchain.addSecondaryKey` to invite Bob to join her Identity. An authorization request is created
- The authorization request's ID is fetched using `onchain.getPendingAuthorizations`. The result is an array, so taking the last element should yield the most recent invitation
- Bob calls `offchain.joinIdentity` to accept the invitation
- Bob is now a secondary key in Alice's Identity. They can receive and send POLYX

```javascript
// main.js
const onchain = require("./onchain");
const offchain = require("./offchain");
const { submitTx } = require("./utils");

(async () => {
  const addSecondaryKey = await offchain.addSecondaryKey(
    alice.privateKey,
    bob.address
  );

  await submitTx(addSecondaryKey);

  const ids = await onchain.getPendingAuthorizations(bob.address);

  // notice that this one is being signed by the other account
  const joinIdentityTx = await offchain.joinIdentity(
    bob.privateKey,
    ids[ids.length - 1]
  );

  await submitTx(joinIdentityTx);
})().catch((err) => console.error(err));
```

### Transferring POLYX

Precondition: Alice and Bob are part of Identities. For this, they can
be both part of the same one, or not

- Alice calls `offchain.transferWithMemo` to send POLYX to Bob along with an optional message that identifies the transfer
- The POLYX is transferred between both users and the message is emitted as the last argument of an on-chain `Transfer` event

```javascript
// main.js
const onchain = require("./onchain");
const offchain = require("./offchain");
const { submitTx } = require("./utils");

(async () => {
  const transferTx = await offchain.transferWithMemo(
    alice.privateKey,
    bob.address,
    "1000000000", // this will transfer 1000 POLYX
    "INITIAL TRANSFER" // message length max is 32 chars
  );
  await submitTx(transferTx);
})().catch((err) => console.error(err));
```
