const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

// if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
//   // We are in the browser and metamask is running.
//   web3 = new Web3(window.web3.currentProvider);
// } else {
//   // We are on the server *OR* the user is not running metamask
//   const provider = new Web3.providers.HttpProvider(
//     'https://ropsten.infura.io/v3/5355489b727447fda00f84826bb086de'
//   );
//   web3 = new Web3(provider);
// }

//Ropsten
// const provider = new HDWalletProvider(
//   'wood shiver rice upon ride island olive source scheme unusual people gauge',
//   'https://ropsten.infura.io/v3/5355489b727447fda00f84826bb086de'
// );

//Rinkeby
const provider = new HDWalletProvider(
  'wood shiver rice upon ride island olive source scheme unusual people gauge',
  'https://rinkeby.infura.io/v3/5355489b727447fda00f84826bb086de'
);

web3 = new Web3(provider);

module.exports = web3;