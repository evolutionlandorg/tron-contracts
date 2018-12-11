
const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");

const SettingIds = artifacts.require('SettingIds');

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
    console.log(network);
    console.log(deployer);
    console.log(accounts);

    // await deployer.deploy(LocationCoder);
    await deployer.deploy(SettingIds);
    await deployer.deploy(SettingsRegistry);

    let settingIds = await SettingIds.deployed();
    let settingsRegistry = await SettingsRegistry.deployed();

    ///////////   Token Contracts     ////////////////
    await deployer.deploy(RING);
    await deployer.deploy(KTON);

    let ring_settings = await settingIds.CONTRACT_RING_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(ring_settings, RING.address);

    let kton_settings = await settingIds.CONTRACT_KTON_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(kton_settings, KTON.address);
    
}