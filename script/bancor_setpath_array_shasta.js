const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key2.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
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

    const bancorExchangeAddress = contracts["BancorExchange"].hex;
    // const goldContract = 

    let BacorExContract = await tronWeb.contract().at(bancorExchangeAddress);

    await BacorExContract.setQuickBuyPath(['415794ce7ae85efe01ba94fee10ddefe1d48a96ae6','4174ca9d500f006bb' +
    '01b8e1db69734c05e04b7b67be9','4174ca9d500f00601b8e1db69734c05e04b7b67be9'])
        .send({
            feeLimit:1000000000,
            callValue:0,
            shouldPollResponse:true
        });

    let quickBuyPath = await BacorExContract.quickBuyPath(1).call();
    console.log(quickBuyPath);
}

app();