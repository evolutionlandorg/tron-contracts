var TronWeb = require('tronweb')
var lands = require("./landrs_list_shasta.json")

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
 	base58: "TSKyF5JbqxPT8fXYJpAqjFrFqz3uqF1QjP",
	hex: "41b36f434a28fcbc921b92182ca79af872b476cdc1"
}

let params = {
  feeLimit:100000000,
  callValue: 0,
  shouldPollResponse:false
}

let cst = { _isConstant: true }

const resources = [
  "41ec0ff3527ddba81f0cf5101fb31dc42b808ca1ab",
  "41da966f8718feea81a500ab193838e2be208bf987",
  "41e9eaec1529b2030e3704cb41f08fc4e15117add0",
  "41f9c329dbb1bc5f84ab731a7f0a64cd226c0cb1ab",
  "41d23d40f91f9dcd27218307351be1173ed43943c9"
]

const app = async () => {
  tronWeb.setDefaultBlock('latest');
  let new_land = await tronWeb.contract().at(NEW_LAND.hex)
  console.log("OLD_LAND: ", await new_land.OLD_LAND().call(cst))
  for (let [index, land] of lands.entries()) {
    let landId = land.id 
    console.log("land id:", landId)
    console.log("migrated:", await new_land.migrated(landId).call(cst))
    // console.log("tx:", await new_land.migration(landId, land.lengths).send(params))
    await sleep(1000);
  }

  console.log("finished");
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

app();
