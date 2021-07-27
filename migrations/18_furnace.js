var OwnedUpgradeabilityProxy = artifacts.require("OwnedUpgradeabilityProxy")
var LandResourceV6 = artifacts.require("LandResourceV6")
var TronWeb = require('tronweb')

const SETTINGSREGISTRY = {
  base58: "TV7XzfAcDrcpFmRkgCh2gg8wf15Cz9764W",
  hex: "41d1fd927d8bf55bff2dfb8248047bc9881e710cc7"
}

const Supervisor = {
  base58: "TA2YGCFuifxkJrkRrnKbugQF5ZVkJzkk4p",
  hex: "4100A1537D251A6A4C4EFFAB76948899061FEA47B9"
}

const OLD_LAND = {
  base58: "TB8uz1tL6HFcG51h2gq7u1YzuAPtJCdM3n",
  hex: "410CCE145A83F344E290613028EA3123EB473E69CB"
}

const LandResourceAuthority = {
  base58: "TQCr6mPg4C3HDKFU72m34Vn8C3PLc3g4sN",
  hex: "419c2622fc3074864a19bf9cc1d8e7b50eb60be31c"
}

const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
  privateKey: process.env.PRIVATE_KEY_SHASTA
})

let network;
let resourceStartTime = 1579422612;
let params = {
  feeLimit:1000000000,
  callValue: 0,
  shouldPollResponse:true
}

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
      await asyncDeploy(deployer, network, accounts);
  });
};

async function asyncDeploy(deployer, network, accounts) {
  if (network == "shasta") {
    network = 200001
  } else if (network == "mainnet") {
    network = 200000
  }
  tronWeb.setDefaultBlock('latest');

  //---------------------upgrade-------------------------//
  // await deployer.deploy(OwnedUpgradeabilityProxy)
  // let proxy = await OwnedUpgradeabilityProxy.deployed()
  await deployer.deploy(LandResourceV6, SETTINGSREGISTRY.hex, resourceStartTime, OLD_LAND.hex)
  let landrs = await LandResourceV6.deployed()
  // proxy.upgradeTo(landrs.address)
  // console.log("upgrade succeed")
  // let land_proxy = await tronWeb.contract(LandResourceV6._json.abi, proxy.address)
  // let land_proxy = await tronWeb.contract(LandResourceV6._json.abi, "41e8268b0ceaafa84fd3d20da5b4a4ed4bdc00f5a1")
  // await land_proxy.initializeContract(SETTINGSREGISTRY.hex, resourceStartTime, OLD_LAND.hex).send(params)
  console.log("initialize succeed")
  // await land_proxy.setAuthority(LandResourceAuthority.hex) //TODO: remove old landrs auth
  // console.log("LandResourceV6 setAuthority succeed.")
  // CONTRACT_LAND_RESOURCE old "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
  // let registry = await tronWeb.contract().at(SETTINGSREGISTRY.hex);
  // await registry.setAddressProperty("0x434f4e54524143545f4c414e445f5245534f5552434500000000000000000000", landrs.address).send(params)
  // console.log("Upgrade LandResource succeed.")
}

