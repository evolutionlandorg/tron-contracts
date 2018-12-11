const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");

const DeployAndTest = artifacts.require('DeployAndTest');

const SettingIds = artifacts.require('SettingIds');


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

    ////////////    ID Contracts   ///////////
    await deployer.deploy(FrozenDividend, settingsRegistry.address);
    await deployer.deploy(DividendPool, settingsRegistry.address);
    // deployer.deploy(RedBag, settingsRegistry.address, conf.ringAmountLimit, conf.bagCountLimit, conf.perMinAmount);
    await deployer.deploy(TakeBack, RING.address, conf.supervisor_address, conf.networkId);

    let dividendPool = await DividendPool.deployed();

    // register
    let dividendPoolId = await dividendPool.CONTRACT_DIVIDENDS_POOL.call();
    await settingsRegistry.setAddressProperty(dividendPoolId, DividendPool.address);

    let channelDivId = await dividendPool.CONTRACT_CHANNEL_DIVIDEND.call();
    await settingsRegistry.setAddressProperty(channelDivId, TakeBack.address);

    let frozenDivId = await dividendPool.CONTRACT_FROZEN_DIVIDEND.call();
    await settingsRegistry.setAddressProperty(frozenDivId, FrozenDividend.address);
    console.log("REGISTRATION DONE! ");

    // await deployer.deploy(UserRoles);
    // await deployer.deploy(RolesUpdater, UserRoles.address, conf.networkId, conf.supervisor_address);
    // await deployer.deploy(UserRolesAuthority, [RolesUpdater.address]);
    // await userRoles.setAuthority(UserRolesAuthority.address);
    console.log('MIGRATION SUCCESS!');

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