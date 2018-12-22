
const InterstellarEncoder = artifacts.require("InterstellarEncoder");
const LandBase = artifacts.require("LandBase");
const TokenLocation = artifacts.require("TokenLocation");
const ObjectOwnership = artifacts.require("ObjectOwnership");
const ObjectOwnershipAuthority = artifacts.require("ObjectOwnershipAuthority");
const TokenLocationAuthority = artifacts.require("TokenLocationAuthority");
const SettingsRegistry = artifacts.require('SettingsRegistry');
const SettingIds = artifacts.require("SettingIds");

module.exports = function(deployer, network, accounts) {
    if (network == "development")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {
    console.log("=======start to deploy land contracts===========\n");

    let settingsRegistry = await SettingsRegistry.deployed();
    let interstellarEncoder = await InterstellarEncoder.deployed();

    let setRegistryAddress = settingsRegistry.address;
    await deployer.deploy(LandBase, setRegistryAddress);
    await deployer.deploy(ObjectOwnership,setRegistryAddress);
    await deployer.deploy(TokenLocation);

    let landBase = await LandBase.deployed();
    let landBaseAddr = landBase.address;
    let landBaseEthAddr = '0x' + landBaseAddr.substring(2);
    await deployer.deploy(ObjectOwnershipAuthority, [landBaseEthAddr]);
    await deployer.deploy(TokenLocationAuthority, [landBaseEthAddr]);

    //
    // // register in registry and initialization
    let settingIds = await SettingIds.deployed();
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
    await interstellarEncoder.registerNewObjectClass(landBaseAddr, 1);


    console.log("=======end to deploy land contracts===========\n");

}