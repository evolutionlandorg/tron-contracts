var Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network, accounts) {
  console.log(network);
  if (network == "shasta")
  {
    deployer.deploy(Migrations);
  }
};