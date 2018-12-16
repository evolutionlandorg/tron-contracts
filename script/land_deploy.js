const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));
var jObjectOwnershipAuthority = JSON.parse(fs.readFileSync('./build/contracts/ObjectOwnershipAuthority.json', 'utf8'));
var jTokenLocationAuthority = JSON.parse(fs.readFileSync('./build/contracts/TokenLocationAuthority.json', 'utf8'));


console.log(key);
console.log("ObjectOwnershipAuthority abi: ", jObjectOwnershipAuthority.abi);
console.log("TokenLocationAuthority abi: ", jTokenLocationAuthority.abi);

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

    // const settingidsAddress = contracts["SettingIds"].hex;
    // const registrysAddress = contracts["SettingsRegistry"].hex;
    const landBaseAddress = contracts["LandBase"].hex;
    console.log("landBaseAddress: ",landBaseAddress);


    let ObjectOwnershipAuthorit = await tronWeb.contract().new({
        abi:jObjectOwnershipAuthority.abi,
        bytecode:jObjectOwnershipAuthority.bytecode,
        feeLimit:1000000000,
        callValue:0,
        userFeePercentage:100,
        parameters:[['0x545b80c341af24b982dceeaa80151c118678fc3a']]
    });

    console.log("ObjectOwnershipAuthorit: ", ObjectOwnershipAuthorit.address);



};

app();