var TronWeb = require('tronweb')

const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
    privateKey: process.env.PRIVATE_KEY_SHASTA
})

const LandResourceProxy = {
 	base58: "TSKyF5JbqxPT8fXYJpAqjFrFqz3uqF1QjP",
	hex: "41b36f434a28fcbc921b92182ca79af872b476cdc1"
}

const LandResource = {
 	base58: "TXVDDVtHLRaKxBMaE44GHbabZQG15Ae1Jo",
	hex: "41ec074ca24e9db3c8b3f378e3e65d0d0bd35c9824"
}

const TokenUseAuthority = {
  base58: "TMFVEHzryA7WtYcc5k66wBKdcYD9bCJ7w9",
  hex: "417bbd95eb1ff47f75d8c2c09d910072b50ce061f1"
}

const MintAndBurnAuthority = {
  base58: "TV9C9MTCagM9csAGcY9LqwqPbtx1jGqiMC",
  hex: "41d24dd5896f1ed81ea4dac7e9070a8789260bddd9"
}


const SETTINGSREGISTRY = {
  base58: "TV7XzfAcDrcpFmRkgCh2gg8wf15Cz9764W",
  hex: "41d1fd927d8bf55bff2dfb8248047bc9881e710cc7"
}

const OLD_LAND = {
  base58: "TB8uz1tL6HFcG51h2gq7u1YzuAPtJCdM3n",
  hex: "410CCE145A83F344E290613028EA3123EB473E69CB"
}

const LandResourceAuthority = {
  base58: "TQCr6mPg4C3HDKFU72m34Vn8C3PLc3g4sN",
  hex: "419C2622FC3074864A19BF9CC1D8E7B50EB60BE31C"
}

let resourceStartTime = 1579422612;

let params = {
  feeLimit:1_00_000_000,
  callValue:0,
  userFeePercentage:1,
  originEnergyLimit:10_000_000,
  shouldPollResponse:false
}


let cst = { _isConstant: true }

const app = async () => {
  tronWeb.setDefaultBlock('latest');

  let registry = await tronWeb.contract().at(SETTINGSREGISTRY.hex);
  let landrs_proxy = await tronWeb.contract().at(LandResourceProxy.hex)
  console.log(0, await landrs_proxy.upgradeTo(LandResource.hex).send(params)) 
  console.log(1, await landrs_proxy.initializeContract(SETTINGSREGISTRY.hex, resourceStartTime, OLD_LAND.hex).send(params))
  let token_use_addr = await registry.addressOf("0x434f4e54524143545f544f4b454e5f5553450000000000000000000000000000").call() 

  let token_use = await tronWeb.contract().at(token_use_addr)
  console.log(2, await token_use.setAuthority(TokenUseAuthority.hex).send(params))
  let old_land = await tronWeb.contract().at(OLD_LAND.hex)
  console.log(3, await old_land.setAuthority("410000000000000000000000000000000000000000").send(params))
  console.log(4, await landrs_proxy.setAuthority(LandResourceAuthority.hex).send(params)) 

  let gold_addr = await registry.addressOf("0x434f4e54524143545f474f4c445f45524332305f544f4b454e00000000000000").call()
  let wood_addr = await registry.addressOf("0x434f4e54524143545f574f4f445f45524332305f544f4b454e00000000000000").call()
  let water_addr = await registry.addressOf("0x434f4e54524143545f57415445525f45524332305f544f4b454e000000000000").call()
  let fire_addr = await registry.addressOf("0x434f4e54524143545f464952455f45524332305f544f4b454e00000000000000").call()
  let sioo_addr = await registry.addressOf("0x434f4e54524143545f534f494c5f45524332305f544f4b454e00000000000000").call()
  // CONTRACT_LAND_RESOURCE old "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
  let gold = await tronWeb.contract().at(gold_addr)
  let wood = await tronWeb.contract().at(wood_addr)
  let water = await tronWeb.contract().at(wood_addr)
  let fire = await tronWeb.contract().at(fire_addr)
  let sioo = await tronWeb.contract().at(sioo_addr)
  console.log(5, await gold.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(6, await wood.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(7, await water.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(8, await fire.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(9, await sioo.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(10, await registry.setAddressProperty("0x434f4e54524143545f4c414e445f5245534f5552434500000000000000000000", LandResourceProxy.hex).send(params))
  console.log("finished");
};

app();
