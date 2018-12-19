pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../common/interfaces/ERC223.sol";
import "../../common/interfaces/IBurnableERC20.sol";
import "../../common/interfaces/ISettingsRegistry.sol";
import "../../common/DSAuth.sol";
import "../IDSettingIds.sol";


contract DividendPool is DSAuth, IDSettingIds {

    using SafeMath for *;

    event TransferredFrozenDividend(address indexed _dest, uint256 _value);
    event TransferredChannelDividend(address indexed _dest, uint256 _value);

    event ClaimedTokens(address indexed _token, address indexed _controller, uint _amount);

    ISettingsRegistry public registry;

    constructor(ISettingsRegistry _registry) public {
        registry = _registry;
    }

    function tokenFallback(address _from, uint256 _value, bytes _data) public {
        address ring = registry.addressOf(CONTRACT_RING_ERC20_TOKEN);
        if (msg.sender == ring) {
            // trigger settlement
            settlement();
        }

        address kton = registry.addressOf(CONTRACT_KTON_ERC20_TOKEN);
        if (msg.sender == kton) {
            // TODO: add Dividend Pool to authority.
            IBurnableERC20(kton).burn(address(this), _value);
        }
    }

    function settlement() public {
        address ring = registry.addressOf(CONTRACT_RING_ERC20_TOKEN);

        uint256 balance = ERC20(ring).balanceOf(address(this));
        if ( balance > 0 ) {
            address kton = registry.addressOf(CONTRACT_KTON_ERC20_TOKEN);
            address frozenDividend = registry.addressOf(CONTRACT_FROZEN_DIVIDEND);
            address channelDividend = registry.addressOf(CONTRACT_CHANNEL_DIVIDEND);

            uint256 ktonSupply = ERC20(kton).totalSupply();

            uint256 frozenKton = ERC20(kton).balanceOf(frozenDividend);

            uint256 frozenBalance = frozenKton.mul(balance).div(ktonSupply);

            ERC223(ring).transfer(frozenDividend, frozenBalance, "0x0");

            emit TransferredFrozenDividend(frozenDividend, balance);

            ERC20(ring).transfer(channelDividend, balance.sub(frozenBalance));
            
            emit TransferredChannelDividend(channelDividend, balance.sub(frozenBalance));
        }
    }
    
    function claimTokens(address _token) public auth {
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(_token);
        uint balance = token.balanceOf(this);
        token.transfer(owner, balance);

        emit ClaimedTokens(_token, owner, balance);
    }

    function setRegistry(address _registry) public onlyOwner {
        registry = ISettingsRegistry(_registry);
    }
}