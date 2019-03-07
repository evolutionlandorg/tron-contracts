const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key2.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));
var SiringClockAuctionMetaData = JSON.parse(fs.readFileSync('./build/contracts/SiringClockAuctionV2.json', 'utf8'));

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

    const registryAddr = contracts["SettingsRegistry"].hex;

    let siringClockAuctionV2Ret = await tronWeb.contract().new({
        abi: SiringClockAuctionMetaData.abi,
        bytecode: SiringClockAuctionMetaData.bytecode,
        feeLimit: 1000000000,
        callValue: 0,
        userFeePercentage: 100,
        parameters: [registryAddr],
    })

    console.log("SiringClockAuctionV2: ", siringClockAuctionV2Ret.address);

    let siringClockAuctionV2 = await tronWeb.contract().at(siringClockAuctionV2Ret.address);

    let siringAuctionId = await siringClockAuctionV2.CONTRACT_SIRING_AUCTION().call();

    let registry = await tronWeb.contract().at(registryAddr);

    let ret = await registry.setAddressProperty(siringAuctionId, siringClockAuctionV2Ret.address).send({
        feeLimit: 1000000000,
        callValue: 200000000,
        shouldPollResponse: false
    });
    console.log(ret);


    console.log("SUCCESS");

}


app();