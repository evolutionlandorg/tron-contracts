const SettingsRegistry = artifacts.require("SettingsRegistry");
const IDSettingIds = artifacts.require('IDSettingIds');
const DividendPool = artifacts.require('DividendPool');
const FrozenDividend = artifacts.require('FrozenDividend');
const RolesUpdater = artifacts.require("RolesUpdater");
const UserRoles = artifacts.require("UserRoles");
const TakeBack = artifacts.require('TakeBack');


const conf = {
    from: "TV9X71qbEFBAUSKrdq3tetKz2hwHnoDvVe",
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    ringAmountLimit: 500000 * 10**18,
    bagCountLimit: 50,
    perMinAmount: 20 ** 10**18,
    weight10Percent: 100000,
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
            // await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log("=======start to deploy id contracts===========\n");

    let settingsRegistry = await SettingsRegistry.deployed();

    await deployer.deploy(IDSettingIds);

    await deployer.deploy(UserRoles);
    let userRoles = await UserRoles.deployed();

    await deployer.deploy(FrozenDividend, settingsRegistry.address);
    let frozenDividend = await FrozenDividend.deployed();

    await deployer.deploy(DividendPool, settingsRegistry.address);
    let dividendPool = await DividendPool.deployed();

    await deployer.deploy(RolesUpdater, userRoles.address, conf.networkId, conf.supervisor_address);
    // await deployer.deploy(UserRolesAuthority, [RolesUpdater.address]);
    
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