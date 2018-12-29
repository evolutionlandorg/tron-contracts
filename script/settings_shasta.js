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

    const settingsRegistryAddress = contracts["SettingsRegistry"].hex;

    const revenuePoolAddress = contracts["RevenuePool"].hex;

    const dividendPoolAddress = contracts["DividendPool"].hex;

    let SettingsRegistry = await tronWeb.contract().at(settingsRegistryAddress);

    let RevenuePool = await tronWeb.contract().at(revenuePoolAddress);

    let DividendPool = await tronWeb.contract().at(dividendPoolAddress);

    let channelDividendPoolKey = await DividendPool.CONTRACT_CHANNEL_DIVIDEND().call();

    let revenewPoolKey = await RevenuePool.CONTRACT_REVENUE_POOL().call();

    let revenewPoolValue = await SettingsRegistry.addressOf(revenewPoolKey).call();
    console.log("RevenuePool: ", revenewPoolValue.toString());


    let channelDividendValue = 
    await SettingsRegistry.addressOf(channelDividendPoolKey).call();
    console.log("channelDividendPool: ", channelDividendValue.toString());

    // let res = await SettingsRegistry.setAddressProperty(await DividendPool.CONTRACT_DIVIDENDS_POOL().call(), contracts["DividendPool"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    let CONTRACT_FROZEN_DIVIDEND = 
    await SettingsRegistry.addressOf(await DividendPool.CONTRACT_DIVIDENDS_POOL().call()).call();
    console.log("CONTRACT_FROZEN_DIVIDEND: ", CONTRACT_FROZEN_DIVIDEND.toString());

    let cut = await SettingsRegistry.uintOf(await DividendPool.UINT_REFERER_CUT().call()).call();
    console.log("CONTRACT_FROZEN_DIVIDEND: ", cut.toString());
};

app();