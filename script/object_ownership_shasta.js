const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/myContractAddrs.json', 'utf8'));

console.log(key);

const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.hex;

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

    // const objectOwnershipAddress = "41c65feaa7d0ae57b3331ba0f7ace2a45277a9f8b0";
    const objectOwnershipAddress = contracts["ObjectOwnership"].hex;
    // const bankAddress = contracts["GringottsBank"].hex;

    let objectOwnershipContract = await tronWeb.contract().at(objectOwnershipAddress);

    let value = await objectOwnershipContract.ownerOf("19000673361797317944041681485429153168074179863487486754213522234433471512578").call();

    console.log(value);
}

app();