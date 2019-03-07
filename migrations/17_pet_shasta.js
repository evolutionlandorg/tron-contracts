var fs = require('fs');
var contracts = JSON.parse(fs.readFileSync('../script/auto_generated_address_shasta.json', 'utf8'));

const InterstellarEncoderV3 = artifacts.require("InterstellarEncoderV3");
const ERC721AdaptorAuthority = artifacts.require("ERC721AdaptorAuthority");
const ERC721Bridge = artifacts.require("ERC721Bridge");
const ERC721Adaptor = artifacts.require("ERC721Adaptor");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const ObjectOwnershipAuthorityV2 = artifacts.require("ObjectOwnershipAuthorityV2");
const PetBase = artifacts.require("PetBase");
const KittyCore = artifacts.require("KittyCore");
const ApostleBaseAuthority = artifacts.require("ApostleBaseAuthority");
const ERC721BridgeAuthority = artifacts.require("ERC721BridgeAuthority");
const ApostleBase = artifacts.require("ApostleBase");

const conf = {
    registry_address: contracts["SettingsRegistry"].hex,
    objectOwnership_address: contracts["ObjectOwnership"].hex,
    landBase_address: contracts["LandBase"].hex,
    apostleBase_address: contracts["ApostleBase"].hex,
    tokenUse_address: contracts["TokenUse"].hex,
    landObject_class: 1,
    apostleObject_class: 2,
    ck_producerId: 256,
    objectOwnership_id: 1,
    ck_ownership_id: 2,
    pet_objectClass: 3,
    pet_max_number: 1
}

module.exports = function(deployer, network, accounts) {
    if (network == 'shasta') {
        deployer.then(async() => {
            // await shastaPetDeploy(deployer);
        });
    }

}


async function shastaPetDeploy(deployer) {

    // DEPLOY
    await deployer.deploy(KittyCore);
    let kittyCore = await KittyCore.deployed();

    await deployer.deploy(InterstellarEncoderV3);
    await deployer.deploy(ERC721Bridge, conf.registry_address);
    await deployer.deploy(ERC721Adaptor, conf.registry_address, kittyCore.address, conf.ck_producerId);

    let erc721Bridge = await ERC721Bridge.deployed();
    let erc721Bridge_address = '0x' + erc721Bridge.address.substring(2);
    let apostleBase_address = '0x' + conf.apostleBase_address.substring(2);
    let landBase_address = '0x' + conf.landBase_address.substring(2);
    let tokenUse_address = '0x' + conf.tokenUse_address.substring(2);

    await deployer.deploy(ObjectOwnershipAuthorityV2, [erc721Bridge_address, apostleBase_address, landBase_address]);
    await deployer.deploy(ERC721AdaptorAuthority, [erc721Bridge_address]);

    await deployer.deploy(PetBase, conf.registry_address, conf.pet_max_number);
    let petBase = await PetBase.deployed();
    let petBase_address = '0x' +  petBase.address.substring(2);
    await deployer.deploy(ApostleBaseAuthority, [tokenUse_address, petBase_address]);

    await deployer.deploy(ERC721BridgeAuthority, [petBase_address]);

    console.log("DEPLOY DONE!");

    // // register in registry
    // let registry = await SettingsRegistry.at(conf.registry_address);
    // console.log("Registry address: ", registry.address);
    // let bridgeId = await erc721Bridge.CONTRACT_ERC721_BRIDGE.call();
    // await registry.setAddressProperty(bridgeId, erc721Bridge.address);
    //
    // let encoderId = await erc721Bridge.CONTRACT_INTERSTELLAR_ENCODER.call();
    // let encoder = await InterstellarEncoderV3.deployed();
    // await registry.setAddressProperty(encoderId, encoder.address);
    //
    // let petBaseId = await petBase.CONTRACT_PET_BASE.call();
    // await registry.setAddressProperty(petBaseId, petBase.address);
    //
    // console.log("REGISTER IN REGISTRY DONE");
    //
    // // setAuthority
    // let objectOwnership = await ObjectOwnership.at(conf.objectOwnership_address);
    // let objectOwnershipAuthority = await ObjectOwnershipAuthorityV2.deployed();
    // await objectOwnership.setAuthority(objectOwnershipAuthority.address);
    //
    // let erc721Adaptor = await ERC721Adaptor.deployed();
    // let erc721AdaptorAuthority = await ERC721AdaptorAuthority.deployed();
    // await erc721Adaptor.setAuthority(erc721AdaptorAuthority.address);
    //
    // let erc721BridgeAuthority = await ERC721BridgeAuthority.deployed();
    // await erc721Bridge.setAuthority(erc721BridgeAuthority.address);
    //
    // let apostleBaseAuthority = await ApostleBaseAuthority.deployed();
    // let apostleBase = await ApostleBase.at(conf.apostleBase_address);
    // await apostleBase.setAuthority(apostleBaseAuthority.address);
    //
    // console.log("AUTHORITY DONE!");
    //
    // await encoder.registerNewOwnershipContract(conf.objectOwnership_address, conf.objectOwnership_id);
    // await encoder.registerNewOwnershipContract(conf.kittyCore_address, conf.ck_ownership_id);
    //
    // console.log("ENCODER REGISTER TOKEN DONE!");
    //
    // await encoder.registerNewObjectClass(conf.landBase_address,conf.landObject_class);
    // await encoder.registerNewObjectClass(conf.apostleBase_address, conf.apostleObject_class);
    // await encoder.registerNewObjectClass(petBase.address, conf.pet_objectClass);
    //
    // console.log("ENCODER REGISTER OBJECT CLASS DONE!");
    //
    // await erc721Bridge.registerAdaptor(kittyCore.address, erc721Adaptor.address);
    //
    // console.log("SUCCESS!")


}
