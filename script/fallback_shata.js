const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
// var contracts = JSON.parse(fs.readFileSync('./script/temp_contracts.json', 'utf8'));

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

    // const ringAddress = contracts["RING"].hex;
    // const bankAddress = contracts["GringottsBank"].hex;

    // let FallbackTest = await tronWeb.contract().at('41252e1115ca629029428184d5e0489bd403968b46');
    // let balance = await FallbackTest.balance().call();
    // console.log("balance: ", balance.toString());

    let myTrx = await tronWeb.trx.getBalance('41d25da92f48c771e1f62e9b62b514cdd05fef9abb');
    console.log("balance: ", myTrx.toString());

    let fallbackTrx = await tronWeb.trx.getBalance('415d9bc28ae5a9385460dc0f0214d7aef8e4e9092b');
    console.log("balance: ", fallbackTrx.toString());

    let trxTokenTrx = await tronWeb.trx.getBalance('4182173bd8fdbe0680983013042aa501b63c822434');
    console.log("balance: ", trxTokenTrx.toString());

    // await RINGContract.approve(bankAddress,'90000000000000000000').send({
    //     feeLimit:1000000000,
    //     callValue:0,
    //     shouldPollResponse:true
    // });
    // //
    // let allownce = await RINGContract.allowance(myAddress,bankAddress).call();
    // console.log("allownce: ", allownce.toString());

    // //
    // let bank = await tronWeb.contract().at(bankAddress);
    // let ret = await bank.deposit(myAddress,'10000000000000000000','2').send({
    //     feeLimit:1000000000,
    //     callValue:0,
    //     shouldPollResponse:true
    // });
    // console.log("ret: ", ret);

};

app();