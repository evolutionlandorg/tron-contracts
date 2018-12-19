pragma solidity ^0.4.0;

import "./interfaces/ITokenLocation.sol";
import "./DSAuth.sol";
import "./LocationCoder.sol";

contract TokenLocation is DSAuth, ITokenLocation {
    using LocationCoder for *;

    // token id => encode(x,y) postiion in map, the location is in micron.
    mapping (uint256 => uint256) public tokenId2LocationId;

    function hasLocation(uint256 _tokenId) public view returns (bool) {
        return tokenId2LocationId[_tokenId] != 0;
    }

    function getTokenLocationHM(uint256 _tokenId) public view returns (int, int){
        (int _x, int _y) = getTokenLocation(_tokenId);
        return (LocationCoder.toHM(_x), LocationCoder.toHM(_y));
    }

    function setTokenLocationHM(uint256 _tokenId, int _x, int _y) public auth {
        setTokenLocation(_tokenId, LocationCoder.toUM(_x), LocationCoder.toUM(_y));
    }

    // decode tokenId to get (x,y)
    function getTokenLocation(uint256 _tokenId) public view returns (int, int) {
        uint locationId = tokenId2LocationId[_tokenId];
        return LocationCoder.decodeLocationIdXY(locationId);
    }

    function setTokenLocation(uint256 _tokenId, int _x, int _y) public auth {
        tokenId2LocationId[_tokenId] = LocationCoder.encodeLocationIdXY(_x, _y);
    }
}