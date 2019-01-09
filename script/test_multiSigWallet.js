const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
// var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

//const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;

console.log(myAddress);


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

    const ringAddress = "41D5CD96F5C7A53297D7D1BC608D064EFDC962F804";
    const multiSigAddress = "TPQsfQapKkFzWmBVaFhh6gS3u1zcpqBqcS";

    // console.log(apostlelockAuctionAddr);

    let ringContract = await tronWeb.contract().at(ringAddress);
    let multiSig = await tronWeb.contract().at(multiSigAddress);

    // await transferRing(multiSig, ringAddress, "0xa9059cbb0000000000000000000000002E875B4CA39C439A99929085AF5BC94DF3E6AB190000000000000000000000000000000000000000000000008ac7230489e80000")

    await sendTrx(multiSig, myAddress, "0x");





    console.log("SUCCESS");
};


async function transferRing(multisig, ringaddr, data) {
    let ret = await multisig.submitTransaction(ringaddr, 0, data)
        .send({
            feeLimit: 1000000000,
            callValue: 0,
            shouldPollResponse: true
        });
    console.log(ret);
}


async function sendTrx(multisig, address, data) {
    let ret = await multisig.submitTransaction(address, 1000000, data)
        .send({
            feeLimit: 1000000000,
            callValue: 0,
            shouldPollResponse: true
        });
    console.log(ret);
}

async function confirm(multisig, index) {
    let ret = await multisig.confirmTransaction(index)
        .send({
            feeLimit: 1000000000,
            callValue: 0,
            shouldPollResponse: true
        });
    console.log(ret);
}

async function execute(multisig, index) {
    let ret = await multisig.executeTransaction(index)
        .send({
            feeLimit: 1000000000,
            callValue: 0,
            shouldPollResponse: true
        });
    console.log(ret);
}





app();
