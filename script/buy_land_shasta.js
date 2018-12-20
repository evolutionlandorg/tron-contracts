const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

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

    const ringAddress = contracts["RING"].hex;
    const bankAddress = contracts["GringottsBank"].hex;
    const clockAuction = contracts["ClockAuction"].hex;

    console.log(clockAuction);

    let ringContract = await tronWeb.contract().at(ringAddress);

    let value = await ringContract.balanceOf(myAddress).call();

    console.log("my ring balance:", value.toString());

    let ret = await ringContract['transfer(address,uint256,bytes)'](clockAuction,"95000000000000000000000", "0x2a020002020002010000000000000002000000000000000000000000000003f4")
        .send({
            feeLimit:1000000000,
            callValue: 0,
            shouldPollResponse:true
        });

    console.log(ret);
};

app();