const RING = artifacts.require('StandardERC223');
const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const SettingsRegistry = artifacts.require('SettingsRegistry');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');
const FeatureIds = artifacts.require('FeatureIds');

const gasPrice = 30000000000000;
const weight10Percent = 100000;
const COIN = 10 ** 18;

const from = 'TGM8XrBGCcVpZAxL1b9D9gWeDJMvTpr6b9';

module.exports = {
    initBancor: initBancor
}


async function initBancor(accounts) {
    let contractRegistry = await SettingsRegistry.new();
    console.log('contractRegistry address: ', contractRegistry.address);

    let contractIds = await ContractIds.new();

    let contractFeatures = await ContractFeatures.new();
    let contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
    await contractRegistry.setAddressProperty(contractFeaturesId, contractFeatures.address);
    console.log('contractFeatures address: ', contractFeatures.address);

    let bancorFormula = await BancorFormula.new();
    let formulaId = await contractIds.BANCOR_FORMULA.call();
    await contractRegistry.setAddressProperty(formulaId, bancorFormula.address);
    console.log('bancorFormula address: ', bancorFormula.address);

    let featureIds = await FeatureIds.new();
    console.log('featureIds address: ', featureIds.address);

    let whiteList = await WhiteList.new();
    console.log('whiteList address: ', whiteList.address);

    let trxToken = await TrxToken.new();
    console.log('trxToken address: ', trxToken.address);

    let ring = await RING.new("RING");
    console.log('ring address: ', ring.address);

    // more complex
    let bancorNetwork = await BancorNetwork.new(contractRegistry.address);
    let bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
    await contractRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    let bancorConverter = await BancorConverter.new(ring.address, contractRegistry.address, 0, trxToken.address, weight10Percent);
    console.log('bancorConverter address: ', bancorConverter.address);

    let bancorExchange = await BancorExchange.new(ring.address, bancorNetwork.address, bancorConverter.address);
    console.log('bancorExchange address: ', bancorExchange.address);


    //do this to make SmartToken.totalSupply > 0
    for (let i = 0; i < 10; i++) {
        await ring.issue(accounts[i], 100000000 * COIN);
    }
    console.log("deploy SUCCESS")
    await ring.setOwner(bancorConverter.address);

    await trxToken.deposit({value: 1 * COIN});
    await trxToken.transfer(bancorConverter.address, 1 * COIN);

    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, ring.address, ring.address]);
    await bancorExchange.setQuickSellPath([ring.address, ring.address, trxToken.address]);

    console.log("Bancor Initial SUCCESS! ")
    return {ring: ring, bancorExchange: bancorExchange, bancorConverter: bancorConverter, trxToken: trxToken};

}
