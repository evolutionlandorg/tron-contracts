const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");

const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');


const conf = {
    from: "TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ",
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    networkId: 200001,  // TRON shasta
    weight10Percent: 100000
}

module.exports = function(deployer, network, accounts) {
    if (network == "shasta")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    let settingsRegistry = await SettingsRegistry.deployed();

    ////////////    Bancor Contracts   /////////// 
    await deployer.deploy(ContractFeatures);
    await deployer.deploy(BancorFormula);
    await deployer.deploy(WhiteList);
    await deployer.deploy(TrxToken);
    await deployer.deploy(BancorNetwork, settingsRegistry.address);

    let bancorNetwork = await BancorNetwork.deployed();

    let contractFeaturesId = await bancorNetwork.CONTRACT_FEATURES.call();
    await settingsRegistry.setAddressProperty(contractFeaturesId, ContractFeatures.address);

    await deployer.deploy(BancorConverter, RING.address, settingsRegistry.address, 0, TrxToken.address, conf.weight10Percent);
    await deployer.deploy(BancorExchange, BancorNetwork.address, BancorConverter.address, settingsRegistry.address);

    let bancorExchange = await BancorExchange.deployed();

    let whiteList = await WhiteList.deployed();
    let trxToken = await TrxToken.deployed();
    let bancorFormula = await BancorFormula.deployed();

    let bancorConverter = await BancorConverter.deployed();

    // register
    let formulaId = await bancorConverter.BANCOR_FORMULA.call();
    await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);

    let bancorNetworkId = await bancorConverter.BANCOR_NETWORK.call();
    await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    let ring = await RING.deployed();
    //do this to make SmartToken.totalSupply > 0
    // await ring.changeCap(16 * 10**8 * 10 ** 18);
    await ring.changeCap("1600000000000000000000000000");
    await ring.issue(conf.from, "400000000000000000000000000");

    await ring.transferOwnership(bancorConverter.address);
    await bancorConverter.acceptTokenOwnership();

    // await trxToken.deposit({callValue: '3276110000000'});   3276110000000000000000000
    // await trxToken.transfer(bancorConverter.address, '3276110000000000000000000');
    await bancorConverter.updateConnector(trxToken.address, conf.weight10Percent, true, '3276110000000000000000000');

    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, RING.address, RING.address]);
    await bancorExchange.setQuickSellPath([RING.address, RING.address, trxToken.address]);

    console.log('SUCCESS!')
    
    
}