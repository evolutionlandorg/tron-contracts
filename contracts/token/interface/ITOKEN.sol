pragma solidity ^0.4.23;


interface ITOKEN {

    function balanceOf(address owner) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public view returns (bool);
}
