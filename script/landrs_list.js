var TronWeb = require('tronweb')
var fs = require('fs')

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
    privateKey: process.env.PRIVATE_KEY_SHASTA
})

const LAND_BASE = {
  base58: "TPLLZcJPS6AJGD2GAUuxzxSDQzG9x2bdJ2",
  hex: "41ECC29A3D40032583103EF937626D34F0E51F766B"
}

const OLD_LAND = {
  base58: "TB8uz1tL6HFcG51h2gq7u1YzuAPtJCdM3n",
  hex: "41f738cb701d94a35352621de20bc48ba598ae142e"
}

const OWNER_SHIP = {
  base58: "TBJvCwYyjuDzZdJAdn1j3MQzWDpt8j1Ag6",
  hex: "4100DFE66A889AA22228E7B17236CEB7E6D3B286B2"
}

const INTERSTELLAR_ENCODER = {
  base58: "TXUQB2vggLEhttPbY9K4N5Mq98MZFRN5A8",
  hex: "419B2110C87018B184651F92B0780948E883517D09"
} 


const resources = [
  "4117ff7d2060e2f91b6cbc0b4b335c1d37cd8861f5",
  "414c0a6059688ff86c4bfd88312bceb4e0e050b078",
  "4186f29de0e912e4ffdabc6de1b9666fa8d63b66a7",
  "41ba6c9bf5cd0b9209a4ac0c82b53f6cbe4fff5623",
  "41a0002398fcf33c6fa50206751f70f2f8f553fe58"
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
  console.log(lastLandObjectId.toNumber())
  let interstellar_encoder = await tronWeb.contract().at(INTERSTELLAR_ENCODER.hex)
  let old_land = await tronWeb.contract().at(OLD_LAND.hex)
  for(let i = 1; i <= lastLandObjectId.toNumber(); i++) {
  // for(let i = 1001; i <= lastLandObjectId.toNumber(); i++) {
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
      let miners = []
      for (let i = 0; i < resources.length; i++) {
        let resource = resources[i] 
        for (let j = 0; j < 5; j++) {
          try {
            let miner = await old_land.getMinerOnLand(landId, resource, j).call() 
            let sts = await old_land.miner2Index(miner._hex).call()
            miners.push(sts)
            lengths[i]++
          }
          catch (error) {
            break
          }
        }
      }
      land.lengths = lengths
      land.miners = miners
      console.log(JSON.stringify(land, null, 2))
      lands.push(land)
    }
  }
  fs.writeFileSync('./landrs_list_2025.json', JSON.stringify(lands), 'utf-8');
  console.log("count: ", lands.length)
  console.log("finished");
};

app();
