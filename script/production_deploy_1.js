const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key3.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_production.json', 'utf8'));

console.log(key);

//const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.trongrid.io'; // Contract events http endpoint

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
    const bancorNetworkAddress = contracts["BancorNetwork"].hex;
    const settingsRegistryAddress = contracts["SettingsRegistry"].hex;
    const contractFeaturesAddress = contracts["ContractFeatures"].hex;

    console.log(bancorNetworkAddress);

    // let contractFeaturesId = await bancorNetwork.CONTRACT_FEATURES.call();
    // await settingsRegistry.setAddressProperty(contractFeaturesId, ContractFeatures.address);

    let bancorNetwork = await tronWeb.contract().at(bancorNetworkAddress);
    let settingsRegistry = await tronWeb.contract().at(settingsRegistryAddress);

    let contractFeaturesId = await bancorNetwork.CONTRACT_FEATURES().call();
    console.log(contractFeaturesId);

    let res = await settingsRegistry.setAddressProperty(contractFeaturesId, contractFeaturesAddress).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });;

    let contractFeaturesRes = await settingsRegistry.addressOf(contractFeaturesId).call();
    console.log(contractFeaturesRes);
}

app();