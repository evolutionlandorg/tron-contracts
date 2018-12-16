pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./bancor/token/TrxToken.sol";

contract FallbackTest is Ownable {
    TrxToken public trxToken;
    

    constructor (address _trxToken) {
        trxToken = TrxToken(_trxToken);
    }

    // function() public payable {
    // }

    function deposit() public payable {
    }

    function withdraw(uint256 amount) public {
        msg.sender.transfer(amount);
    }

    // not working
    function transferToTrxToken(uint256 amount) public {
        address(trxToken).transfer(amount);
    }

    function depositToTrxToken(uint256 amount) public {
        trxToken.deposit.value(amount)();
    }

    function withdrawFromTrxToken(uint256 amount) public {
        trxToken.withdraw(amount);
    }

    function claimTokens(address _token) public onlyOwner {
        // 410000000000000000000000000000000000000000
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }
        IERC20Token token = IERC20Token(_token);
        uint balance = token.balanceOf(address(this));
        token.transfer(owner, balance);
    }

}