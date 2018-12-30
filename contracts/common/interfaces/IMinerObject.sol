pragma solidity ^0.4.23;

import "../../ERC721/ERC165.sol";

contract IMinerObject is ERC165  {
    // TODO: this is from common module code, because the original InterfaceId is not modified, so we do not modify this too.
    bytes4 internal constant InterfaceId_IMinerObject = 0x64272b75;
    
    /*
     * 0x64272b752 ===
     *   bytes4(keccak256('strengthOf(uint256,address)'))
     */

    function strengthOf(uint256 _tokenId, address _resourceToken, uint256 _landTokenId) public view returns (uint256);

}