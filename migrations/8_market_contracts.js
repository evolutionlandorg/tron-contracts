const RevenuePool = artifacts.require('RevenuePool');
const UserPoints = artifacts.require('UserPoints');
const UserPointsAuthority = artifacts.require('UserPointsAuthority');
const PointsRewardPool = artifacts.require('PointsRewardPool');

const AuctionSettingIds = artifacts.require("AuctionSettingIds");
const ClockAuction = artifacts.require("ClockAuction");
const ClockAuctionAuthority = artifacts.require("ClockAuctionAuthority");
const MysteriousTreasure = artifacts.require("MysteriousTreasure");
const GenesisHolder = artifacts.require("GenesisHolder");
const LandBaseAuthority = artifacts.require("LandBaseAuthority");
const BancorExchangeAuthority = artifacts.require("BancorExchangeAuthority");
const SettingsRegistry = artifacts.require('SettingsRegistry');
const BancorExchange = artifacts.require('BancorExchange');
const LandBase = artifacts.require("LandBase");



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

module.exports = function(deployer, network, accounts) {
    if (network == "development")
    {
        deployer.then(async () => {
            // await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log("=======start to deploy market contracts===========\n");

    let settingsRegistry = await SettingsRegistry.deployed();

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
    let landBase = await LandBase.deployed();
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