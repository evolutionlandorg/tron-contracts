const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const TakeBack = artifacts.require('TakeBack');

const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
// const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');

const BancorExchange = artifacts.require('BancorExchangeV2');


const conf = {
    from: "TRasHRVomS95RQHedR8HuYbck5XV6SMeWd",
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    weight10Percent: 100000,
    MAXSUPPLY: '2000000000000000000000000000'
};

module.exports = function(deployer, network, accounts) {
    if (network == "shasta")
    {
        deployer.then(async () => {
            // await developmentDeploy(deployer, network, accounts);
            //修复bancorExchane合约，跑完该部署脚本后，手动在whiteList合约增加白名单给新bancorEx合约地址
            let bancorNetAddr = '41c1cf497da383a68d09038b58c90e87d820ce7d8d';
            let bancorCvtAddr = '41649b08c0f47fbaec6bfcdf84fb6559b95eb084b1';
            const registryAddr = '41b83adfcf60a4e8afd0849bca48c054b47178618f';
            await deployer.deploy(BancorExchange, bancorNetAddr, bancorCvtAddr, registryAddr);

            let bancorExchange = await BancorExchange.deployed();

            const trxAddr = '417b7a34048d4e421e54b415392b662629f7173685';
            const ringAddr = '4181f0f3891cb32d1af69a6c853aefa6cf80f270b5';

            await bancorExchange.setQuickBuyPath([trxAddr, ringAddr, ringAddr]);
            await bancorExchange.setQuickSellPath([ringAddr, ringAddr, trxAddr]);


        });
    }
};

async function developmentDeploy(deployer, network, accounts) {

    await deployer.deploy(ContractIds);
    await deployer.deploy(ContractFeatures);
    await deployer.deploy(BancorFormula);
    await deployer.deploy(WhiteList);
    await deployer.deploy(TrxToken);
    let settingsRegistry = await SettingsRegistry.deployed();
    await deployer.deploy(BancorNetwork, settingsRegistry.address);

    let contractIds = await ContractIds.deployed();
    let contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
    let contractFeatures = await ContractFeatures.deployed();
    let trxToken = await TrxToken.deployed();
    let bancorNetwork = await BancorNetwork.deployed();
    let bancorFormula = await BancorFormula.deployed();
    let whiteList = await WhiteList.deployed();

    await settingsRegistry.setAddressProperty(contractFeaturesId, contractFeatures.address);
    let ring = await RING.deployed();
    await deployer.deploy(BancorConverter, ring.address, settingsRegistry.address, 0, trxToken.address, conf.weight10Percent);
    let bancorConverter = await BancorConverter.deployed();
    await deployer.deploy(BancorExchange, bancorNetwork.address, bancorConverter.address, settingsRegistry.address);

    let bancorExchange = await BancorExchange.deployed();

    // register
    let formulaId = await contractIds.BANCOR_FORMULA.call();
    await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);

    let bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
    await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    // do this to make SmartToken.totalSupply > 0

    await ring.changeCap(conf.MAXSUPPLY);
    await ring.issue(conf.from, '400000000000000000000000000');
    let takeBack = TakeBack.deployed();
    await ring.transfer(takeBack.address, '200000000000000000000000000');


    await ring.transferOwnership(bancorConverter.address);
    await bancorConverter.acceptTokenOwnership();

    // await trxToken.deposit({callValue: '200000000000'});
    // await trxToken.transfer(bancorConverter.address, '200000000000000000000000');
    // await bancorConverter.updateConnector(trxToken.address, 100000, true, '200000000000000000000000');


    await trxToken.deposit({callValue: '327611000000'});
    await trxToken.transfer(bancorConverter.address, '327611000000000000000000');
    await bancorConverter.updateConnector(trxToken.address, conf.weight10Percent, true, '327611000000000000000000');


    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, ring.address, ring.address]);
    await bancorExchange.setQuickSellPath([ring.address, ring.address, trxToken.address]);

}