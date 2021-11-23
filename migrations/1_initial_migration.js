const Migrations = artifacts.require('Migrations')

module.exports = async function(deployer, networks, accounts) {
    // Deploy the smart contract on the blockchain
    await deployer.deploy(Migrations);
};
