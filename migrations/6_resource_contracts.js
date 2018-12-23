const SettingIds = artifacts.require("SettingIds");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const GOLD = artifacts.require("GOLD");
const FIRE = artifacts.require("FIRE");
const HHO = artifacts.require("HHO");
const SIOO = artifacts.require("SIOO");
const WOOD = artifacts.require("WOOD");

let settingIds,settingsRegistry;

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
    settingIds = await SettingIds.deployed();
    settingsRegistry = await SettingsRegistry.deployed();

    await deployer.deploy([GOLD,FIRE,HHO,SIOO,WOOD]);

    let gold = await GOLD.deployed();
    let fire = await FIRE.deployed();
    let wood = await WOOD.deployed();
    let water = await HHO.deployed();
    let soil = await SIOO.deployed();

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

    console.log("=======end to deploy some base contracts===========\n");
    
}