const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");


const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');
const FeatureIds = artifacts.require('FeatureIds');

const BancorExchangeAuthority = artifacts.require('BancorExchangeAuthority');

const conf = {
    from: "TV9X71qbEFBAUSKrdq3tetKz2hwHnoDvVe",
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    networkId: 200001,  // TRON shasta
    ringAmountLimit: 500000 * 10**18,
    bagCountLimit: 50,
    perMinAmount: 20 ** 10**18,
    weight10Percent: 100000,
    gasPrice: 10000000000,
    supervisor_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    dev_pool_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    contribution_incentive_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    // errorsparce
    uint_error_space: 0
}

module.exports = function(deployer, network, accounts) {
    if (network == "development")
    {
        deployer.then(async () => {
            // await deployer.deploy(TrxToken);
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    let settingsRegistry = await SettingsRegistry.deployed();

    ////////////    Bancor Contracts   /////////// 
    await deployer.deploy(ContractIds);
    await deployer.deploy(ContractFeatures);
    await deployer.deploy(BancorFormula);
    await deployer.deploy(WhiteList);
    await deployer.deploy(TrxToken);
    await deployer.deploy(BancorNetwork, settingsRegistry.address);

    let contractIds = await ContractIds.deployed();
    let contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
    await settingsRegistry.setAddressProperty(contractFeaturesId, ContractFeatures.address);
    await deployer.deploy(BancorConverter, RING.address, settingsRegistry.address, 0, TrxToken.address, conf.weight10Percent);
    await deployer.deploy(BancorExchange, BancorNetwork.address, BancorConverter.address, settingsRegistry.address);

    let bancorExchange = await BancorExchange.deployed();

    let whiteList = await WhiteList.deployed();
    let trxToken = await TrxToken.deployed();
    let bancorNetwork = await BancorNetwork.deployed();
    let bancorFormula = await BancorFormula.deployed();

    let bancorConverter = await BancorConverter.deployed();

    // register
    let formulaId = await contractIds.BANCOR_FORMULA.call();
    await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);

    let bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
    await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    let ring = RING.deployed();
    //do this to make SmartToken.totalSupply > 0
    await ring.changeCap(20 * 10**8 * 10 ** 18);
    await ring.issue(conf.from, 12 * 10 **8 * 10 ** 18);

    // await smartTokenAuthority.setWhitelist(bancorConverter.address, true);

    await ring.transferOwnership(bancorConverter.address);
    await bancorConverter.acceptTokenOwnership();

    await trxToken.deposit({callValue: 10 ** 6});
    await trxToken.transfer(BancorConverter.address, 1 * 10 ** 6);
    
    // let COIN = 1000000;
    await bancorConverter.updateConnector(trxToken.address, 100000, true, 1200 * 10 ** 6);

    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, RING.address, RING.address]);
    await bancorExchange.setQuickSellPath([RING.address, RING.address, trxToken.address]);

    console.log('SUCCESS!')

    // await deployer.deploy(MintAndBurnAuthority, [bank.address, dividendPool.address]);
    // await kton.setAuthority(MintAndBurnAuthority.address);
    
    //     await deployer.deploy(ObjectOwnershipAuthority, [landBaseProxy.address]);
    //     await deployer.deploy(TokenLocationAuthority, [landBaseProxy.address]);
    //     // set authority
    //     await tokenLocationProxy.setAuthority(TokenLocationAuthority.address);
    //     await objectOwnershipProxy.setAuthority(ObjectOwnershipAuthority.address);
    //     // setAuthority
    
    // await deployer.deploy(InterstellarEncoder);
    // let interstellarEncoder = await InterstellarEncoder.deployed();
    // let interstellarEncoderId = await settingIds.CONTRACT_INTERSTELLAR_ENCODER.call();
    // await settingsRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoder.address);
    
    
}