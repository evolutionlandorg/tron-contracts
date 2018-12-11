
const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");

const SettingIds = artifacts.require('SettingIds');

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