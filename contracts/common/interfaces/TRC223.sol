pragma solidity ^0.4.0;

contract TRC223 {
    function transferAndFallback(address to, uint amount, bytes data) public returns (bool ok);

    function transferFromAndFallback(address from, address to, uint256 amount, bytes data) public returns (bool ok);

    event TRC223Transfer(address indexed from, address indexed to, uint amount, bytes data);
}
