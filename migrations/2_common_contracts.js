const SettingIds = artifacts.require("SettingIds");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");
const RINGAuthority = artifacts.require("RINGAuthority");
const TakeBack = artifacts.require('TakeBack');

const conf = {
    ringOwner : "TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ",
    supervisor_address: '41536DeaCEdC6E972822b9e78571786B5a6dd10c8A',
    networkId: 200000  // TRON mainet
};

let ring,kton,settingIds,settingsRegistry;

module.exports = function(deployer, network, accounts) {
    if (network == "shasta")
    {
        deployer.then(async () => {
            // await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log("=======start to deploy some base contracts===========\n");
    await deployer.deploy(SettingIds);
    await deployer.deploy(SettingsRegistry);
    settingIds = await SettingIds.deployed();
    settingsRegistry = await SettingsRegistry.deployed();

    await deployer.deploy(RING);
    await deployer.deploy(KTON);

    ring = await RING.deployed();
    kton = await KTON.deployed();

    let ring_settings = await settingIds.CONTRACT_RING_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(ring_settings, ring.address);

    let kton_settings = await settingIds.CONTRACT_KTON_ERC20_TOKEN.call();
    await settingsRegistry.setAddressProperty(kton_settings, kton.address);

    await deployer.deploy(RINGAuthority, conf.ringOwner);
    let ringAuthority = await RINGAuthority.deployed();
    await ring.setAuthority(ringAuthority.address);

    await deployer.deploy(TakeBack, ring.address, conf.supervisor_address, conf.networkId);

    console.log("=======end to deploy some base contracts===========\n");
    
}