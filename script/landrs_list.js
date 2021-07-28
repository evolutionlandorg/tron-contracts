var TronWeb = require('tronweb')
var fs = require('fs')

const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
    privateKey: process.env.PRIVATE_KEY_SHASTA
})

const LAND_BASE = {
  base58: "TPLLZcJPS6AJGD2GAUuxzxSDQzG9x2bdJ2",
  hex: "419298aea2bb505579d026a76e4da5655b9b015107"
}

const OLD_LAND = {
  base58: "TB8uz1tL6HFcG51h2gq7u1YzuAPtJCdM3n",
  hex: "410CCE145A83F344E290613028EA3123EB473E69CB"
}

const OWNER_SHIP = {
  base58: "TBJvCwYyjuDzZdJAdn1j3MQzWDpt8j1Ag6",
  hex: "410eb26cd69aba0f5f3b866747b014313a5ddef076"
}

const INTERSTELLAR_ENCODER = {
  base58: "TXUQB2vggLEhttPbY9K4N5Mq98MZFRN5A8",
  hex: "41ebe007bea97c5bdcbfa812d8d902452e00cf4a0d"
} 

const resources = [
  "41ec0ff3527ddba81f0cf5101fb31dc42b808ca1ab",
  "41da966f8718feea81a500ab193838e2be208bf987",
  "41e9eaec1529b2030e3704cb41f08fc4e15117add0",
  "41f9c329dbb1bc5f84ab731a7f0a64cd226c0cb1ab",
  "41d23d40f91f9dcd27218307351be1173ed43943c9"
]

let params = {
  feeLimit:100000000,
  callValue: 0,
  shouldPollResponse:true
}

const app = async () => {
  tronWeb.setDefaultBlock('latest');
  let lands = []
  let land_base = await tronWeb.contract().at(LAND_BASE.hex)
  lastLandObjectId = await land_base.lastLandObjectId().call()
  let interstellar_encoder = await tronWeb.contract().at(INTERSTELLAR_ENCODER.hex)
  let old_land = await tronWeb.contract().at(OLD_LAND.hex)
  for(let i = 1; i <= lastLandObjectId.toNumber(); i++) {
    let land = {}
    let id = await interstellar_encoder.encodeTokenIdForObjectContract(OWNER_SHIP.hex, LAND_BASE.hex, i).call()
    let landId = id._tokenId._hex
    land.id = landId
    land.land2ResourceMineState = await old_land.land2ResourceMineState(landId).call()
    let totalMiners = land.land2ResourceMineState.totalMiners.toNumber()
    for (let j = 0; j < resources.length; j++) {
      land[j] = {}
      let resource = resources[j]
      land[j].TotalMiningStrength = (await old_land.getTotalMiningStrength(landId, resource).call()).toString()
      land[j].MintedBalance = (await old_land.mintedBalanceOnLand(landId, resource).call()).toString()
    }
    console.log(land.id)
    if (totalMiners == 0 
      && land[0].TotalMiningStrength == 0 && land[0].MintedBalance == 0
      && land[1].TotalMiningStrength == 0 && land[1].MintedBalance == 0
      && land[2].TotalMiningStrength == 0 && land[2].MintedBalance == 0
      && land[3].TotalMiningStrength == 0 && land[3].MintedBalance == 0
      && land[4].TotalMiningStrength == 0 && land[4].MintedBalance == 0
    ) {
      console.log("skip land id: ", land.id)
    } else {
      let lengths = [0,0,0,0,0]
      for (let j = 0; j < resources.length; j++) {
        let resource = resources[j] 
        try {
          let miner = await old_land.getMinerOnLand(landId, resource, 0).call() 
          console.log(miner)
          lengths[j]++
        }
        catch (error) {
        }
      }
      land.lengths = lengths
      lands.push(land)
    }
  }
  fs.writeFileSync('./landrs_list.json', JSON.stringify(lands, null, '\t'), 'utf-8');
  console.log("finished");
};

app();
