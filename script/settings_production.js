const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key3.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_production.json', 'utf8'));

console.log(key);

//const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
// const fullNode = 'http://104.199.150.138:8500'; // Full node http endpoint
// const solidityNode = 'http://104.199.150.138:8600'; // Solidity node http endpoint
// const eventServer = 'http://35.201.218.126:18891'; // Contract events http endpoint

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

    let SettingRegistry = await tronWeb.contract().at(contracts["SettingsRegistry"].hex);
    let AuctionSettingIds = await tronWeb.contract().at(contracts["RevenuePool"].hex);
    let IDSettingIds = await tronWeb.contract().at(contracts["DividendPool"].hex);
    let SettingIds = await tronWeb.contract().at(contracts["SettingIds"].hex);
    let ApostleIds = await tronWeb.contract().at(contracts["ApostleBase"].hex);

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_RING_ERC20_TOKEN().call()).call());
    
    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_KTON_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_GOLD_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_WOOD_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_WATER_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_FIRE_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_SOIL_ERC20_TOKEN().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_OBJECT_OWNERSHIP().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_TOKEN_LOCATION().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_LAND_BASE().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_USER_POINTS().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_INTERSTELLAR_ENCODER().call()).call());

    console.log(await SettingRegistry.addressOf(await SettingIds.CONTRACT_DIVIDENDS_POOL().call()).call());

    console.log(await SettingRegistry.uintOf(await SettingIds.UINT_AUCTION_CUT().call()).call());

    console.log(await SettingRegistry.uintOf(await SettingIds.UINT_REFERER_CUT().call()).call());

    console.log(await SettingRegistry.uintOf(await AuctionSettingIds.UINT_AUCTION_BID_WAITING_TIME().call()).call());


    console.log(await SettingRegistry.uintOf(await AuctionSettingIds.UINT_EXCHANGE_ERROR_SPACE().call()).call());


    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_CLOCK_AUCTION().call()).call());


    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_MYSTERIOUS_TREASURE().call()).call());

    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_CONTRIBUTION_INCENTIVE_POOL().call()).call());

    // await SettingRegistry.setAddressProperty(await AuctionSettingIds.CONTRACT_BANCOR_EXCHANGE().call(), contracts["BancorExchange"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_BANCOR_EXCHANGE().call()).call());

    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_POINTS_REWARD_POOL().call()).call());

    console.log(await SettingRegistry.addressOf(await AuctionSettingIds.CONTRACT_DEV_POOL().call()).call());

    console.log(await SettingRegistry.addressOf(await IDSettingIds.CONTRACT_CHANNEL_DIVIDEND().call()).call());


    console.log(await SettingRegistry.addressOf(await IDSettingIds.CONTRACT_FROZEN_DIVIDEND().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_GENE_SCIENCE().call(), contracts["GeneScience"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });
    
    console.log("CONTRACT_GENE_SCIENCE");

    console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_GENE_SCIENCE().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_APOSTLE_BASE().call(), contracts["ApostleBase"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_APOSTLE_BASE().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_SIRING_AUCTION().call(), contracts["SiringClockAuction"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_SIRING_AUCTION().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_APOSTLE_AUCTION().call(), contracts["ApostleClockAuction"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_APOSTLE_AUCTION().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_HABERG_POTION_SHOP().call(), contracts["Har"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_HABERG_POTION_SHOP().call()).call());

    // await SettingRegistry.setAddressProperty(await ApostleIds.CONTRACT_TOKEN_USE().call(), contracts["TokenUse"].hex).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.addressOf(await ApostleIds.CONTRACT_TOKEN_USE().call()).call());

    // await SettingRegistry.setUintProperty(await ApostleIds.UINT_AUTOBIRTH_FEE().call(), "500000000000000000000").send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.uintOf(await ApostleIds.UINT_AUTOBIRTH_FEE().call()).call());

    // await SettingRegistry.setUintProperty(await ApostleIds.UINT_MIX_TALENT().call(), "5000000000000000000").send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(await SettingRegistry.uintOf(await ApostleIds.UINT_MIX_TALENT().call()).call());

    // await SettingRegistry.setUintProperty(await ApostleIds.UINT_APOSTLE_BID_WAITING_TIME().call(), 600).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await SettingRegistry.setUintProperty(await SettingIds.UINT_TOKEN_OFFER_CUT().call(), 400).send({
    //     feeLimit:100000000,
    //     callValue:0,
    //     shouldPollResponse:true
    // });

    console.log("UINT_TOKEN_OFFER_CUT");

    console.log(await SettingRegistry.uintOf(await SettingIds.UINT_TOKEN_OFFER_CUT().call()).call());

    console.log(await SettingRegistry.uintOf(await ApostleIds.UINT_APOSTLE_BID_WAITING_TIME().call()).call());

    // await SettingRegistry.setUintProperty(await ApostleIds.UINT_HABERG_POTION_TAX_RATE().call(), 600).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // console.log(await SettingRegistry.uintOf(await ApostleIds.UINT_HABERG_POTION_TAX_RATE().call()).call());

};

app();