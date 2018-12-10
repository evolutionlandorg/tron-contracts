/* global artifacts, contract, it, assert, web3 */
/* eslint-disable prefer-reflect */

const TrxToken = artifacts.require('TrxToken.sol');
const utils = require('./helpers/Utils');

contract('TrxToken', accounts => {
    it('verifies the token name after construction', async () => {
        let token = await tronWeb.contract().new(TrxToken);

        let name = await token.name().call();
        assert.equal(name, 'Trx Token');
    });

    it('verifies the token symbol after construction', async () => {
        let token = await TrxToken.deployed();
        let symbol = await token.call('symbol');
        assert.equal(symbol, 'TRX');
    });

    it('verifies the balance and supply after a deposit through the deposit function', async () => {
        let token = await TrxToken.deployed();
        console.log(token.deposit);
        await token.deposit({ callValue: 1000 });
        // truffle format
        // let balance = await token.balanceOf.call(accounts[0]);

        let balance = await token.call('balanceOf', accounts[0]);
        assert.equal(balance.toNumber(), 1000);
        let supply = await token.call('totalSupply');
        assert.equal(supply.toNumber(), 1000);
    });

    it('another example: verifies the balance and supply after a deposit through the deposit function', async () => {
        let token = await tronWeb.contract().new(TrxToken);
        console.log(token.deposit);
        await token.deposit().send({
            callValue: 1000 
        });
        let balance = await token.balanceOf(accounts[0]).call();
        console.log(balance);
        assert.equal(balance.toNumber(), 1000);
        let supply = await token.totalSupply().call();
        assert.equal(supply.toNumber(), 1000);
    });

    // it('verifies the balance and supply after a deposit through the fallback function', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.send(1000);
    //     let balance = await token.balanceOf.call(accounts[0]);
    //     assert.equal(balance, 1000);
    //     let supply = await token.totalSupply.call();
    //     assert.equal(supply, 1000);
    // });

    // it('verifies the balance and supply after a withdrawal', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });
    //     await token.withdraw(20);
    //     let tokenBalance = await token.balanceOf.call(accounts[0]);
    //     assert.equal(tokenBalance, 80);
    //     let supply = await token.totalSupply.call();
    //     assert.equal(supply, 80);
    // });

    // it('verifies the ether balance after a withdrawal', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });
    //     let prevBalance = tronWeb.trx.getBalance(accounts[0]);
    //     let res = await token.withdraw(20);
    //     let transaction = tronWeb.trx.getTransaction(res.tx);
    //     let newBalance = tronWeb.trx.getBalance(accounts[0]);
    //     prevBalance = web3.toBigNumber(prevBalance);
    //     newBalance = web3.toBigNumber(newBalance);
    //     let transactionCost = transaction.gasPrice.times(res.receipt.cumulativeGasUsed);
    //     assert.equal(newBalance.toString(), prevBalance.minus(transactionCost).plus(20).toString());
    // });

    // it('verifies the ether balance after a withdrawal to target account', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });
    //     let prevBalance = tronWeb.trx.getBalance(accounts[1]);
    //     await token.withdrawTo(accounts[1], 20);
    //     let newBalance = tronWeb.trx.getBalance(accounts[1]);
    //     prevBalance = web3.toBigNumber(prevBalance);
    //     newBalance = web3.toBigNumber(newBalance);
    //     assert.equal(newBalance.toString(), prevBalance.plus(20).toString());
    // });

    // it('verifies the balances after a transfer', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });
    //     await token.transfer(accounts[1], 10);
    //     let balance;
    //     balance = await token.balanceOf.call(accounts[0]);
    //     assert.equal(balance, 90);
    //     balance = await token.balanceOf.call(accounts[1]);
    //     assert.equal(balance, 10);
    // });

    // it('should throw when attempting to transfer to the token address', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });

    //     try {
    //         await token.transfer(token.address, 10);
    //         assert(false, "didn't throw");
    //     }
    //     catch (error) {
    //         return utils.ensureException(error);
    //     }
    // });

    // it('should throw when attempting to transferFrom to the token address', async () => {
    //     let token = await TrxToken.deployed();
    //     await token.deposit({ value: 100 });
    //     await token.approve(accounts[1], 50);

    //     try {
    //         await token.transferFrom(accounts[0], token.address, 10, { from: accounts[1] });
    //         assert(false, "didn't throw");
    //     }
    //     catch (error) {
    //         return utils.ensureException(error);
    //     }
    // });
});
