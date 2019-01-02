const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_apostle_address.json', 'utf8'));
var mcontracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

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

    const registrysAddress = mcontracts["SettingsRegistry"].hex;
    const apostleSettingIdsAddr = contracts["ApostleSettingIds"].hex;
    const apostleBaseAddr = contracts["ApostleBase"].hex;
    const apostleClockAuctionAddr = contracts["ApostleClockAuction"].hex;
    const siringClockAuctionAddr = contracts["SiringClockAuction"].hex;
    const mintAndBurnAddr = contracts["MintAndBurnAuthority"].hex;

    let SettingRegistry = await tronWeb.contract().at(registrysAddress);
    let ApostleSettingIds = await tronWeb.contract().at(apostleSettingIdsAddr);

    let gold =  await tronWeb.contract().at(mcontracts["GOLD"].hex);
    let wood =  await tronWeb.contract().at(mcontracts["WOOD"].hex);
    let water =  await tronWeb.contract().at(mcontracts["HHO"].hex);
    let fire =  await tronWeb.contract().at(mcontracts["FIRE"].hex);
    let tu =  await tronWeb.contract().at(mcontracts["SIOO"].hex);

    let tokenUse = await tronWeb.contract().at(contracts["TokenUse"].hex);

    let apostleBaseId = await ApostleSettingIds.CONTRACT_APOSTLE_BASE().call();
    let clockAuctionId = await ApostleSettingIds.CONTRACT_APOSTLE_AUCTION().call();
    let siringAuctionId = await ApostleSettingIds.CONTRACT_SIRING_AUCTION().call();
    let birthFeeId = await ApostleSettingIds.UINT_AUTOBIRTH_FEE().call();
    let mixTalentId = await ApostleSettingIds.UINT_MIX_TALENT().call();
    let bidWaitingTimeId = await ApostleSettingIds.UINT_APOSTLE_BID_WAITING_TIME().call();
    let interstellarEncoderID = await ApostleSettingIds.CONTRACT_INTERSTELLAR_ENCODER().call();

    await SettingRegistry.setAddressProperty(interstellarEncoderID, contracts["InterstellarEncoder"].hex).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

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

    const objectOwnershipAddress = mcontracts["ObjectOwnership"].hex;
    let objectOwnershipAuthorityAddr = contracts["ObjectOwnershipAuthority"].hex;
    let ObjectOwnership = await tronWeb.contract().at(objectOwnershipAddress);

    await ObjectOwnership.setAuthority(objectOwnershipAuthorityAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });


    let tokenUseCutId = await tokenUse.UINT_TOKEN_OFFER_CUT().call();
    await SettingRegistry.setUintProperty(tokenUseCutId, 400).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    let tokenUseAddr = contracts["TokenUse"].hex;
    let tokenUseId = await tokenUse.CONTRACT_TOKEN_USE().call();
    await SettingRegistry.setAddressProperty(tokenUseId, tokenUseAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await gold.setAuthority(mintAndBurnAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    await wood.setAuthority(mintAndBurnAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    await water.setAuthority(mintAndBurnAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    await fire.setAuthority(mintAndBurnAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    await tu.setAuthority(mintAndBurnAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    let genScience = await tronWeb.contract().at(contracts["GeneScienceV3"].hex);
    let genScienceId = await genScience.CONTRACT_GENE_SCIENCE().call();
    await SettingRegistry.setAddressProperty(genScienceId, genScience.address).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    console.log("finished");

};

app();