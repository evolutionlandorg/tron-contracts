pragma solidity ^0.4.0;

import "../common/SettingIds.sol";
import "../common/interfaces/ISettingsRegistry.sol";

contract LandSettingIds is SettingIds {

    uint256 public constant GOLD_MAGNITUDE = 1;
    uint256 public constant WOOD_MAGNITUDE = 1;
    uint256 public constant WATER_MAGNITUDE = 1;
    uint256 public constant FIRE_MAGNITUDE = 1;
    uint256 public constant SOIL_MAGNITUDE = 1;

    bytes32 public constant CONTRACT_MINER = "CONTRACT_MINER";

}