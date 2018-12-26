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
    weight10Percent: 100000
}

module.exports = function(deployer, network, accounts) {
    if (network == "production")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    // let settingsRegistry = await SettingsRegistry.deployed();
    // console.log(settingsRegistry);

    ////////////    Bancor Contracts   /////////// 
    // await deployer.deploy(ContractFeatures);
    await deployer.deploy(BancorFormula);
    // await deployer.deploy(WhiteList);
    // await deployer.deploy(TrxToken);
    // await deployer.deploy(BancorNetwork, settingsRegistry.address);

    let bancorNetworkAddress = "4159bbedfc43b1680626768d99d36fd680a72fab2b";

    console.log(bancorNetworkAddress);

    // let contractFeaturesId = await bancorNetwork.CONTRACT_FEATURES.call();
    // await settingsRegistry.setAddressProperty(contractFeaturesId, ContractFeatures.address);

    await deployer.deploy(BancorConverter, "416e0d26adf5323f5b82d5714354dc3c6870adee7c", "411cd4edbec62f4bc43ffa3c6a58779242e82282e7", 0, "41cd5ac730df2305dbcc65a74290ed9492a862b3fa", conf.weight10Percent);
    await deployer.deploy(BancorExchange, bancorNetworkAddress, BancorConverter.address, "411cd4edbec62f4bc43ffa3c6a58779242e82282e7");

    // let bancorExchange = await BancorExchange.deployed();

    // let whiteList = await WhiteList.deployed();
    // let trxToken = await TrxToken.deployed();
    // let bancorFormula = await BancorFormula.deployed();

    // let bancorConverter = await BancorConverter.deployed();

    // register
    // let formulaId = await bancorConverter.BANCOR_FORMULA.call();
    // await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);

    // let bancorNetworkId = await bancorConverter.BANCOR_NETWORK.call();
    // await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetworkAddress);

    // let ring = await RING.deployed();
    // //do this to make SmartToken.totalSupply > 0
    // // await ring.changeCap(16 * 10**8 * 10 ** 18);
    // await ring.changeCap("1600000000000000000000000000");
    // await ring.issue(conf.from, "400000000000000000000000000");

    // await ring.transferOwnership(bancorConverter.address);
    // await bancorConverter.acceptTokenOwnership();

    // // await trxToken.deposit({callValue: '3276110000000'});   3276110000000000000000000
    // // await trxToken.transfer(bancorConverter.address, '3276110000000000000000000');
    // await bancorConverter.updateConnector(trxToken.address, conf.weight10Percent, true, '3276110000000000000000000');

    // await whiteList.addAddress(bancorExchange.address);
    // await bancorConverter.setConversionWhitelist(whiteList.address);

    // await bancorNetwork.registerTrxToken(trxToken.address, true);

    // await bancorExchange.setQuickBuyPath([trxToken.address, RING.address, RING.address]);
    // await bancorExchange.setQuickSellPath([RING.address, RING.address, trxToken.address]);

    console.log('SUCCESS!')
    
    
}