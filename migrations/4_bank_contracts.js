// const TronWeb = require('tronweb')

// const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
// const fullNode = new HttpProvider('http://127.0.0.1:8090'); // Full node http endpoint
// const solidityNode = new HttpProvider('http://127.0.0.1:8091'); // Solidity node http endpoint
// const eventServer = 'http://127.0.0.1:8092'; // Contract events http endpoint

// const privateKey = '163ef951a884410357f40646069f68d084576f4e10786f74c373643f44ebdaaa';

// const tronWeb = new TronWeb(
//     fullNode,
//     solidityNode,
//     eventServer,
//     privateKey
// );


const LocationCoder = artifacts.require("LocationCoder");
const TokenLocation = artifacts.require("TokenLocation.sol");
const InterstellarEncoder = artifacts.require("InterstellarEncoderV2");
const GringottsBank = artifacts.require("GringottsBank");
const SettingsRegistry = artifacts.require("SettingsRegistry");
const RING = artifacts.require("RING");
const KTON = artifacts.require("KTON");

const DeployAndTest = artifacts.require('DeployAndTest');

const SettingIds = artifacts.require('SettingIds');


const IDSettingIds = artifacts.require('IDSettingIds');
const MintAndBurnAuthority = artifacts.require('MintAndBurnAuthority');
const DividendPool = artifacts.require('DividendPool');
const FrozenDividend = artifacts.require('FrozenDividend');
const RolesUpdater = artifacts.require("RolesUpdater");
const UserRoles = artifacts.require("UserRoles");
const UserRolesAuthority = artifacts.require("UserRolesAuthority");
const RevenuePool = artifacts.require('RevenuePool');
const UserPoints = artifacts.require('UserPoints');
const UserPointsAuthority = artifacts.require('UserPointsAuthority');
const PointsRewardPool = artifacts.require('PointsRewardPool');
const TakeBack = artifacts.require('TakeBack');

const BancorConverter = artifacts.require('BancorConverter');
const BancorFormula = artifacts.require('BancorFormula');
const TrxToken = artifacts.require('TrxToken');
const ContractFeatures = artifacts.require('ContractFeatures');
const WhiteList = artifacts.require('Whitelist');
const BancorNetwork = artifacts.require('BancorNetwork');
const BancorExchange = artifacts.require('BancorExchange');
const ContractIds = artifacts.require('ContractIds');
const FeatureIds = artifacts.require('FeatureIds');

const BancorExchangeAuthority = artifacts.require('BancorExchangeAuthority');

const conf = {
    from: "TV9X71qbEFBAUSKrdq3tetKz2hwHnoDvVe",
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

    ////////////    Bank Contracts   ///////////
    console.log("\n========================\n" +
            "BANK MIGRATION STARTS!!" +
            "\n========================\n\n");
    await deployer.deploy(GringottsBank, settingsRegistry.address);

    let bank = await GringottsBank.deployed();

    let bank_unit_interest = await bank.UINT_BANK_UNIT_INTEREST.call();
    await settingsRegistry.setUintProperty(bank_unit_interest, conf.bank_unit_interest);

    let bank_penalty_multiplier = await bank.UINT_BANK_PENALTY_MULTIPLIER.call();
    await settingsRegistry.setUintProperty(bank_penalty_multiplier, conf.bank_penalty_multiplier);
    console.log("REGISTRATION DONE! ");
    

    // // kton.setAuthority will be done in market's migration
    // let interest = await bankProxy.computeInterest.call(10000, 12, conf.bank_unit_interest);
    // console.log("Current annual interest for 10000 RING is: ... " + interest + " KTON");
    
    
}