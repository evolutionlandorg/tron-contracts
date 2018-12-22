const InterstellarEncoder = artifacts.require("InterstellarEncoder");
const SettingIds = artifacts.require("SettingIds");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");
const GOLD = artifacts.require("GOLD");
const FIRE = artifacts.require("FIRE");
const HHO = artifacts.require("HHO");
const SIOO = artifacts.require("SIOO");
const WOOD = artifacts.require("WOOD");
const RINGAuthority = artifacts.require("RINGAuthority");

const conf = {
    ringOwner : "41ab4866d8833f1da588a87fecff71c00416732a9c"
};

let ring,kton,settingIds,settingsRegistry,interstellarEncoder,interstellarEncoderId;

module.exports = function(deployer, network, accounts) {
    if (network == "development")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log("=======start to deploy some base contracts===========\n");

    await deployer.deploy(InterstellarEncoder);
    await deployer.deploy(SettingIds);
    await deployer.deploy(SettingsRegistry);
    settingIds = await SettingIds.deployed();
    settingsRegistry = await SettingsRegistry.deployed();

    interstellarEncoder = await InterstellarEncoder.deployed();
    interstellarEncoderId = await settingIds.CONTRACT_INTERSTELLAR_ENCODER.call();
    await settingsRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoder.address);

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

    console.log("=======end to deploy some base contracts===========\n");
    
}