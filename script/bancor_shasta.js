const TronWeb = require('tronweb')
var fs = require('fs');
var key = JSON.parse(fs.readFileSync('./script/key.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('./script/auto_generated_address_shasta.json', 'utf8'));

console.log(key);

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

    const bancorExchangeAddress = contracts["BancorExchange"].hex;
    const bancorConverterAddress = contracts["BancorConverter"].hex;
    const ringContractAddress = contracts["RING"].hex;
    const trxTokenAddress = contracts["TrxToken"].hex;

    let BacorExContract = await tronWeb.contract().at(bancorExchangeAddress);
    // let BancorConverter = await tronWeb.contract().at(bancorConverterAddress);
    let RingContract = await tronWeb.contract().at(ringContractAddress);
    let TrxTokenConverter = await tronWeb.contract().at(trxTokenAddress);

    // let myRingBalance = await RingContract.balanceOf(myAddress).call();
    // console.log("my ring balance: ", myRingBalance.toString());

    // let mytrx = await tronWeb.trx.getBalance(myAddress);
    // console.log("my trx balance: ", mytrx.toString());

    // let bconverBalance = await TrxTokenConverter.balanceOf(bancorConverterAddress).call();
    // console.log("bconvert trxtoken: ", bconverBalance.toString());

    // await RingContract.approve(bancorExchangeAddress,'996269672863996501787244').send({
    //        feeLimit:1000000000,
    //        callValue:0,
    //        shouldPollResponse:true
    //     });

    // let allownance = await RingContract.allowance(myAddress,bancorExchangeAddress).call();
    // console.log("allownance to bancorEx: ", allownance.toString());

    // let buyRingamount = await BacorExContract.buyRING(1).send({
    //     feeLimit:1000000000,
    //     callValue:10000000,
    //     shouldPollResponse:true
    // });
    // console.log("buyRingamount: ", buyRingamount.toString());

    // myRingBalance = await RingContract.balanceOf(myAddress).call();
    // console.log("my ring current balance: ", myRingBalance.toString());

    // bconverBalance = await TrxTokenConverter.balanceOf(bancorConverterAddress).call();
    // console.log("bconvert current trxtoken: ", bconverBalance.toString());

    // mytrx = await tronWeb.trx.getBalance(myAddress);
    // console.log("my trx current balance: ", mytrx.toString());


    await BacorExContract.sellRING('994040104691599927440539',1).send({
        feeLimit:1000000000,
        callValue:0,
        shouldPollResponse:true
    });

    myRingBalance = await RingContract.balanceOf(myAddress).call();
    console.log("my ring current balance: ", myRingBalance.toString());

    bconverBalance = await TrxTokenConverter.balanceOf(bancorConverterAddress).call();
    console.log("bconvert current trxtoken: ", bconverBalance.toString());

    mytrx = await tronWeb.trx.getBalance(myAddress);
    console.log("my trx current balance: ", mytrx.toString());


    // await BacorExContract.setQuickBuyPath(['415794ce7ae85efe01ba94fee10ddefe1d48a96ae6','4174ca9d500f00601b8e1db69734c05e04b7b67be9','4174ca9d500f00601b8e1db69734c05e04b7b67be9'])
    //     .send({
    //         feeLimit:1000000000,
    //         callValue:0,
    //         shouldPollResponse:true
    //     });
    //
    // await BacorExContract.setQuickSellPath(['4174ca9d500f00601b8e1db69734c05e04b7b67be9','4174ca9d500f00601b8e1db69734c05e04b7b67be9','415794ce7ae85efe01ba94fee10ddefe1d48a96ae6'])
    //     .send({
    //         feeLimit:1000000000,
    //         callValue:0,
    //         shouldPollResponse:true
    //     });

    // let quickSellPath = await BacorExContract['quickSellPath'](2).call();
    // console.log(quickSellPath);
    //
    // let owner = await RingContract.owner().call();
    // let newOwner = await RingContract.newOwner().call();
    //
    // console.log("owner: ",owner, ",newOwner: ", newOwner);
};

app();