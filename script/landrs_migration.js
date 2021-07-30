var TronWeb = require('tronweb')
var LandResource = require("../build/contracts/LandResource.json");
var LandResourceV6 = require("../build/contracts/LandResourceV6.json");

const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
    privateKey: process.env.PRIVATE_KEY_SHASTA
})

const OLD_LAND = {
  base58: "TB8uz1tL6HFcG51h2gq7u1YzuAPtJCdM3n",
  hex: "410CCE145A83F344E290613028EA3123EB473E69CB"
}

const NEW_LAND = {
 	base58: "TGvMZ7yVmzN7NqgFYNzg5AmASjDbBEVfQL",
	hex: "414c3ec5a944a3eeefc04611bb861aef3b44ac29a7"
}

let params = {
  feeLimit:100000000,
  callValue: 0,
  shouldPollResponse:true
}

let cst = { _isConstant: true }

const app = async () => {
  tronWeb.setDefaultBlock('latest');
  let landId = "0x2a02000102000101000000000000000200000000000000000000000000000174"
  let gold = "41ec0ff3527ddba81f0cf5101fb31dc42b808ca1ab"
  let old_land = await tronWeb.contract(LandResource.abi, OLD_LAND.hex)
  console.log("land2ResourceMineState: ", await old_land.land2ResourceMineState(landId).call())
  console.log("getTotalMiningStrength: ", await old_land.getTotalMiningStrength(landId, gold).call())
  console.log("mintedBalanceOnLand: ", await old_land.mintedBalanceOnLand(landId, gold).call())

  console.log("getMinerOnLand 0: ", await old_land.getMinerOnLand(landId, gold, 0).call())
  console.log("getMinerOnLand 1: ", await old_land.getMinerOnLand(landId, gold, 1).call())
  console.log("getMinerOnLand 2: ", await old_land.getMinerOnLand(landId, gold, 2).call())
  console.log("getMinerOnLand 3: ", await old_land.getMinerOnLand(landId, gold, 3).call())
  console.log("getMinerOnLand 4: ", await old_land.getMinerOnLand(landId, gold, 4).call())

  let new_land = await tronWeb.contract(LandResourceV6.abi, NEW_LAND.hex)
  console.log("OLD_LAND: ", await new_land.OLD_LAND().call(cst))
  console.log("migrated: ", await new_land.migrated(landId).call(cst))
  await new_land.migration(landId, [5,0,0,0,0]).send(params)
  console.log("land2ResourceMineState: ", await new_land.land2ResourceMineState(landId).call(cst))
  console.log("getTotalMiningStrength: ", await new_land.getTotalMiningStrength(landId, gold).call(cst))
  console.log("mintedBalanceOnLand: ", await new_land.mintedBalanceOnLand(landId, gold).call(cst))
  console.log("getMinerOnLand 0: ", await new_land.getMinerOnLand(landId, gold, 0).call(cst))
  console.log("getMinerOnLand 1: ", await new_land.getMinerOnLand(landId, gold, 1).call(cst))
  console.log("getMinerOnLand 2: ", await new_land.getMinerOnLand(landId, gold, 2).call(cst))
  console.log("getMinerOnLand 3: ", await new_land.getMinerOnLand(landId, gold, 3).call(cst))
  console.log("getMinerOnLand 4: ", await new_land.getMinerOnLand(landId, gold, 4).call(cst))
  console.log("migrated: ", await new_land.migrated(landId).call(cst))

  console.log("finished");
};

app();
