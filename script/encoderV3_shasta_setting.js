const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key2.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

// HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;

console.log("myaddress: ", myAddress);

const conf = {
    landObject_class: 1,
    apostleObject_class: 2,
    ck_producerId: 256,
    objectOwnership_id: 1,
    ck_ownership_id: 2,
    pet_objectClass: 3,
    pet_max_number: 1
}


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

    // register in registry
    let registry = await tronWeb.contract().at(contracts["SettingsRegistry"].hex);
    let bridge = await tronWeb.contract().at(contracts["ERC721Bridge"].hex);

    let encoderId = await bridge.CONTRACT_INTERSTELLAR_ENCODER().call();
    let encoder = await tronWeb.contract().at(contracts["InterstellarEncoderV3"].hex);
    await registry.setAddressProperty(encoderId, encoder.address).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    console.log("REGISTER IN REGISTRY DONE");



    await encoder.registerNewOwnershipContract(contracts["ObjectOwnership"].hex, conf.objectOwnership_id).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    await encoder.registerNewOwnershipContract(contracts["KittyCore"].hex, conf.ck_ownership_id).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    console.log("ENCODER REGISTER TOKEN DONE!");

    await encoder.registerNewObjectClass(contracts["LandBase"].hex, conf.landObject_class).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    await encoder.registerNewObjectClass(contracts["ApostleBase"].hex, conf.apostleObject_class).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    await encoder.registerNewObjectClass(contracts["PetBase"].hex, conf.pet_objectClass).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    console.log("ENCODER REGISTER OBJECT CLASS DONE!");

    await bridge.registerAdaptor(contracts["KittyCore"].hex, contracts["ERC721Adaptor"].hex);

    console.log("SUCCESS!")



};

app();