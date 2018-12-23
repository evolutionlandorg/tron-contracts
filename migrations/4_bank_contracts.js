
const GringottsBank = artifacts.require("GringottsBank");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const MintAndBurnAuthority = artifacts.require('MintAndBurnAuthority');
const KTON = artifacts.require("KTON");

const conf = {
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3
}

module.exports = function(deployer, network, accounts) {
    if (network == "shasta")
    {
        deployer.then(async () => {
            await developmentDeploy(deployer, network, accounts);
        });
    }
};

async function developmentDeploy(deployer, network, accounts) {


    let settingsRegistry = await SettingsRegistry.deployed();
    let kton = await KTON.deployed();

    await deployer.deploy(GringottsBank, settingsRegistry.address);

    let bank = await GringottsBank.deployed();

    let bank_unit_interest = await bank.UINT_BANK_UNIT_INTEREST.call();
    await settingsRegistry.setUintProperty(bank_unit_interest, conf.bank_unit_interest);

    let bank_penalty_multiplier = await bank.UINT_BANK_PENALTY_MULTIPLIER.call();
    await settingsRegistry.setUintProperty(bank_penalty_multiplier, conf.bank_penalty_multiplier);


    await deployer.deploy(MintAndBurnAuthority, bank.address);
    let mintAndBurnAuthority = await MintAndBurnAuthority.deployed();
    await kton.setAuthority(mintAndBurnAuthority.address);
    
    
}