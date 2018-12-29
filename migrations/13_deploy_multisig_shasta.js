const MultiSigWallet = artifacts.require("MultiSigWallet");
const LocationCoder = artifacts.require("LocationCoder");

module.exports = function(deployer, network, accounts) {

    console.log("deployer: ", deployer,", network: ", network, ", accounts: ",accounts);
    if (network == "shasta")
    {
        deployer.then(async () => {
            await shastaDeploy(deployer, network, accounts);
        });
    }
};

async function shastaDeploy(deployer, network, accounts) {
    console.log(accounts);

    const myAccount = "41d25da92f48c771e1f62e9b62b514cdd05fef9abb"; // 41D25DA92F48C771E1F62E9B62B514CDD05FEF9ABB
    const account2 = "41ab4866d8833f1da588a87fecff71c00416732a9c";  // 41AB4866D8833F1DA588A87FECFF71C00416732A9C
    // await deployer.deploy(LocationCoder);
    await deployer.deploy(MultiSigWallet, ['0x' + myAccount.substr(2, 40), '0x' + account2.substr(2, 40)], 2);
}
