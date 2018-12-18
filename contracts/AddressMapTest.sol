pragma solidity ^0.4.23;

contract AddressMapTest {
    mapping (uint256 => address) public int2Address;

    // function() public payable {
    // }

    function addAddress(uint256 _value, address _addr) public {
        int2Address[_value] = _addr;
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        address owner = int2Address[_tokenId];
        require(owner != address(0));
        return owner;
    }

    function zeroAddress() public view returns (address) {
        return address(0);
    }
}