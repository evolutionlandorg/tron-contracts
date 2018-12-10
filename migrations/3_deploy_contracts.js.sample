const LocationCoder = artifacts.require("LocationCoder");
const TokenLocation = artifacts.require("TokenLocation.sol");
const InterstellarEncoder = artifacts.require("InterstellarEncoderV2");
const GringottsBank = artifacts.require("GringottsBank");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const StandardERC223 = artifacts.require("StandardERC223");
const Proxy = artifacts.require("OwnedUpgradeabilityProxy");

const ObjectOwnership = artifacts.require('ObjectOwnership');
const ObjectOwnershipAuthority = artifacts.require('ObjectOwnershipAuthority');

const DeployAndTest = artifacts.require('DeployAndTest');

const SettingIds = artifacts.require('SettingIds');
const BankSettingIds = artifacts.require('BankSettingIds');


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


const MysteriousTreasure = artifacts.require('MysteriousTreasure');
const GenesisHolder = artifacts.require('GenesisHolder')
const LandBase = artifacts.require('LandBase');

const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const BancorGasPriceLimit = artifacts.require('BancorGasPriceLimit');
const EtherToken = artifacts.require('EtherToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');
const FeatureIds = artifacts.require('FeatureIds');

const AuctionSettingIds = artifacts.require('AuctionSettingIds');
const ClockAuction = artifacts.require('ClockAuction')
const LandBaseAuthority = artifacts.require('LandBaseAuthority');
const BancorExchangeAuthority = artifacts.require('BancorExchangeAuthority');
const ClockAuctionAuthority = artifacts.require('ClockAuctionAuthority');

const conf = {
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    land_objectClass: 1,
    networkId: 42,
    ringAmountLimit: 500000 * 10**18,
    bagCountLimit: 50,
    perMinAmount: 20 ** 10**18,
    weight10Percent: 100000,
    gasPrice: 10000000000,
    supervisor_address: '00a1537d251a6a4c4effAb76948899061FeA47b9',
    dev_pool_address: '00a1537d251a6a4c4effAb76948899061FeA47b9',
    contribution_incentive_address: '00a1537d251a6a4c4effAb76948899061FeA47b9',
    // 4%
    uint_auction_cut: 400,
    // 20%
    uint_referer_cut: 2000,
    // 30 minutes
    uint_bid_waiting_time: 1800,
    // errorsparce
    uint_error_space: 0
}

let ring;
let kton;

let gold;
let wood;
let water;
let fire;
let soil;

let settingIds;
let settingsRegistry;

module.exports = function(deployer, network, accounts) {
    if (network == "development")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log(network);

    let interstellarEncoder
    // await deployer.deploy(LocationCoder);
    await deployer.deploy(InterstellarEncoder);
    await deployer.deploy(SettingIds);
    await deployer.deploy(SettingsRegistry).then(
        async() => {
            settingIds = await SettingIds.deployed();
            settingsRegistry = await SettingsRegistry.deployed();

            interstellarEncoder = await InterstellarEncoder.deployed();
            let interstellarEncoderId = await settingIds.CONTRACT_INTERSTELLAR_ENCODER.call();
            await settingsRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoder.address);
        }
    );

    ///////////   Token Contracts     ////////////////
    await deployer.deploy(DeployAndTest).then(async () => {
        let instance = await DeployAndTest.deployed();
        ring  =  await instance.testRING.call();
        kton  =  await instance.testKTON.call();

        let ring_settings = await settingIds.CONTRACT_RING_ERC20_TOKEN.call();
        await settingsRegistry.setAddressProperty(ring_settings, ring);

        let kton_settings = await settingIds.CONTRACT_KTON_ERC20_TOKEN.call();
        return settingsRegistry.setAddressProperty(kton_settings, kton);
    })

    // web3.toHex('GOLD') = "0x474f4c44"
    // web3.toHex('WOOD') = "0x574f4f44"
    // web3.toHex('WATER') = "0x5741544552"
    // web3.toHex('FIRE') = "0x46495245"
    // web3.toHex('SOIL') = "0x534f494c"
    // await deployer.deploy(StandardERC223, 0x474f4c44
    // ).then(async() => {
    //     gold = await StandardERC223.deployed();
    //     return deployer.deploy(StandardERC223, 0x574f4f44)
    // }).then(async() => {
    //     wood = await StandardERC223.deployed();
    //     return deployer.deploy(StandardERC223, 0x5741544552)
    // }).then(async() => {
    //     water = await StandardERC223.deployed();
    //     return deployer.deploy(StandardERC223, 0x46495245)
    // }).then(async () => {
    //     fire = await StandardERC223.deployed();
    //     return deployer.deploy(StandardERC223, 0x534f494c)
    // }).then(async() => {
    //     soil = await StandardERC223.deployed();

    //     let goldId = await settingIds.CONTRACT_GOLD_ERC20_TOKEN.call();
    //     let woodId = await settingIds.CONTRACT_WOOD_ERC20_TOKEN.call();
    //     let waterId = await settingIds.CONTRACT_WATER_ERC20_TOKEN.call();
    //     let fireId = await settingIds.CONTRACT_FIRE_ERC20_TOKEN.call();
    //     let soilId = await settingIds.CONTRACT_SOIL_ERC20_TOKEN.call();

    //     // register resouces to registry
    //     await settingsRegistry.setAddressProperty(goldId, gold.address);
    //     await settingsRegistry.setAddressProperty(woodId, wood.address);
    //     await settingsRegistry.setAddressProperty(waterId, water.address);
    //     await settingsRegistry.setAddressProperty(fireId, fire.address);
    //     await settingsRegistry.setAddressProperty(soilId, soil.address);
    // })

    
    ///////////   Land Contracts     ////////////////
    let landBaseProxy;
    let objectOwnershipProxy;
    let tokenLocationProxy;
    await deployer.deploy(Proxy).then(async () => {
        tokenLocationProxy = await Proxy.deployed();
        return deployer.deploy(Proxy);
    }).then(async() => {
        landBaseProxy = await Proxy.deployed();
        return deployer.deploy(Proxy);
    }).then(async() => {
        objectOwnershipProxy = await Proxy.deployed();

        await deployer.deploy(LandBase);
        await deployer.deploy(ObjectOwnership);
        await deployer.deploy(TokenLocation);
    }).then(async () => {
        // register in registry
        let objectOwnershipId = await settingIds.CONTRACT_OBJECT_OWNERSHIP.call();
        let landBaseId = await settingIds.CONTRACT_LAND_BASE.call();
        let tokenLocationId = await settingIds.CONTRACT_TOKEN_LOCATION.call();

        await settingsRegistry.setAddressProperty(landBaseId,landBaseProxy.address);
        await settingsRegistry.setAddressProperty(objectOwnershipId, objectOwnershipProxy.address);
        await settingsRegistry.setAddressProperty(tokenLocationId, tokenLocationProxy.address);

        console.log("REGISTER DONE!");

        // upgrade
        await LandBase.deployed();
        await ObjectOwnership.deployed();
        await TokenLocation.deployed();

        await landBaseProxy.upgradeTo(LandBase.address);
        await objectOwnershipProxy.upgradeTo(ObjectOwnership.address);
        await tokenLocationProxy.upgradeTo(TokenLocation.address);
        console.log("UPGRADE DONE!");

        // let landBase = await LandBase.at(landBaseProxy.address);
        // await landBase.initializeContract(settingsRegistry.address);

        // let tokenLocation = await TokenLocation.at(tokenLocationProxy.address);
        // await tokenLocation.initializeContract();

        // let objectOwnership = await ObjectOwnership.at(objectOwnershipProxy.address);
        // await objectOwnership.initializeContract(settingsRegistry.address);

        // console.log("INITIALIZE DONE!");

        await interstellarEncoder.registerNewTokenContract(objectOwnershipProxy.address);
        await interstellarEncoder.registerNewObjectClass(landBaseProxy.address, conf.land_objectClass);

        console.log('MIGRATION SUCCESS!');
    });

    ////////////    Bank Contracts   ///////////
    let bankProxy;
    await deployer.deploy(BankSettingIds).then(async() => {
        console.log("\n========================\n" +
            "BANK MIGRATION STARTS!!" +
            "\n========================\n\n");

        await deployer.deploy(Proxy);
        await deployer.deploy(GringottsBank);
    }).then(async() => {
        bankProxy = await Proxy.deployed();
        let bankSettingIds = await BankSettingIds.deployed();

        let bank_unit_interest = await bankSettingIds.UINT_BANK_UNIT_INTEREST.call();
        await settingsRegistry.setUintProperty(bank_unit_interest, conf.bank_unit_interest);

        let bank_penalty_multiplier = await bankSettingIds.UINT_BANK_PENALTY_MULTIPLIER.call();
        await settingsRegistry.setUintProperty(bank_penalty_multiplier, conf.bank_penalty_multiplier);
        console.log("REGISTRATION DONE! ");

        // upgrade
        await bankProxy.upgradeTo(GringottsBank.address);
        console.log("UPGRADE DONE! ");

        // initialize
        // let bank = await GringottsBank.at(bankProxy.address);
        // await bank.initializeContract(settingsRegistry.address);
        // console.log("INITIALIZATION DONE! ");

        // // kton.setAuthority will be done in market's migration
        // let interest = await bankProxy.computeInterest.call(10000, 12, conf.bank_unit_interest);
        // console.log("Current annual interest for 10000 RING is: ... " + interest + " KTON");
    });

    // deployer.deploy(RedBag, settingsRegistry.address, conf.ringAmountLimit, conf.bagCountLimit, conf.perMinAmount);
    await deployer.deploy(TakeBack, ring, conf.supervisor_address, conf.networkId);

    ////////////    ID Contracts   ///////////
    await deployer.deploy(IDSettingIds);
    let frozenDividendProxy;
    let dividendPoolProxy;
    let userRolesProxy;
    await deployer.deploy(Proxy).then(async () => {
        dividendPoolProxy = await Proxy.deployed();

        await deployer.deploy(Proxy);

        
    }).then(async () => {
        frozenDividendProxy = await Proxy.deployed();

        await  deployer.deploy(Proxy)
    }).then(async () => {
        userRolesProxy = await Proxy.deployed();

        await deployer.deploy(UserRoles);
        await deployer.deploy(FrozenDividend);
        await deployer.deploy(DividendPool);
        await deployer.deploy(RolesUpdater, userRolesProxy.address, conf.networkId, conf.supervisor_address);
        // await deployer.deploy(UserRolesAuthority, [RolesUpdater.address]);
    }).then(async () => {
        let idSettingIds = await IDSettingIds.deployed();

        // register
        let dividendPoolId = await idSettingIds.CONTRACT_DIVIDENDS_POOL.call();
        await settingsRegistry.setAddressProperty(dividendPoolId, dividendPoolProxy.address);

        let channelDivId = await idSettingIds.CONTRACT_CHANNEL_DIVIDEND.call();
        await settingsRegistry.setAddressProperty(channelDivId, TakeBack.address);

        let frozenDivId = await idSettingIds.CONTRACT_FROZEN_DIVIDEND.call();
        await settingsRegistry.setAddressProperty(frozenDivId, frozenDividendProxy.address);
        console.log("REGISTRATION DONE! ");

        // upgrade
        await dividendPoolProxy.upgradeTo(DividendPool.address);
        await frozenDividendProxy.upgradeTo(FrozenDividend.address);
        await userRolesProxy.upgradeTo(UserRoles.address);
        console.log("UPGRADE DONE! ");

        // initialize
        // let dividendPool = await DividendPool.at(dividendPoolProxy.address);
        // await dividendPool.initializeContract(settingsRegistry.address);

        // let frozenDividend = await FrozenDividend.at(frozenDividendProxy.address);
        // await frozenDividend.initializeContract(settingsRegistry.address);

        // let userRoles = await UserRoles.at(userRolesProxy.address);
        // await userRoles.initializeContract();
        // console.log("INITIALIZATION DONE! ");

        // await userRoles.setAuthority(UserRolesAuthority.address);
        console.log('MIGRATION SUCCESS!');
    });

    ////////////    Bancor Contracts   /////////// 
    // await deployer.deploy(ContractIds);
    // await deployer.deploy(ContractFeatures);
    // await deployer.deploy(BancorFormula);
    // await deployer.deploy(WhiteList);
    // await deployer.deploy(EtherToken);
    // await deployer.deploy(BancorGasPriceLimit, conf.gasPrice);
    // await deployer.deploy(BancorNetwork, settingsRegistry.address).then(async () => {
    //     let contractIds = await ContractIds.deployed();
    //     let contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
    //     await settingsRegistry.setAddressProperty(contractFeaturesId, ContractFeatures.address);
    // }).then(async () => {
    //     await deployer.deploy(BancorConverter, ring, settingsRegistry.address, 0, EtherToken.address, conf.weight10Percent);
    // }).then(async () => {
    //     await deployer.deploy(BancorExchange, BancorNetwork.address, BancorConverter.address, settingsRegistry.address);
    // }).then(async () => {
    //     let bancorExchange = await BancorExchange.deployed();

    //     let whiteList = await WhiteList.deployed();
    //     let etherToken = await EtherToken.deployed();
    //     let bancorNetwork = await BancorNetwork.deployed();
    //     let bancorGasPriceLimit = await BancorGasPriceLimit.deployed();
    //     let bancorFormula = await BancorFormula.deployed();

    //     let contractIds = await ContractIds.deployed();

    //     let bancorConverter = await BancorConverter.deployed();

    //     // register
    //     let formulaId = await contractIds.BANCOR_FORMULA.call();
    //     await settingsRegistry.setAddressProperty(formulaId, bancorFormula.address);
    //     let gasPriceLimitId = await contractIds.BANCOR_GAS_PRICE_LIMIT.call();
    //     await settingsRegistry.setAddressProperty(gasPriceLimitId, bancorGasPriceLimit.address);
    //     let bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
    //     await settingsRegistry.setAddressProperty(bancorNetworkId, bancorNetwork.address);

    //     //do this to make SmartToken.totalSupply > 0
    //     // await ring.changeCap(20 * 10**8 * COIN);
    //     // await ring.issue(conf.from, 12 * 10 **8 * COIN);
    //     // await smartTokenAuthority.setWhitelist(bancorConverter.address, true);

    //     // await ring.transferOwnership(bancorConverter.address);
    //     // await bancorConverter.acceptTokenOwnership();

    //     // await etherToken.deposit({value: 1 * COIN});
    //     // await etherToken.transfer(BancorConverter.address, 1 * COIN);
    //     let COIN = 1000000;
    //     await bancorConverter.updateConnector(etherToken.address, 100000, true, 1200 * COIN);

    //     await whiteList.addAddress(bancorExchange.address);
    //     await bancorConverter.setConversionWhitelist(whiteList.address);

    //     await bancorNetwork.registerEtherToken(etherToken.address, true);

    //     await bancorExchange.setQuickBuyPath([etherToken.address, ring, ring]);
    //     await bancorExchange.setQuickSellPath([ring, ring, etherToken.address]);

    //     console.log('SUCCESS!')
    // })

    let clockAuctionProxy;
    let mysteriousTreasureProxy;
    let genesisHolderProxy;
    let revenuePoolProxy;
    let pointsRewardPoolProxy;
    let userPointsProxy;
    ////////////    Market Contracts   /////////// 
    await deployer.deploy(AuctionSettingIds).then(async() => {
        console.log("\n========================\n" +
            "AUCTION MIGRATION STARTS!!" +
            "\n========================\n\n");
        await deployer.deploy(Proxy)
    }).then(async () => {
        clockAuctionProxy = await Proxy.deployed();
        await deployer.deploy(ClockAuction);
        return deployer.deploy(Proxy);
    }).then(async () => {
        mysteriousTreasureProxy = await Proxy.deployed();
        await deployer.deploy(MysteriousTreasure);
        return deployer.deploy(Proxy)
    }).then(async () => {
        genesisHolderProxy  = await Proxy.deployed();
        await deployer.deploy(GenesisHolder);
        return deployer.deploy(Proxy)
    }).then(async () => {
        revenuePoolProxy = await Proxy.deployed();
        await deployer.deploy(RevenuePool);
        return deployer.deploy(Proxy)
    }).then(async() => {
        pointsRewardPoolProxy = await Proxy.deployed();
        await deployer.deploy(PointsRewardPool);
        return deployer.deploy(Proxy)
    }).then(async() => {
        userPointsProxy = await Proxy.deployed();
        await deployer.deploy(UserPoints);
    }).then(async() => {
        // await deployer.deploy(UserPointsAuthority, [revenuePoolProxy.address, pointsRewardPoolProxy.address]);
        // await deployer.deploy(LandBaseAuthority, [mysteriousTreasureProxy.address]);
        // await deployer.deploy(BancorExchangeAuthority, [clockAuctionProxy.address]);
        // await deployer.deploy(ClockAuctionAuthority, [genesisHolderProxy.address]);
    // }).then(async () => {

        // let ring = await RING.at(conf.ring_address);
        let settingIds = await AuctionSettingIds.deployed();

        //register to registry

        let revenueId = await settingIds.CONTRACT_REVENUE_POOL.call();
        await settingsRegistry.setAddressProperty(revenueId, revenuePoolProxy.address);

        let pointsRewardId = await settingIds.CONTRACT_POINTS_REWARD_POOL.call();
        await settingsRegistry.setAddressProperty(pointsRewardId, pointsRewardPoolProxy.address);

        let userPointsId = await settingIds.CONTRACT_USER_POINTS.call();
        await settingsRegistry.setAddressProperty(userPointsId, userPointsProxy.address);

        let contributionId = await settingIds.CONTRACT_CONTRIBUTION_INCENTIVE_POOL.call();
        await settingsRegistry.setAddressProperty(contributionId, conf.contribution_incentive_address);

        let dividendsId = await settingIds.CONTRACT_DIVIDENDS_POOL.call();
        await settingsRegistry.setAddressProperty(dividendsId, dividendPoolProxy.addresss);

        let devId = await settingIds.CONTRACT_DEV_POOL.call();
        await settingsRegistry.setAddressProperty(devId, conf.dev_pool_address);

        let auctionId = await settingIds.CONTRACT_CLOCK_AUCTION.call();
        await settingsRegistry.setAddressProperty(auctionId, clockAuctionProxy.address);

        let auctionCutId = await settingIds.UINT_AUCTION_CUT.call();
        await settingsRegistry.setUintProperty(auctionCutId, conf.uint_auction_cut);

        let waitingTimeId = await settingIds.UINT_AUCTION_BID_WAITING_TIME.call();
        await settingsRegistry.setUintProperty(waitingTimeId, conf.uint_bid_waiting_time);

        let treasureId = await settingIds.CONTRACT_MYSTERIOUS_TREASURE.call();
        await settingsRegistry.setAddressProperty(treasureId, mysteriousTreasureProxy.address);

        let bancorExchangeId = await settingIds.CONTRACT_BANCOR_EXCHANGE.call();
        await settingsRegistry.setAddressProperty(bancorExchangeId, BancorExchange.address);

        let refererCutId = await settingIds.UINT_REFERER_CUT.call();
        await settingsRegistry.setUintProperty(refererCutId, conf.uint_referer_cut);

        let errorSpaceId = await settingIds.UINT_EXCHANGE_ERROR_SPACE.call();
        await settingsRegistry.setUintProperty(errorSpaceId, conf.uint_error_space);

        console.log("REGISTRATION DONE! ");

        // upgrade
        await clockAuctionProxy.upgradeTo(ClockAuction.address);
        await mysteriousTreasureProxy.upgradeTo(MysteriousTreasure.address);
        await genesisHolderProxy.upgradeTo(GenesisHolder.address);
        await revenuePoolProxy.upgradeTo(RevenuePool.address);
        await pointsRewardPoolProxy.upgradeTo(PointsRewardPool.address);
        await userPointsProxy.upgradeTo(UserPoints.address);
        console.log("UPGRADE DONE! ");

        // initialize
        // let clockAuction = await ClockAuction.at(clockAuctionProxy.address);
        // await clockAuction.initializeContract(settingsRegistry.address);

        // let genesisHolder = await GenesisHolder.at(genesisHolderProxy.address);
        // await genesisHolder.initializeContract(settingsRegistry.address);

        // let mysteriousTreasure = await MysteriousTreasure.at(mysteriousTreasureProxy.address);
        // await mysteriousTreasure.initializeContract(settingsRegistry.address, [10439, 419, 5258, 12200, 12200]);

        // let revenuePool = await RevenuePool.at(revenuePoolProxy.address);
        // await revenuePool.initializeContract(settingsRegistry.address);

        // let pointsRewardPool = await PointsRewardPool.at(pointsRewardPoolProxy.address);
        // await pointsRewardPool.initializeContract(settingsRegistry.address);

        // let userPoints = await UserPoints.at(userPointsProxy.address);
        // await userPoints.initializeContract();
        // console.log("INITIALIZATION DONE! ");

        // // allow treasure to modify data in landbase
        // let landBase = await LandBase.at(landBaseProxy.address);
        // await landBase.setAuthority(LandBaseAuthority.address);

        // // transfer treasure's owner to clockAuction
        // await mysteriousTreasure.setOwner(clockAuctionProxy.address);

        // // set authority
        // await userPoints.setAuthority(UserPointsAuthority.address);
        // await BancorExchange.at(BancorExchange.address).setAuthority(BancorExchangeAuthority.address);

        // await clockAuctionProxy.setAuthority(ClockAuctionAuthority.address);

        console.log("MIGRATE SUCCESSFULLY! ")

        console.log("\n========================\n" +
            "AUCTION MIGRATION SUCCESS!!" +
            "\n========================\n\n");

    })

    // await deployer.deploy(MintAndBurnAuthority, [bankProxy.address, dividendPoolProxy.address]).then(async() => {
    //     await deployer.deploy(ObjectOwnershipAuthority, [landBaseProxy.address]);
    //     await deployer.deploy(TokenLocationAuthority, [landBaseProxy.address]);
    //     // set authority
    //     await tokenLocationProxy.setAuthority(TokenLocationAuthority.address);
    //     await objectOwnershipProxy.setAuthority(ObjectOwnershipAuthority.address);
    //     // setAuthority
    //     await kton.setAuthority(MintAndBurnAuthority.address);
    // });

    
    
}