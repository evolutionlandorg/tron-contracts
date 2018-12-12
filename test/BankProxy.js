const Proxy = artifacts.require("OwnedUpgradeabilityProxy");
const GringottsBank = artifacts.require("GringottsBank");
const SettingsRegistry = artifacts.require("SettingsRegistry");

contract('TrxToken', accounts => {
    it('Testing the proxy initialization', async () => {
        let settingsRegistry = await tronWeb.contract().new(SettingsRegistry);
        let bankProxy = await tronWeb.contract().new(Proxy);
        let bankImp = await tronWeb.contract().new(GringottsBank);
        await bankProxy.upgradeTo(bankImp.address).send({
            shouldPollResponse:true
        });

        let bank = await tronWeb.contract(GringottsBank.abi, bankProxy.address);

        let result = await bank.initializeContract(settingsRegistry.address).send({
            shouldPollResponse:true
        });

        console.log(result);

        console.log(bank.depositCount);

        let registry = await bank.registry().call();
        console.log(registry);
        assert.equal(registry, settingsRegistry.address);
    
    });
});
