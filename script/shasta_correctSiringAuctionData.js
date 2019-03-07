const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key2.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

//const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

const app = async () => {
    tronWeb.setDefaultBlock('latest');

    const nodes = await tronWeb.isConnected();
    const connected = !Object.entries(nodes).map(([name, connected]) => {
        if (!connected)
            console.error(`Error: ${name} is not connected`);

        return connected;
    }).includes(false);

    if (!connected)
        return;

    const siringClockAuctionAddress = contracts["SiringClockAuction"].hex;
    const objectOwnershipAddress = contracts["ObjectOwnership"].hex;
    const apostleBaseAddress = contracts["ApostleBase"].hex;


    let siringClockAuction = await tronWeb.contract().at(siringClockAuctionAddress);
    let objectOwnership = await tronWeb.contract().at(objectOwnershipAddress);
    let apostleBase = await tronWeb.contract().at(apostleBaseAddress);

   let count = await objectOwnership.balanceOf(siringClockAuctionAddress).call();
   console.log("COUNT: ", count.valueOf());

   let ret = await siringClockAuction.pause().send({
       feeLimit: 1000000000,
       callValue: 200000000,
       shouldPollResponse: false
   });
    console.log("pause siringClockAuction: ", ret);

    for (let i = 0; i < count; i++) {
        await getInfo(objectOwnership, siringClockAuction, apostleBase, i);
    }


    let ret1 = await siringClockAuction.unpause().send({
        feeLimit: 1000000000,
        callValue: 200000000,
        shouldPollResponse: false
    });
    console.log("unPause siringClockAuction: ", ret1);

    console.log("SUCCESS!")
}


async function getInfo(objectOwnership, siringClockAuction, apostleBase, i) {
    let tokenId = await objectOwnership.tokenOfOwnerByIndex(siringClockAuction.address, i).call();
    let info = await siringClockAuction.tokenIdToAuction(tokenId).call();
    if(parseInt(info.startingPriceInToken, 16) == 0) {
        // console.log(tokenId, " : ", info);
        await getOwner(objectOwnership, apostleBase, tokenId, siringClockAuction);
    } else {
        console.log(i, " : ", tokenId);
        let ret = await siringClockAuction.cancelAuctionWhenPaused(tokenId).send({
            feeLimit: 1000000000,
            callValue: 200000000,
            shouldPollResponse: false
        });
        console.log(ret);
    }

}

async function getOwner(objectOwnership, apostleBase, tokenId, siringClockAuction) {
    let info = await apostleBase.tokenId2Apostle(tokenId).call();
    let matronId = info.matronId;
    let owner = await objectOwnership.ownerOf(matronId).call();
    // keep looking for real owner
    // if auctionInfo is empty, find its mother's owner
    // if its mother's owner is siringClockAuction, repeat the step above
    // util there is an owner which is not SiringClockAuction
    // if auctionInfo is not empty
    // then it is normal situation
    while(owner == siringClockAuction.address) {
        let auctionInfo = await siringClockAuction.tokenIdToAuction(matronId).call();
        if(auctionInfo.seller == '410000000000000000000000000000000000000000') {
            info =  await apostleBase.tokenId2Apostle(matronId).call();
            matronId = info.matronId;
            owner = await objectOwnership.ownerOf(matronId).call();
        } else {
            owner = auctionInfo.seller;
        }

    }

    console.log(tokenId, "'s owner is : ", owner);

    let ret1 = await objectOwnership.burn(siringClockAuction.address, tokenId).send({
        feeLimit: 1000000000,
        callValue: 200000000,
        shouldPollResponse: false
    });
    console.log("burn:", ret1);

    let ret2 = await objectOwnership.mint(owner, tokenId).send({
        feeLimit: 1000000000,
        callValue: 200000000,
        shouldPollResponse: false
    });
    console.log("mint: ",ret2);




}


app();

// app().catch(error => console.log(error.message));
