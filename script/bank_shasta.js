const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

//const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;

console.log(myAddress);

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

    const ringAddress = contracts["RING"].hex;
    const bankAddress = contracts["GringottsBank"].hex;

    console.log(bankAddress);

    let ringContract = await tronWeb.contract().at(ringAddress);

    let value = await ringContract.balanceOf(myAddress).call();

    console.log("my ring balance:", value.toString());

    await ringContract['transfer(address,uint256,bytes)'](bankAddress,"1000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000001")
        .send({
            feeLimit:1000000000,
            callValue: 0,
            shouldPollResponse:true
        });
    // await ringContract.transfer('41c29b9bfba00ec2a2fb0b9d881c7924b89299cbf4', "1000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000001")
    //     .send({
    //         feeLimit:1000000000,
    //         callValue: 0,
    //         shouldPollResponse:true
    //     });

    // let Bytes = tronWeb.utils.code.hexStr2byteArray;
    // let ABI = tronWeb.utils.abi;
    // let msg = ABI.encodeParams(['address', 'uint256','bytes'], ['41c29b9bfba00ec2a2fb0b9d881c7924b89299cbf4', "1000000000000000000", Bytes("0000000000000000000000000000000000000000000000000000000000000001")]);
    // console.log(msg);
    
    // let sign = await tronWeb.trx.signTransaction(msg, privateKey);
    // console.log(sign);
    // await tronWeb.trx.sendRawTransaction(sign);

    // fallback function does not work.
    // await tronWeb.transactionBuilder.sendTrx(trxTokenAddress, 1000, myAddress);
    
    // let value = await trxTokenContract.balanceOf(myAddress).call();

    // console.log(value.toNumber());
}

app();