const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));
var jObjectOwnershipAuthority = JSON.parse(fs.readFileSync('./build/contracts/ObjectOwnershipAuthority.json', 'utf8'));
var jTokenLocationAuthority = JSON.parse(fs.readFileSync('./build/contracts/TokenLocationAuthority.json', 'utf8'));


// console.log(key);
// console.log("ObjectOwnershipAuthority abi: ", jObjectOwnershipAuthority.abi);
// console.log("TokenLocationAuthority abi: ", jTokenLocationAuthority.abi);

// HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;

console.log("myaddress: ", myAddress);

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

const app = async () => {
    tronWeb.setDefaultBlock('latest');

    const nodes = await tronWeb.isConnected();
    const connected = !Object.entries(nodes).map(([name, connected]) => {
        if (!connected)
            console.error(`Error: ${name} is not connected`);

        return connected;
    }).includes(false);

    if (!connected)
        return;


    const settingidsAddress = contracts["SettingIds"].hex;
    const registrysAddress = contracts["SettingsRegistry"].hex;
    const interstellarEncoderAddr = contracts["InterstellarEncoder"].hex;
    const objectOwnershipAddress = contracts["ObjectOwnership"].hex;
    const tokenLocationIdAddress = contracts["TokenLocation"].hex;
    const tokenLocationAuthAddress = contracts["TokenLocationAuthority"].hex;
    const landBaseAuthorityAddr = contracts["LandBaseAuthority"].hex;

    const objectOwnershipAuthorityAddr = contracts["ObjectOwnershipAuthority"].hex;

    const landBaseAddressTrx = contracts["LandBase"].hex;
    let landBaseAddressEth = '0x' + landBaseAddressTrx.substring(2);
    console.log("landBaseAddress: ",landBaseAddressEth);

    let SettingIDs = await tronWeb.contract().at(settingidsAddress);
    let SettingRegistry = await tronWeb.contract().at(registrysAddress);
    let ObjectOwnership = await tronWeb.contract().at(objectOwnershipAddress);
    let InterstellarEncoder = await tronWeb.contract().at(interstellarEncoderAddr);
    //
    // let ObjectOwnershipAuthority= await tronWeb.contract().new({
    //     abi:jObjectOwnershipAuthority.abi,
    //     bytecode:jObjectOwnershipAuthority.bytecode,
    //     feeLimit:1000000000,
    //     callValue:0,
    //     userFeePercentage:100,
    //     parameters:[[landBaseAddressEth]]
    // });
    // console.log("deployed ObjectOwnershipAuthority: ", ObjectOwnershipAuthority.address);
    //
    // let TokenLocationAuthority = await tronWeb.contract().new({
    //     abi:jTokenLocationAuthority.abi,
    //     bytecode:jTokenLocationAuthority.bytecode,
    //     feeLimit:1000000000,
    //     callValue:0,
    //     userFeePercentage:100,
    //     parameters:[[landBaseAddressEth]]
    // });
    // console.log("deployed TokenLocationAuthority: ", TokenLocationAuthority.address);
    //
    let interstellarEncoderId = await SettingIDs.CONTRACT_INTERSTELLAR_ENCODER().call();
    console.log("interstellarEncoderId in settingids: ", interstellarEncoderId);
    await SettingRegistry.setAddressProperty(interstellarEncoderId, interstellarEncoderAddr).send({
           feeLimit:1000000000,
           callValue:0,
           shouldPollResponse:true
    });
    //
    //
    let landBaseId = await SettingIDs.CONTRACT_LAND_BASE().call();
    let objectOwnershipId = await SettingIDs.CONTRACT_OBJECT_OWNERSHIP().call();
    let tokenLocationId = await SettingIDs.CONTRACT_TOKEN_LOCATION().call();
    await SettingRegistry.setAddressProperty(landBaseId,landBaseAddressTrx).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await SettingRegistry.setAddressProperty(objectOwnershipId,objectOwnershipAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    await SettingRegistry.setAddressProperty(tokenLocationId,tokenLocationIdAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    await ObjectOwnership.setAuthority(objectOwnershipAuthorityAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });



    // let ret = await InterstellarEncoder.contractId2Address(1).call();
    // console.log("objectOwnershipAddress: ",objectOwnershipAddress);
    // console.log("index 1 in InterstellarEncoder : ",ret);

    await InterstellarEncoder.registerNewTokenContract(objectOwnershipAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    console.log("test1");

    await InterstellarEncoder.registerNewObjectClass(landBaseAddressTrx,1).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });
    console.log("test2");
    //
    // console.log("TokenLocationAuthority address: ", TokenLocationAuthority.address);
    let tokenLocation = await tronWeb.contract().at(tokenLocationIdAddress);
    await tokenLocation.setAuthority(tokenLocationAuthAddress).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    let landBase = await tronWeb.contract().at(landBaseAddressTrx);
    await landBase.setAuthority(landBaseAuthorityAddr).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });


    console.log("deploy finish");
};

app();