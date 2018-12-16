const TrxToken = artifacts.require("TrxToken");
const FallbackTest = artifacts.require("FallbackTest");

module.exports = function(deployer, network, accounts) {

    console.log("deployer: ", deployer,", network: ", network, ", accounts: ",accounts);
    if (network == "shasta")
    {
        deployer.then(async () => {
            // await shastaDeploy(deployer, network, accounts);
        });
    }
};

async function shastaDeploy(deployer, network, accounts) {

    await deployer.deploy(TrxToken);

    await deployer.deploy(FallbackTest, TrxToken.address);
}
