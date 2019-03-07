
const InterstellarEncoderV3 = artifacts.require("InterstellarEncoderV3");

module.exports = function(deployer, network) {
    if (network == 'shasta') {
        deployer.then(async() => {
            await shastaEncoderUpdate(deployer);
        });
    }

}

async function shastaEncoderUpdate(deployer) {
    await deployer.deploy(InterstellarEncoderV3);
}