pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MintAndBurnAuthority is Ownable{

    mapping (address => bool) public whiteList;

    constructor(address _whitelist) public {
        whiteList[_whitelist] = true;
    }

    function canCall(
        address _src, address _dst, bytes4 _sig
    ) public view returns (bool) {
        return ( whiteList[_src] && _sig == bytes4(keccak256("mint(address,uint256)")) ) ||
        ( whiteList[_src] && _sig == bytes4(keccak256("burn(address,uint256)")) );
    }

    function addWhiteList(address _whitelist) public onlyOwner {
        whiteList[_whitelist] = true;
    }
}
