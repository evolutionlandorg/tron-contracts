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
    const ktonAddress = contracts["KTON"].hex;
    const settingsIdAddress = contracts["SettingIds"].hex;
    const bancorNetworkAddress = contracts["BancorNetwork"].hex;
    const settingsRegistryAddress = contracts["SettingsRegistry"].hex;
    const bancorConverterAddress = contracts["BancorConverter"].hex;
    const bancorFormulaAddress = contracts["BancorFormula"].hex;
    const trxTokenAddress = contracts["TrxToken"].hex;
    const bancorExchangeAddress = contracts["BancorExchange"].hex;
    const ringAuthorityAddress = contracts["RINGAuthority"].hex;

    console.log(ringAddress);

    console.log(bancorConverterAddress);

    let bancorNetwork = await tronWeb.contract().at(bancorNetworkAddress);
    let bancorConverter = await tronWeb.contract().at(bancorConverterAddress);
    let settingsRegistry = await tronWeb.contract().at(settingsRegistryAddress);
    let ring = await tronWeb.contract().at(ringAddress);
    let settingIds = await tronWeb.contract().at(settingsIdAddress);


    let ring_key = await settingIds.CONTRACT_RING_ERC20_TOKEN().call();
    let kton_key = await settingIds.CONTRACT_KTON_ERC20_TOKEN().call();

    let bancorExchange = await tronWeb.contract().at(bancorExchangeAddress);

    console.log(ringAddress);
    console.log(ring_key);

    console.log(kton_key);
    console.log(ktonAddress);

    console.log(ringAuthorityAddress);

    let formulaId = await bancorConverter.BANCOR_FORMULA().call();
    // await settingsRegistry.setAddressProperty(ring_key, ringAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await settingsRegistry.setAddressProperty(kton_key, ktonAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    console.log(bancorFormulaAddress);

    console.log(await settingsRegistry.addressOf(formulaId).call());

    // await settingsRegistry.setAddressProperty(formulaId, bancorFormulaAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await ring.setAuthority(ringAuthorityAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // let bancorFormulaRes = await settingsRegistry.addressOf(formulaId).call();
    // console.log(bancorFormulaRes);

    // let bancorNetworkId = await bancorConverter.BANCOR_NETWORK().call();
    // await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetworkAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // let bancorNetworkRes = await settingsRegistry.addressOf(bancorNetworkId).call();
    // console.log(bancorNetworkRes);

    // let ring = await RING.deployed();
    // //do this to make SmartToken.totalSupply > 0
    // // await ring.changeCap(16 * 10**8 * 10 ** 18);
    // await ring.changeCap("1600000000000000000000000000").send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await ring.issue("4126eb3d62d1d3aa8351443728715be20ccd3311dc", "400000000000000000000000000").send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await ring.transferOwnership(bancorConverterAddress).send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await bancorConverter.acceptTokenOwnership().send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });


    // // await trxToken.deposit({callValue: '3276110000000'});   3276110000000000000000000
    // // await trxToken.transfer(bancorConverter.address, '3276110000000000000000000');
    // await bancorConverter.updateConnector(trxTokenAddress, "100000", true, '3276110000000000000000000').send({
    //     feeLimit:1000000000,
    //     callValue: 0,
    //     shouldPollResponse:true
    // });

    // await whiteList.addAddress(bancorExchange.address);
    // await bancorConverter.setConversionWhitelist(whiteList.address);

    // // await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxTokenAddress, ringAddress, ringAddress]).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });

    await bancorExchange.setQuickSellPath([ringAddress, ringAddress, trxTokenAddress]).send({
        feeLimit:1000000000,
        callValue: 0,
        shouldPollResponse:true
    });
}

app();