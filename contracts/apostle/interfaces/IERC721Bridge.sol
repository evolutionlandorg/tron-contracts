pragma solidity ^0.4.23;

contract IERC721Bridge {


    function originNft2Adaptor(address _originContract) public view returns (address);

    function ownerOf(uint256 _mirrorTokenId) public view returns (address);

    function isBridged(uint256 _mirrorTokenId) public view returns (bool);

    function bridgeInAuth(address _originNftAddress, uint256 _originTokenId, address _owner) public returns (uint256);
}
