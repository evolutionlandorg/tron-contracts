const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_apostle_address.json', 'utf8'));

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

    const registrysAddress = '411b2b0c56b851a6c10d0e4a25a1e8184aa8c03297';
    const apostleSettingIdsAddr = contracts["ApostleSettingIds"].hex;
    const apostleBaseAddr = contracts["ApostleBase"].hex;
    const apostleClockAuctionAddr = contracts["ApostleClockAuction"].hex;
    const siringClockAuctionAddr = contracts["SiringClockAuction"].hex;

    let SettingRegistry = await tronWeb.contract().at(registrysAddress);
    let ApostleSettingIds = await tronWeb.contract().at(apostleSettingIdsAddr);

    let apostleBaseId = await ApostleSettingIds.CONTRACT_APOSTLE_BASE().call();
    let clockAuctionId = await ApostleSettingIds.CONTRACT_APOSTLE_AUCTION().call();
    let siringAuctionId = await ApostleSettingIds.CONTRACT_SIRING_AUCTION().call();
    let birthFeeId = await ApostleSettingIds.UINT_AUTOBIRTH_FEE().call();
    let mixTalentId = await ApostleSettingIds.UINT_MIX_TALENT().call();
    let bidWaitingTimeId = await ApostleSettingIds.UINT_APOSTLE_BID_WAITING_TIME().call();

    await SettingRegistry.setAddressProperty(apostleBaseId, apostleBaseAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setAddressProperty(clockAuctionId, apostleClockAuctionAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setAddressProperty(siringAuctionId, siringClockAuctionAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setUintProperty(birthFeeId, '500000000000000000000').send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setUintProperty(mixTalentId, '5000000000000000000').send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setUintProperty(bidWaitingTimeId, 600).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    const objectOwnershipAddress = '411cad3f158adc0706f140bf20fa910947f947ab8e';
    let objectOwnershipAuthorityAddr = contracts["ObjectOwnershipAuthority"].hex;
    let ObjectOwnership = await tronWeb.contract().at(objectOwnershipAddress);

    await ObjectOwnership.setAuthority(objectOwnershipAuthorityAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
};

app();