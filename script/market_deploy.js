const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log("my key: ", key);

// HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;
const supervisor_address = '4100a1537d251a6a4c4effab76948899061fea47b9';


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


    const auctionSettingidsAddress = contracts["AuctionSettingIds"].hex;
    const registrysAddress = contracts["SettingsRegistry"].hex;
    const revenuePoolAddr = contracts["RevenuePool"].hex;
    const pointsRewardPoolAddress = contracts["PointsRewardPool"].hex;
    const userPointsAddress = contracts["UserPoints"].hex;
    const userPointsAuthorityAddress = contracts["UserPointsAuthority"].hex;

    const clockAuctionAddress = contracts["ClockAuction"].hex;
    const clockAuctionAuthority = contracts["ClockAuctionAuthority"].hex;
    const mysteriousTreasureAddress = contracts["MysteriousTreasure"].hex;
    const bancorExchangeAddress = contracts["BancorExchange"].hex;
    const bancorExchangeAuthority = contracts["BancorExchangeAuthority"].hex;


    let SettingIDs = await tronWeb.contract().at(auctionSettingidsAddress);
    let SettingRegistry = await tronWeb.contract().at(registrysAddress);

    let revenueId = await SettingIDs.CONTRACT_REVENUE_POOL().call();
    await SettingRegistry.setAddressProperty(revenueId, revenuePoolAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    //
    let pointsRewardId = await SettingIDs.CONTRACT_POINTS_REWARD_POOL().call();
    await SettingRegistry.setAddressProperty(pointsRewardId, pointsRewardPoolAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let userPointsId = await SettingIDs.CONTRACT_USER_POINTS().call();
    await SettingRegistry.setAddressProperty(userPointsId, userPointsAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let contributionId = await SettingIDs.CONTRACT_CONTRIBUTION_INCENTIVE_POOL().call();
    await SettingRegistry.setAddressProperty(contributionId, supervisor_address).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let dividendsId = await SettingIDs.CONTRACT_DIVIDENDS_POOL().call();
    await SettingRegistry.setAddressProperty(dividendsId, supervisor_address).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let devId = await SettingIDs.CONTRACT_DEV_POOL().call();
    await SettingRegistry.setAddressProperty(devId,supervisor_address).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let auctionId = await SettingIDs.CONTRACT_CLOCK_AUCTION().call();
    await SettingRegistry.setAddressProperty(auctionId, clockAuctionAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let auctionCutId = await SettingIDs.UINT_AUCTION_CUT().call();
    await SettingRegistry.setUintProperty(auctionCutId, 400).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let waitingTimeId = await SettingIDs.UINT_AUCTION_BID_WAITING_TIME().call();
    await SettingRegistry.setUintProperty(waitingTimeId, 1800).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let treasureId = await SettingIDs.CONTRACT_MYSTERIOUS_TREASURE().call();
    await SettingRegistry.setAddressProperty(treasureId, mysteriousTreasureAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let bancorExchangeId = await SettingIDs.CONTRACT_BANCOR_EXCHANGE().call();
    await SettingRegistry.setAddressProperty(bancorExchangeId, bancorExchangeAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let refererCutId = await SettingIDs.UINT_REFERER_CUT().call();
    await SettingRegistry.setUintProperty(refererCutId, 2000).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    let errorSpaceId = await SettingIDs.UINT_EXCHANGE_ERROR_SPACE().call();
    await SettingRegistry.setUintProperty(errorSpaceId, 0).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });


    //
    // // allow treasure to modify data in landbase
    const landBaseAddr = contracts["LandBase"].hex;
    const landBaseAuthorityAddr = contracts["LandBaseAuthority"].hex;
    let LandBase = await tronWeb.contract().at(landBaseAddr);
    await LandBase.setAuthority(landBaseAuthorityAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    //
    // // transfer treasure's owner to clockAuction
    let MysteriousTreasure = await tronWeb.contract().at(mysteriousTreasureAddress);
    await MysteriousTreasure.setOwner(clockAuctionAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    //
    // // set authority
    let UserPoints = await tronWeb.contract().at(userPointsAddress);
    await UserPoints.setAuthority(userPointsAuthorityAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    let BancorExchange = await tronWeb.contract().at(bancorExchangeAddress);

    await BancorExchange.setAuthority(bancorExchangeAuthority).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    let ClockAuction = await tronWeb.contract().at(clockAuctionAddress);

    await ClockAuction.setAuthority(clockAuctionAuthority).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });


    console.log("deploy finish");

};

app();