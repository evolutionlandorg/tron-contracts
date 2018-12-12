const TronWeb = require('tronweb')

const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = 'http://127.0.0.1:8090'; // Full node http endpoint
const solidityNode = 'http://127.0.0.1:8091'; // Solidity node http endpoint
const eventServer = 'http://127.0.0.1:8092'; // Contract events http endpoint

const privateKey = '0a1b00ce3c9c93e5830f96df7f699e3ac854ab4a7c7ccd1771e695c40433772e';

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

    let BacorExContract = await tronWeb.contract().at("4104413be625a8685b3f94cb6686f9adf371f203dc");

    await BacorExContract.setQuickBuyPath(['415794ce7ae85efe01ba94fee10ddefe1d48a96ae6','4174ca9d500f00601b8e1db69734c05e04b7b67be9','4174ca9d500f00601b8e1db69734c05e04b7b67be9'])
        .send({
            feeLimit:1000000000,
            callValue:0,
            shouldPollResponse:true
        });

    let quickBuyPath = await BacorExContract.quickBuyPath().call();

    // console.log;
}

app();