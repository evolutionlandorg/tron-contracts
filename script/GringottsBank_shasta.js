const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key2.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/temp_contracts.json', 'utf8'));

console.log(key);

// const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
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

    let RINGContract = await tronWeb.contract().at(ringAddress);
    await RINGContract.approve(bankAddress,'90000000000000000000').send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let allownce = await RINGContract.allowance(myAddress,bankAddress).call();
    console.log("allownce: ", allownce.toString());

    //
    let bank = await tronWeb.contract().at(bankAddress);
    let ret = await bank.deposit(myAddress,'10000000000000000000','2').send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    console.log("ret: ", ret);

};

app();