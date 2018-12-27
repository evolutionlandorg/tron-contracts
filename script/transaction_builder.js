const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'https://api.shasta.trongrid.io'; // Full node http endpoint
const solidityNode = 'https://api.shasta.trongrid.io'; // Solidity node http endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Contract events http endpoint

const privateKey = key.privateKey;
const myAddress = key.address;
const myAddressHex = key.hex;

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

    let ring = await tronWeb.contract().at(ringAddress);



    // await ring.transfer(bankAddress, "1000000000000000000", "0x1")
    //     .send({
    //         feeLimit:1000000000,
    //         callValue: 1000,
    //         shouldPollResponse:true
    //     });
    const args = [bankAddress, "1000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000001"];
    const types = ['address','uint256','bytes'];
    const parameters = args.map((value, index) => ({
        type: types[index],
        value
    }));

    // console.log(args);
    // console.log(parameters);

    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        ringAddress,
        'transfer(address,uint256,bytes)',
        1000000000, // options.feeLimit,
        1111,          // options.callValue,
        parameters,
        myAddressHex
    );

    if (!transaction.result || !transaction.result.result) {
        console.log(JSON.stringify(transaction, null, 4));
    }

    // If privateKey is false, this won't be signed here. We assume sign functionality will be replaced.
    const signedTransaction = await tronWeb.trx.sign(transaction.transaction, privateKey);

    if (!signedTransaction.signature) {
        if (!privateKey)
            return console.log('Transaction was not signed properly');
        
        console.log('Invalid private key provided');
    }

    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);

    console.log(JSON.stringify(broadcast, null, 2));

    // if (!broadcast.result)
    //     console.log('Unknown error: ' + JSON.stringify(broadcast, null, 2));

    // console.log(transaction.transaction.raw_data.contract);
    // console.log(transaction.transaction.raw_data.contract[0].parameter.value);

    // fallback function does not work.
    // await tronWeb.transactionBuilder.sendTrx(trxTokenAddress, 1000, myAddress);
    
    // let value = await trxTokenContract.balanceOf(myAddress).call();

    // console.log(value.toNumber());
}

app();