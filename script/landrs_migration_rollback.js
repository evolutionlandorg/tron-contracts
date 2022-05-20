var TronWeb = require('tronweb')

const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
    privateKey: process.env.PRIVATE_KEY_SHASTA
})

const TokenUseAuthority = {
  base58: "TVa6fQNsCxAUbV58PihD8PMjDXSVL7WCC5",
  hex: "41D703A8392EC327076E36614115BA8EE8569C20C2"
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
  base58: "TJ3gYAMktHRTpvZzc3iQLiMHieYK4sGrU4",
  hex: "415899A7FEBDEF63CE6CF3F914C40002E14AC7F9C6"
}

let params = {
  feeLimit:1_00_000_000,
  callValue:0,
  userFeePercentage:1,
  originEnergyLimit:10_000_000,
  shouldPollResponse:false
}

const app = async () => {
  tronWeb.setDefaultBlock('latest');

  let registry = await tronWeb.contract().at(SETTINGSREGISTRY.hex);
  let token_use_addr = await registry.addressOf("0x434f4e54524143545f544f4b454e5f5553450000000000000000000000000000").call()

  let token_use = await tronWeb.contract().at(token_use_addr)
  console.log(1, await token_use.setAuthority(TokenUseAuthority.hex).send(params))
  let old_land = await tronWeb.contract().at(OLD_LAND.hex)
  console.log(2, await old_land.setAuthority(LandResourceAuthority.hex).send(params))

  let gold_addr = await registry.addressOf("0x434f4e54524143545f474f4c445f45524332305f544f4b454e00000000000000").call()
  let wood_addr = await registry.addressOf("0x434f4e54524143545f574f4f445f45524332305f544f4b454e00000000000000").call()
  let water_addr = await registry.addressOf("0x434f4e54524143545f57415445525f45524332305f544f4b454e000000000000").call()
  let fire_addr = await registry.addressOf("0x434f4e54524143545f464952455f45524332305f544f4b454e00000000000000").call()
  let sioo_addr = await registry.addressOf("0x434f4e54524143545f534f494c5f45524332305f544f4b454e00000000000000").call()
  // CONTRACT_LAND_RESOURCE old "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
  let gold = await tronWeb.contract().at(gold_addr)
  let wood = await tronWeb.contract().at(wood_addr)
  let water = await tronWeb.contract().at(water_addr)
  let fire = await tronWeb.contract().at(fire_addr)
  let sioo = await tronWeb.contract().at(sioo_addr)
  console.log(3, await gold.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(4, await wood.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(5, await water.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(7, await fire.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(9, await sioo.setAuthority(MintAndBurnAuthority.hex).send(params))
  console.log(9, await registry.setAddressProperty("0x434f4e54524143545f4c414e445f5245534f5552434500000000000000000000", OLD_LAND.hex).send(params))
  console.log("finished");
};

app();
