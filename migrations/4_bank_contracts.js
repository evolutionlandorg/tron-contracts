
const GringottsBank = artifacts.require("GringottsBank");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const MintAndBurnAuthority = artifacts.require('MintAndBurnAuthority');
const KTON = artifacts.require("KTON");

const conf = {
    from: "41ab4866d8833f1da588a87fecff71c00416732a9c",
    bank_unit_interest: 1000,
    bank_penalty_multiplier: 3,
    networkId: 200001,  // TRON shasta
    ringAmountLimit: 500000 * 10**18,
    bagCountLimit: 50,
    perMinAmount: 20 ** 10**18,
    weight10Percent: 100000,
    supervisor_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    dev_pool_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    contribution_incentive_address: 'TDWzV6W1L1uRcJzgg2uKa992nAReuDojfQ',
    // errorsparce
    uint_error_space: 0
}

module.exports = function(deployer, network, accounts) {
    if (network == "development")
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