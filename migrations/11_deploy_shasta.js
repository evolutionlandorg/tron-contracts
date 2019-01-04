const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");
const GOLD = artifacts.require("GOLD");
const FIRE = artifacts.require("FIRE");
const HHO = artifacts.require("HHO");
const SIOO = artifacts.require("SIOO");
const WOOD = artifacts.require("WOOD");

const RINGAuthority = artifacts.require("RINGAuthority");

const LocationCoder = artifacts.require("LocationCoder");
const InterstellarEncoder = artifacts.require("InterstellarEncoder");
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

const AuctionSettingIds = artifacts.require("AuctionSettingIds");
const ClockAuction = artifacts.require("ClockAuction");
const ClockAuctionAuthority = artifacts.require("ClockAuctionAuthority");
const MysteriousTreasure = artifacts.require("MysteriousTreasure");
const GenesisHolder = artifacts.require("GenesisHolder");

const LandBaseAuthority = artifacts.require("LandBaseAuthority");
const BancorExchangeAuthority = artifacts.require("BancorExchangeAuthority");

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


const conf = {
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    land_objectClass: 1,
    supervisor_address: '4100a1537d251a6a4c4effab76948899061fea47b9',

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


let ring,kton,settingIds,settingsRegistry,interstellarEncoder,interstellarEncoderId,landBase;
let bank;
let takeBack;

module.exports = function(deployer, network, accounts) {

    // console.log("deployer: ", deployer,", network: ", network, ", accounts: ",accounts);
    if (network == "shasta")
    {
        deployer.then(async () => {
            // await shastaDeploy(deployer, network, accounts);
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
    let ringAuthority = await RINGAuthority.deployed();
    await ring.setAuthority(ringAuthority.address);

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

    takeBack = await TakeBack.deployed();
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

    bank = await GringottsBank.deployed();

    let bank_unit_interest = await bank.UINT_BANK_UNIT_INTEREST.call();
    await settingsRegistry.setUintProperty(bank_unit_interest, conf.bank_unit_interest);

    let bank_penalty_multiplier = await bank.UINT_BANK_PENALTY_MULTIPLIER.call();
    await settingsRegistry.setUintProperty(bank_penalty_multiplier, conf.bank_penalty_multiplier);


    await deployer.deploy(MintAndBurnAuthority, bank.address);
    let mintAndBurnAuthority = await MintAndBurnAuthority.deployed();
    await kton.setAuthority(mintAndBurnAuthority.address);

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
    // await deployer.deploy(SmartTokenAuthority);

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
    // let ringId = await bancorExchange.CONTRACT_RING_ERC20_TOKEN.call();
    // await settingsRegistry.setAddressProperty(ringId, ring.address);

    let formulaId = await contractIds.BANCOR_FORMULA.call();
    await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);

    let bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
    await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    // do this to make SmartToken.totalSupply > 0
    await ring.changeCap(conf.MAXSUPPLY);
    await ring.issue(conf.from, '400000000000000000000000000');
    // await ring.issue(takeBack.address, '800000000000000000000000000');

    // let smartTokenAuthority = await SmartTokenAuthority.deployed();
    // await smartTokenAuthority.setWhitelist(bancorConverter.address, true);

    await ring.transferOwnership(bancorConverter.address);
    await bancorConverter.acceptTokenOwnership();

    await trxToken.deposit({callValue: '200000000000'});
    await trxToken.transfer(bancorConverter.address, '200000000000000000000000');
    await bancorConverter.updateConnector(trxToken.address, 100000, true, '200000000000000000000000');

    // await trxToken.deposit({callValue: '12000000'});
    // await trxToken.transfer(bancorConverter.address, '12000000000000000000');
    // await bancorConverter.updateConnector(trxToken.address, 100000, true, '12000000000000000000');


    await whiteList.addAddress(bancorExchange.address);
    await bancorConverter.setConversionWhitelist(whiteList.address);

    await bancorNetwork.registerTrxToken(trxToken.address, true);

    await bancorExchange.setQuickBuyPath([trxToken.address, ring.address, ring.address]);
    await bancorExchange.setQuickSellPath([ring.address, ring.address, trxToken.address]);

    console.log("=======end to deploy bancor contracts===========\n");

}

async function landDeploy(deployer, network, accounts){

    console.log("=======start to deploy land contracts===========\n");

    // const setRegistryAddress = '412083207a6e0212a7755f8a49a184ccf0ec1f165a';
    let setRegistryAddress = settingsRegistry.address;
    await deployer.deploy(LandBase, setRegistryAddress);
    await deployer.deploy(ObjectOwnership,setRegistryAddress);
    await deployer.deploy(TokenLocation);

    landBase = await LandBase.deployed();
    let landBaseAddr = landBase.address;
    let landBaseEthAddr = '0x' + landBaseAddr.substring(2);
    await deployer.deploy(ObjectOwnershipAuthority, [landBaseEthAddr]);
    await deployer.deploy(TokenLocationAuthority, [landBaseEthAddr]);

    //
    // // register in registry and initialization
    let objectOwnershipId = await settingIds.CONTRACT_OBJECT_OWNERSHIP.call();
    let landBaseId = await settingIds.CONTRACT_LAND_BASE.call();
    let tokenLocationId = await settingIds.CONTRACT_TOKEN_LOCATION.call();
    await settingsRegistry.setAddressProperty(landBaseId,landBaseAddr);
    let objectOwnership = await ObjectOwnership.deployed();
    await settingsRegistry.setAddressProperty(objectOwnershipId, objectOwnership.address);

    let tokenLocation = await TokenLocation.deployed();
    await settingsRegistry.setAddressProperty(tokenLocationId, tokenLocation.address);
    let tokenLocationAuthority = await TokenLocationAuthority.deployed();
    await tokenLocation.setAuthority(tokenLocationAuthority.address);

    let objectOwnershipAuthority = await ObjectOwnershipAuthority.deployed();
    await objectOwnership.setAuthority(objectOwnershipAuthority.address);

    await interstellarEncoder.registerNewTokenContract(objectOwnership.address);
    await interstellarEncoder.registerNewObjectClass(landBaseAddr, conf.land_objectClass);


    console.log("=======end to deploy land contracts===========\n");

}

async function marketDeploy(deployer, network, accounts){

    console.log("=======start to deploy market contracts===========\n");

    // const setRegistryAddress = '412083207a6e0212a7755f8a49a184ccf0ec1f165a';
    // await deployer.deploy(SettingsRegistry);
    // settingsRegistry = await SettingsRegistry.deployed();

    let setRegistryAddress = settingsRegistry.address;
    await deployer.deploy(AuctionSettingIds);
    await deployer.deploy(ClockAuction,setRegistryAddress);
    await deployer.deploy(MysteriousTreasure,setRegistryAddress,[10439, 419, 5258, 12200, 12200]);
    await deployer.deploy(GenesisHolder,setRegistryAddress);
    await deployer.deploy(RevenuePool,setRegistryAddress);
    await deployer.deploy(PointsRewardPool,setRegistryAddress);
    await deployer.deploy(UserPoints);

    let revenuePool = await RevenuePool.deployed();
    let revenuePoolAddrEth = '0x' + revenuePool.address.substring(2);

    let pointsRewardPool = await PointsRewardPool.deployed();
    let pointsRewardPoolAddrEth = '0x' + pointsRewardPool.address.substring(2);

    let mysteriousTreasure = await MysteriousTreasure.deployed();
    let mysteriousTreasureAddrEth = '0x' + mysteriousTreasure.address.substring(2);

    let clockAuction = await ClockAuction.deployed();
    let clockAuctionAddrEth = '0x' + clockAuction.address.substring(2);

    let genesisHolder = await GenesisHolder.deployed();
    let genesisHolderAddrEth = '0x' + genesisHolder.address.substring(2);


    await deployer.deploy(UserPointsAuthority, [revenuePoolAddrEth, pointsRewardPoolAddrEth]);
    await deployer.deploy(LandBaseAuthority, [mysteriousTreasureAddrEth]);
    await deployer.deploy(BancorExchangeAuthority, [clockAuctionAddrEth]);
    await deployer.deploy(ClockAuctionAuthority, [genesisHolderAddrEth]);

    let userPoint = await UserPoints.deployed();
    let own = await genesisHolder.owner();
    console.log("owner: ", own);
    await genesisHolder.setOperator(own);

    //
    // //register to registry
    let settingIds = await AuctionSettingIds.deployed();
    let revenueId = await settingIds.CONTRACT_REVENUE_POOL.call();
    await settingsRegistry.setAddressProperty(revenueId, revenuePool.address);
    //
    let pointsRewardId = await settingIds.CONTRACT_POINTS_REWARD_POOL.call();
    await settingsRegistry.setAddressProperty(pointsRewardId, pointsRewardPool.address);
    //
    let userPointsId = await settingIds.CONTRACT_USER_POINTS.call();
    await settingsRegistry.setAddressProperty(userPointsId, userPoint.address);
    //
    let contributionId = await settingIds.CONTRACT_CONTRIBUTION_INCENTIVE_POOL.call();
    await settingsRegistry.setAddressProperty(contributionId, conf.supervisor_address);
    //
    let dividendsId = await settingIds.CONTRACT_DIVIDENDS_POOL.call();
    await settingsRegistry.setAddressProperty(dividendsId, conf.supervisor_address);
    //
    let devId = await settingIds.CONTRACT_DEV_POOL.call();
    await settingsRegistry.setAddressProperty(devId, conf.supervisor_address);
    //
    let auctionId = await settingIds.CONTRACT_CLOCK_AUCTION.call();
    await settingsRegistry.setAddressProperty(auctionId, clockAuction.address);

    let auctionCutId = await settingIds.UINT_AUCTION_CUT.call();
    await settingsRegistry.setUintProperty(auctionCutId, conf.uint_auction_cut);

    let waitingTimeId = await settingIds.UINT_AUCTION_BID_WAITING_TIME.call();
    await settingsRegistry.setUintProperty(waitingTimeId, conf.uint_bid_waiting_time);

    let treasureId = await settingIds.CONTRACT_MYSTERIOUS_TREASURE.call();
    await settingsRegistry.setAddressProperty(treasureId, mysteriousTreasure.address);

    let bancorExchangeId = await settingIds.CONTRACT_BANCOR_EXCHANGE.call();
    let bancorEx = await BancorExchange.deployed();
    await settingsRegistry.setAddressProperty(bancorExchangeId, bancorEx.address);

    let refererCutId = await settingIds.UINT_REFERER_CUT.call();
    await settingsRegistry.setUintProperty(refererCutId, conf.uint_referer_cut);

    let errorSpaceId = await settingIds.UINT_EXCHANGE_ERROR_SPACE.call();
    await settingsRegistry.setUintProperty(errorSpaceId, conf.uint_error_space);



    // allow treasure to modify data in landbase
    let landBaseAuthority = await LandBaseAuthority.deployed();
    await landBase.setAuthority(landBaseAuthority.address);

    // transfer treasure's owner to clockAuction
    await mysteriousTreasure.setOwner(clockAuction.address);

    // set authority
    let userPointsAuthority = await UserPointsAuthority.deployed();
    await userPoint.setAuthority(userPointsAuthority.address);
    let bancorExchangeAuthority = await BancorExchangeAuthority.deployed();
    await bancorEx.setAuthority(bancorExchangeAuthority.address);

    await clockAuction.setAuthority(ClockAuctionAuthority.address);


    console.log("=======end to deploy market contracts===========\n");

}

async function shastaDeploy(deployer, network, accounts) {

    await baseContractsDeploy(deployer, network, accounts);
    await tokenContractsDeploy(deployer, network, accounts);
    await idContractsDeploy(deployer, network, accounts);
    await bankContractsDeploy(deployer, network, accounts);
    await bancorContractsDeploy(deployer, network, accounts);

    await landDeploy(deployer, network, accounts);
    await marketDeploy(deployer, network, accounts);

}
