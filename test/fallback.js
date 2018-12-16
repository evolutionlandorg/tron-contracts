const TrxToken = artifacts.require("TrxToken");
const FallbackTest = artifacts.require("FallbackTest");

contract('FallbackTest', accounts => {
    it('Contract deployment', async () => {
        let trxToken = await tronWeb.contract().new(TrxToken);
        let fallbackTest = await tronWeb.contract().new(FallbackTest);

        let result = await fallbackTest.deposit(1000000).send({
            feeLimit:1000000000,
            callValue: 1000000,
            shouldPollResponse:true
        });

        let value = await fallbackTest.balance().call();
        console.log(value);
        // assert.equal(registry, settingsRegistry.address);
    
    });
});