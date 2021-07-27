pragma solidity ^0.4.24;

interface ILandResource {
    function land2ResourceMineState(uint256 landId) external view returns(uint256,uint256,uint256,uint128,uint64,uint64);

    function miner2Index(uint256 minerId) external view returns(uint256,address,uint64);

    function getMinerOnLand(uint256 landId, address resource, uint256 index) external view returns(uint256);

    function getTotalMiningStrength(uint _landTokenId, address _resourceToken) external view returns (uint256);

    function mintedBalanceOnLand(uint256 _landTokenId, address _resourceToken) external view returns (uint256);
}
