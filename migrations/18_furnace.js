var OwnedUpgradeabilityProxy = artifacts.require("OwnedUpgradeabilityProxy")
var LandResourceV6 = artifacts.require("LandResourceV6")
var TokenUseAuthority = artifacts.require("TokenUseAuthority")
var MintAndBurnAuthority = artifacts.require('MintAndBurnAuthority');
var TronWeb = require('tronweb')

const SETTINGSREGISTRY = {
  base58: "TV7XzfAcDrcpFmRkgCh2gg8wf15Cz9764W",
  hex: "41d1fd927d8bf55bff2dfb8248047bc9881e710cc7"
}

const Supervisor = {
  base58: "TA2YGCFuifxkJrkRrnKbugQF5ZVkJzkk4p",
  hex: "4100A1537D251A6A4C4EFFAB76948899061FEA47B9"
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
  tronWeb.setDefaultBlock('latest');
  let registry = await tronWeb.contract().at(SETTINGSREGISTRY.hex);
  let landrs_abi = [
    ...OwnedUpgradeabilityProxy.abi,
    ...LandResourceV6.abi
  ]
  let landrs_proxy = await tronWeb.contract().new({
    name: "LandResourceProxy",
    abi: landrs_abi,
    bytecode: OwnedUpgradeabilityProxy.bytecode,
    ...params
  });
  deployer.logger.log("LandResourceProxy" + ':\n    (base58) ' + tronWeb.address.fromHex(landrs_proxy.address) + '\n    (hex) ' + landrs_proxy.address)
  await deployer.deploy(LandResourceV6)
  let landrs = await LandResourceV6.deployed()

  let apostleBaseAddr = await registry.addressOf("0x434f4e54524143545f41504f53544c455f424153450000000000000000000000").call()
  await deployer.deploy(TokenUseAuthority, [apostleBaseAddr, landrs_proxy.address]);
  let tokenUseAuth = await TokenUseAuthority.deployed();

  await deployer.deploy(MintAndBurnAuthority, landrs_proxy.address);
  let mintAndBurnAuth = await MintAndBurnAuthority.deployed()
}

