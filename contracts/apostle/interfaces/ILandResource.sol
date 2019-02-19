pragma solidity ^0.4.23;

contract ILandResource {

    function updateMinerStrengthWhenStart(uint256 _apostleTokenId) public;

    function updateMinerStrengthWhenStop(uint256 _apostleTokenId) public;

    function landWorkingOn(uint256 _apostleTokenId) public view returns (uint256);
}
