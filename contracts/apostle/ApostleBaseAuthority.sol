pragma solidity ^0.4.23;

contract ApostleBaseAuthority {
    mapping (address => bool) public whiteList;

    constructor(address[] _whitelists) public {
        for (uint i = 0; i < _whitelists.length; i ++) {
            whiteList[_whitelists[i]] = true;
        }
    }

    function canCall(
        address _src, address _dst, bytes4 _sig
    ) public view returns (bool) {
        return ( whiteList[_src] && _sig == bytes4(keccak256("createApostle(uint256,uint256,uint256,uint256,uint256,address)")) ) ||
               ( whiteList[_src] && _sig == bytes4(keccak256("breedWithInAuction(uint256,uint256)")) ) ||
               ( whiteList[_src] && _sig == bytes4(keccak256("activityAdded(uint256,address,address)"))) ||
                ( whiteList[_src] && _sig == bytes4(keccak256("activityRemoved(uint256,address,address)"))) ||
                ( whiteList[_src] && _sig == bytes4(keccak256("activityStopped(uint256)")));
    }
}