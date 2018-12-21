pragma solidity ^0.4.23;
import './ERC20Token.sol';
import './interfaces/ITrxToken.sol';
import '../utility/Owned.sol';
import '../utility/TokenHolder.sol';

/**
    Trx tokenization contract

    'Owned' is specified here for readability reasons
*/
contract TrxToken is ITrxToken, Owned, ERC20Token, TokenHolder {
    // triggered when the total supply is increased
    event Issuance(uint256 _amount);
    // triggered when the total supply is decreased
    event Destruction(uint256 _amount);

    uint256 constant EXCHANGE_DECIMALS = 10**12;

    /**
        @dev constructor
    */
    constructor()
    public
    ERC20Token('Trx Token', 'TRX', 6) {
    }

    /**
        @dev deposit ether in the account
    */
    function deposit() public payable {
        uint amount = safeMul(msg.value, EXCHANGE_DECIMALS);
        balanceOf[msg.sender] = safeAdd(balanceOf[msg.sender], amount); // add the value to the account balance
        totalSupply = safeAdd(totalSupply, amount); // increase the total supply

        emit Issuance(amount);
        emit Transfer(this, msg.sender, amount);
    }

    /**
        @dev withdraw ether from the account

        @param _amount  amount of ether to withdraw
    */
    function withdraw(uint256 _amount) public {
        withdrawTo(msg.sender, _amount);
    }

    /**
        @dev withdraw ether from the account to a target account

        @param _to      account to receive the ether
        @param _amount  amount of ether to withdraw
    */
    function withdrawTo(address _to, uint256 _amount)
    public
    notThis(_to)
    {
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender], _amount); // deduct the amount from the account balance
        totalSupply = safeSub(totalSupply, _amount); // decrease the total supply
        uint amount = _amount / EXCHANGE_DECIMALS;
        _to.transfer(amount); // send the amount to the target account

        emit Transfer(msg.sender, this, _amount);
        emit Destruction(_amount);
    }

    // ERC20 standard method overrides with some extra protection

    /**
        @dev send coins
        throws on any error rather then return a false flag to minimize user errors

        @param _to      target address
        @param _value   transfer amount

        @return true if the transfer was successful, false if it wasn't
    */
    function transfer(address _to, uint256 _value)
    public
    notThis(_to)
    returns (bool success)
    {
        assert(super.transfer(_to, _value));
        return true;
    }

    /**
        @dev an account/contract attempts to get the coins
        throws on any error rather then return a false flag to minimize user errors

        @param _from    source address
        @param _to      target address
        @param _value   transfer amount

        @return true if the transfer was successful, false if it wasn't
    */
    function transferFrom(address _from, address _to, uint256 _value)
    public
    notThis(_to)
    returns (bool success)
    {
        assert(super.transferFrom(_from, _to, _value));
        return true;
    }
}
