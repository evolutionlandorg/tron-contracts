var fs = require('fs');
var contracts = JSON.parse(fs.readFileSync('../script/auto_generated_address_shasta.json', 'utf8'));

const InterstellarEncoder = artifacts.require('InterstellarEncoder');
const ApostleBase = artifacts.require('ApostleBase');
const ApostleSettingIds = artifacts.require('ApostleSettingIds');
const ApostleClockAuction = artifacts.require('ApostleClockAuction');
const SiringClockAuction = artifacts.require('SiringClockAuction');
const Gen0Apostle = artifacts.require('Gen0Apostle');
const SettingsRegistry = artifacts.require('SettingsRegistry');
const ObjectOwnershipAuthority = artifacts.require('ObjectOwnershipAuthority');
const ObjectOwnership = artifacts.require('ObjectOwnership');

const ApostleBaseAuthority = artifacts.require('ApostleBaseAuthority');
const ApostleClockAuctionAuthority = artifacts.require('ApostleClockAuctionAuthority');

// const GeneScience = artifacts.require('GeneScienceV3');

const conf = {
    registry_address: contracts["SettingsRegistry"].hex,
    objectOwnershipProxy_address: contracts["ObjectOwnership"].hex,
    landBaseProxy_address: contracts["LandBase"].hex,
    landObject_class: 1,
    apostleObject_class: 2,
    autoBirthFee: 500 * 10 ** 18,
    resourceNeededPerLevel: 5 * 10 ** 18,
    bidWaitingTime: 10 * 60,
    gen0Limit: 2000
};



module.exports = function(deployer, network, accounts) {

    console.log("registry_address: ", conf.registry_address);
    // console.log("deployer: ", deployer,", network: ", network, ", accounts: ",accounts);
    if (network == "shasta")
    {
        deployer.then(async () => {

            await shastaApostleDeploy(deployer, network, accounts);
        });
    }
};


async function shastaApostleDeploy(deployer, network, accounts){

    await deployer.deploy(InterstellarEncoder);
    await deployer.deploy(ApostleSettingIds);
    await deployer.deploy(ApostleBase,conf.registry_address);
    await deployer.deploy(ApostleClockAuction,conf.registry_address);
    await deployer.deploy(Gen0Apostle,conf.registry_address,conf.gen0Limit);
    await deployer.deploy(SiringClockAuction,conf.registry_address);

    let landBaseEthAddr = '0x' + conf.landBaseProxy_address.substring(2);
    let apostleBase = await ApostleBase.deployed();
    let apostleBaseAddr = apostleBase.address;
    let apostleBaseEthAddr = '0x' + apostleBaseAddr.substring(2);


    let gen0Apostle = await Gen0Apostle.deployed();
    let gen0ApostleAddr = gen0Apostle.address;
    let gen0ApostleEthAddr = '0x' + gen0ApostleAddr.substring(2);
    let siringClockAuction = await SiringClockAuction.deployed();
    let siringClockAuctionAddr = siringClockAuction.address;
    let siringClockAuctionEthAddr = '0x' + siringClockAuctionAddr.substring(2);

    let genOwner = await gen0Apostle.owner();
    await gen0Apostle.setOperator(genOwner);

    await deployer.deploy(TokenUse, conf.registry_address );
    let tokenUse = await TokenUse.deployed();
    let tokenUseAddr = tokenUse.address;
    let tokenUseETHAddr = '0x' + tokenUseAddr.substring(2);

    await deployer.deploy(ObjectOwnershipAuthority, [landBaseEthAddr, apostleBaseEthAddr]);
    await deployer.deploy(ApostleClockAuctionAuthority, [gen0ApostleEthAddr]);
    await deployer.deploy(ApostleBaseAuthority, [gen0ApostleEthAddr, siringClockAuctionEthAddr,tokenUseETHAddr]);

    // register in registry
    // let apostleSettingIds = await ApostleSettingIds.deployed();
    let apostleClockAuction = await ApostleClockAuction.deployed();
    // let registry = await SettingsRegistry.at(conf.registry_address);

    // let apostleBaseId = await apostleSettingIds.CONTRACT_APOSTLE_BASE.call();
    // await registry.setAddressProperty(apostleBaseId, apostleBaseAddr);
    //
    // let clockAuctionId = await apostleSettingIds.CONTRACT_APOSTLE_AUCTION.call();
    // await registry.setAddressProperty(clockAuctionId, apostleClockAuction.address);
    //
    // let siringAuctionId = await apostleSettingIds.CONTRACT_SIRING_AUCTION.call();
    // await registry.setAddressProperty(siringAuctionId, siringClockAuctionAddr);
    //
    // let birthFeeId = await apostleSettingIds.UINT_AUTOBIRTH_FEE.call();
    // await registry.setUintProperty(birthFeeId, conf.autoBirthFee);
    //
    // let mixTalentId = await apostleSettingIds.UINT_MIX_TALENT.call();
    // await registry.setUintProperty(mixTalentId, conf.resourceNeededPerLevel);
    //
    // let bidWaitingTimeId = await apostleSettingIds.UINT_APOSTLE_BID_WAITING_TIME.call();
    // await registry.setUintProperty(bidWaitingTimeId, conf.bidWaitingTime);


    // set authority
    // let objectOwnership = await ObjectOwnership.at(conf.objectOwnershipProxy_address);
    // let objectOwnershipAuthority = await ObjectOwnershipAuthority.deployed();
    // await objectOwnership.setAuthority(objectOwnershipAuthority.address);
    let apostleBaseAuthority = await ApostleBaseAuthority.deployed();
    await apostleBase.setAuthority(apostleBaseAuthority.address);

    let apostleClockAuctionAuthority = await ApostleClockAuctionAuthority.deployed();
    await apostleClockAuction.setAuthority(apostleClockAuctionAuthority.address);

    // register object contract address in interstellarEncoder
    let interstellarEncoder = await InterstellarEncoder.deployed();
    await interstellarEncoder.registerNewTokenContract(conf.objectOwnershipProxy_address);
    await interstellarEncoder.registerNewObjectClass(conf.landBaseProxy_address, conf.landObject_class);
    await interstellarEncoder.registerNewObjectClass(apostleBaseAddr, conf.apostleObject_class);

    await deployer.deploy(TokenUseAuthority, [landBaseEthAddr]);
    let tokenUseAuth = await TokenUseAuthority.deployed();
    await tokenUse.setAuthority(tokenUseAuth.address);

    let ms = new Date().getTime();
    let curS = parseInt(ms / 1000);
    await deployer.deploy(LandResource, conf.registry_address, curS);
    await deployer.deploy(LandResourceAuthority, [tokenUseETHAddr]);

    let landResource = await LandResource.deployed();
    let landResourceAuth = await LandResourceAuthority.deployed();
    await landResource.setAuthority(landResourceAuth.address);

    let landResourceAddr = landResource.address;
    await deployer.deploy(MintAndBurnAuthority, landResourceAddr);

    await deployer.deploy(GeneScience, conf.registry_address );


};
