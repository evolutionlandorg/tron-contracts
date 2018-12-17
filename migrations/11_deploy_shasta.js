const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");
const GOLD = artifacts.require("GOLD");
const FIRE = artifacts.require("FIRE");
const HHO = artifacts.require("HHO");
const SIOO = artifacts.require("SIOO");
const WOOD = artifacts.require("WOOD");


const RINGAuthority = artifacts.require("RINGAuthority");


const LocationCoder = artifacts.require("LocationCoder");
const InterstellarEncoder = artifacts.require("InterstellarEncoderV2");
const GringottsBank = artifacts.require("GringottsBank");
const SettingIds = artifacts.require("SettingIds");

const IDSettingIds = artifacts.require('IDSettingIds');
const MintAndBurnAuthority = artifacts.require('MintAndBurnAuthority');
const DividendPool = artifacts.require('DividendPool');
const FrozenDividend = artifacts.require('FrozenDividend');
const RolesUpdater = artifacts.require("RolesUpdater");
const UserRoles = artifacts.require("UserRoles");
const UserRolesAuthority = artifacts.require("UserRolesAuthority");
const RevenuePool = artifacts.require('RevenuePool');
const UserPoints = artifacts.require('UserPoints');
const UserPointsAuthority = artifacts.require('UserPointsAuthority');
const PointsRewardPool = artifacts.require('PointsRewardPool');
const TakeBack = artifacts.require('TakeBack');

// const Proxy = artifacts.require("OwnedUpgradeabilityProxy");
const LandBase = artifacts.require("LandBase");
const TokenLocation = artifacts.require("TokenLocation");
const ObjectOwnership = artifacts.require("ObjectOwnership");
const ObjectOwnershipAuthority = artifacts.require("ObjectOwnershipAuthority");
const TokenLocationAuthority = artifacts.require("TokenLocationAuthority");


const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
// const BancorGasPriceLimit = artifacts.require('BancorGasPriceLimit');
// const EtherToken = artifacts.require('EtherToken');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const SettingsRegistry = artifacts.require('SettingsRegistry');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');
const SmartTokenAuthority = artifacts.require('SmartTokenAuthority');

const COIN = 1*10**18;

const conf = {
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    land_objectClass: 1,
    supervisor_address: '41ab4866d8833f1da588a87fecff71c00416732a9c',

    networkId: 42,
    ringAmountLimit: 500000 * 10**18,
    bagCountLimit: 50,
    perMinAmount: 20 ** 10**18,
    weight10Percent: 100000,
    // remember to change this.
    from: '41ab4866d8833f1da588a87fecff71c00416732a9c',

    gasPrice: 100000,
    // 4%
    uint_auction_cut: 400,
    // 20%
    uint_referer_cut: 2000,
    // 30 minutes
    uint_bid_waiting_time: 1800,
    // errorsparce
    uint_error_space: 0,
    ringOwner : "41ab4866d8833f1da588a87fecff71c00416732a9c",
    MAXSUPPLY: '2000000000000000000000000000'

};

let devEnv = ["development","shasta"];
let prodEnv = ["production","tron"];
let ethEnv = ["development","production"];
let tronEnv = ["shasta","tron"];

let ring,kton,settingIds,settingsRegistry,interstellarEncoder,interstellarEncoderId;

module.exports = function(deployer, network, accounts) {

    console.log("deployer: ", deployer,", network: ", network, ", accounts: ",accounts);
    if (network == "shasta")
    {
        deployer.then(async () => {
            await shastaDeploy(deployer, network, accounts);
        });
    }
};

async function baseContractsDeploy(deployer, network, accounts){
    console.log("=======start to deploy some base contracts===========\n");


    await deployer.deploy(InterstellarEncoder);
    await deployer.deploy(SettingIds);
    await deployer.deploy(SettingsRegistry);
    settingIds = await SettingIds.deployed();
    settingsRegistry = await SettingsRegistry.deployed();

    interstellarEncoder = await InterstellarEncoder.deployed();
    interstellarEncoderId = await settingIds.CONTRACT_INTERSTELLAR_ENCODER.call();
    await settingsRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoder.address);

    console.log("=======end to deploy some base contracts===========\n");
}

async function tokenContractsDeploy(deployer, network, accounts){

    console.log("=======start to deploy token contracts===========\n");

    await deployer.deploy(RING);
    await deployer.deploy(KTON);

    ring = await RING.deployed();
    kton = await KTON.deployed();

    await deployer.deploy([GOLD,FIRE,HHO,SIOO,WOOD]);

    let gold = await GOLD.deployed();
    let fire = await FIRE.deployed();
    let wood = await WOOD.deployed();
    let water = await HHO.deployed();
    let soil = await SIOO.deployed();

    let ring_settings = await settingIds.CONTRACT_RING_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(ring_settings, ring.address);

    let kton_settings = await settingIds.CONTRACT_KTON_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(kton_settings, kton.address);

    let goldId = await settingIds.CONTRACT_GOLD_ERC20_TOKEN.call();
    let woodId = await settingIds.CONTRACT_WOOD_ERC20_TOKEN.call();
    let waterId = await settingIds.CONTRACT_WATER_ERC20_TOKEN.call();
    let fireId = await settingIds.CONTRACT_FIRE_ERC20_TOKEN.call();
    let soilId = await settingIds.CONTRACT_SOIL_ERC20_TOKEN.call();

    // register resouces to registry
    await settingsRegistry.setAddressProperty(goldId, gold.address);
    await settingsRegistry.setAddressProperty(woodId, wood.address);
    await settingsRegistry.setAddressProperty(waterId, water.address);
    await settingsRegistry.setAddressProperty(fireId, fire.address);
    await settingsRegistry.setAddressProperty(soilId, soil.address);


    await deployer.deploy(RINGAuthority, conf.ringOwner);

    console.log("=======end to deploy token contracts===========\n");

}

async function idContractsDeploy(deployer, network, accounts) {
    console.log("=======start to deploy id contracts===========\n");

    await deployer.deploy(IDSettingIds);

    await deployer.deploy(UserRoles);
    let userRoles = await UserRoles.deployed();

    await deployer.deploy(FrozenDividend, settingsRegistry.address);
    let frozenDividend = await FrozenDividend.deployed();

    await deployer.deploy(DividendPool, settingsRegistry.address);
    let dividendPool = await DividendPool.deployed();

    await deployer.deploy(RolesUpdater, userRoles.address, conf.networkId, conf.supervisor_address);
    // await deployer.deploy(UserRolesAuthority, [RolesUpdater.address]);
    await deployer.deploy(TakeBack, ring.address, conf.supervisor_address, conf.networkId);
    // deployer.deploy(RedBag, settingsRegistry.address, conf.ringAmountLimit, conf.bagCountLimit, conf.perMinAmount);


    let idSettingIds = await IDSettingIds.deployed();

    // register
    let dividendPoolId = await idSettingIds.CONTRACT_DIVIDENDS_POOL.call();
    await settingsRegistry.setAddressProperty(dividendPoolId, dividendPool.address);

    let takeBack = await TakeBack.deployed();
    let channelDivId = await idSettingIds.CONTRACT_CHANNEL_DIVIDEND.call();
    await settingsRegistry.setAddressProperty(channelDivId, takeBack.address);

    let frozenDivId = await idSettingIds.CONTRACT_FROZEN_DIVIDEND.call();
    await settingsRegistry.setAddressProperty(frozenDivId, frozenDividend.address);

    // await userRoles.setAuthority(UserRolesAuthority.address);

    console.log("=======end to deploy id contracts===========\n");

}

async function bankContractsDeploy(deployer, network, accounts) {
    console.log("=======start to deploy bank contracts===========\n");
    await deployer.deploy(GringottsBank, settingsRegistry.address);

    let bank = await GringottsBank.deployed();

    let bank_unit_interest = await bank.UINT_BANK_UNIT_INTEREST.call();
    await settingsRegistry.setUintProperty(bank_unit_interest, conf.bank_unit_interest);

    let bank_penalty_multiplier = await bank.UINT_BANK_PENALTY_MULTIPLIER.call();
    await settingsRegistry.setUintProperty(bank_penalty_multiplier, conf.bank_penalty_multiplier);


    // // kton.setAuthority will be done in market's migration
    // let interest = await bankProxy.computeInterest.call(10000, 12, conf.bank_unit_interest);
    // console.log("Current annual interest for 10000 RING is: ... " + interest + " KTON");

    console.log("=======end to deploy bank contracts===========\n");

}


async function bancorContractsDeploy(deployer, network, accounts) {

    console.log("=======start to deploy bancor contracts===========\n");
    /// Bancor
    await deployer.deploy(ContractIds);
    await deployer.deploy(ContractFeatures);
    await deployer.deploy(BancorFormula);
    await deployer.deploy(WhiteList);
    await deployer.deploy(TrxToken);
    await deployer.deploy(BancorNetwork, settingsRegistry.address);
    await deployer.deploy(SmartTokenAuthority);

    let contractIds = await ContractIds.deployed();
    let contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
    let contractFeatures = await ContractFeatures.deployed();
    let trxToken = await TrxToken.deployed();
    let bancorNetwork = await BancorNetwork.deployed();
    let bancorFormula = await BancorFormula.deployed();
    let whiteList = await WhiteList.deployed();

    await settingsRegistry.setAddressProperty(contractFeaturesId, contractFeatures.address);
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
    await ring.issue(conf.from, '1200000000000000000000000000');

    let smartTokenAuthority = await SmartTokenAuthority.deployed();
    await smartTokenAuthority.setWhitelist(bancorConverter.address, true);

    await ring.transferOwnership(bancorConverter.address);
    await bancorConverter.acceptTokenOwnership();

    await trxToken.deposit({callValue: '10000000'});
    await trxToken.transfer(bancorConverter.address, '10000000');

    // let COIN = 1000000;
    await bancorConverter.updateConnector(trxToken.address, 100000, true, '1200000000');

    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, ring.address, ring.address]);
    await bancorExchange.setQuickSellPath([ring.address, ring.address, trxToken.address]);

    console.log("=======end to deploy bancor contracts===========\n");

}

async function landDeploy(deployer, network, accounts){

    console.log("=======start to deploy land contracts===========\n");

    const setRegistryAddress = '412083207a6e0212a7755f8a49a184ccf0ec1f165a';
    await deployer.deploy(LandBase, setRegistryAddress);
    await deployer.deploy(ObjectOwnership);
    await deployer.deploy(TokenLocation);

    // let landBase = await LandBase.deployed();
    // await deployer.deploy(ObjectOwnershipAuthority, landBase.address);
    // await deployer.deploy(TokenLocationAuthority, landBase.address);
    // await deployer.deploy(InterstellarEncoder);


    // let interstellarEncoder = await InterstellarEncoder.deployed();
    // let interstellarEncoderId = await settingIds.CONTRACT_INTERSTELLAR_ENCODER.call();
    // await settingsRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoder.address);
    //
    // let landBase = await LandBase.deployed();
    // let objectOwnership = await ObjectOwnership.deployed();
    // let tokenLocation = await TokenLocation.deployed();
    //
    // // register in registry
    // let objectOwnershipId = await settingIds.CONTRACT_OBJECT_OWNERSHIP.call();
    // let landBaseId = await settingIds.CONTRACT_LAND_BASE.call();
    // let tokenLocationId = await settingIds.CONTRACT_TOKEN_LOCATION.call();
    // await settingsRegistry.setAddressProperty(landBaseId,landBaseProxy_address);
    // await settingsRegistry.setAddressProperty(objectOwnershipId, objectOwnershipProxy_address);
    // await settingsRegistry.setAddressProperty(tokenLocationId, tokenLocationProxy_address);

    // await ObjectOwnership.at(objectOwnershipProxy_address).setAuthority(ObjectOwnershipAuthority.address);
    //
    //
    // await interstellarEncoder.registerNewTokenContract(objectOwnershipProxy_address);
    // await interstellarEncoder.registerNewObjectClass(landBaseProxy_address, conf.land_objectClass);


    console.log("=======end to deploy land contracts===========\n");

}

async function testDeploy(deployer, network, accounts){

    let hRing  = await deployer.tronWeb.Contract(RING.abi).at('0x74ca9d500f00601b8e1db69734c05e04b7b67be9');
    console.log("ring address", hRing.address);

}

async function shastaDeploy(deployer, network, accounts) {

    // await baseContractsDeploy(deployer, network, accounts);
    // await tokenContractsDeploy(deployer, network, accounts);
    // await idContractsDeploy(deployer, network, accounts);
    // await bankContractsDeploy(deployer, network, accounts);
    // await bancorContractsDeploy(deployer, network, accounts);

    landDeploy(deployer, network, accounts);
}
