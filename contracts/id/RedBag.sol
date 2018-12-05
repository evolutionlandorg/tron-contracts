pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../common/interfaces/ISettingsRegistry.sol";
import "./IDSettingIds.sol";

contract RedBag is Pausable, IDSettingIds {
    using SafeMath for *;

    event RegBagCreated(uint256 indexed id, address indexed creator, uint256 count, uint256 value, uint256 model);

    event ClaimedTokens(address indexed _token, address indexed _to, uint _amount);

    ISettingsRegistry public registry;

    uint256 public ringAmountLimit;
    uint256 public bagCountLimit;

    uint256 public perMinAmount;

    constructor(ISettingsRegistry _registry, uint256 _ringAmountLimit, uint256 _bagCountLimit, uint256 _perMinAmount) public
    {
        require(_ringAmountLimit > 0, "RING amount need to be no-zero");
        require(_bagCountLimit > 0, "RING bag amount need to be no-zero");
        require(_perMinAmount > 0, "RING that everyone can get need to be no-zero");

        registry = _registry;
        ringAmountLimit = _ringAmountLimit;
        bagCountLimit = _bagCountLimit;
        perMinAmount = _perMinAmount;
    }

    function tokenFallback(address _from, uint256 _value, bytes _data) public whenNotPaused {
        if (msg.sender == registry.addressOf(CONTRACT_RING_ERC20_TOKEN)) {
            uint256 _bagCount;
            uint256 _model;
            uint256 _id;
            assembly {
                let ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize)
                _bagCount := mload(add(ptr, 132))
                _model := mload(add(ptr, 164))
                _id := mload(add(ptr, 196))
            }

            _giveRedBag(_from, _value, _bagCount, _id, _model);
        }
    }

    function _giveRedBag(address _sender, uint256 _ringAmount, uint256 _bagCount, uint256 _id, uint256 _model) internal whenNotPaused {
        require(_sender != address(0));
        require(_ringAmount <= ringAmountLimit && _ringAmount > 0);
        require(_bagCount <= bagCountLimit && _bagCount > 0);

        // no overflow risk
        // don't worry
        require(_ringAmount >= (perMinAmount * _bagCount));

        ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transfer(registry.addressOf(CONTRACT_CHANNEL_DIVIDEND), _ringAmount);

        emit RegBagCreated(_id, _sender, _bagCount, _ringAmount, _model);
    }

    function changeRegistry(ISettingsRegistry _newRegistry) public onlyOwner {
        registry = _newRegistry;
    }

    function changeLimit(uint256 _ringAmountLimit, uint256 _bagCountLimit, uint256 _perMinAmount) public onlyOwner {
        ringAmountLimit = _ringAmountLimit;
        bagCountLimit = _bagCountLimit;
        perMinAmount = _perMinAmount;
    }


//////////
// Safety Methods
//////////

    /// @notice This method can be used by the controller to extract mistakenly
    ///  sent tokens to this contract.
    /// @param _token The address of the token contract that you want to recover
    ///  set to 0 in case you want to extract ether.
    function claimTokens(address _token) public onlyOwner {
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(_token);
        uint balance = token.balanceOf(this);
        token.transfer(owner, balance);

        emit ClaimedTokens(_token, owner, balance);
    }
}
