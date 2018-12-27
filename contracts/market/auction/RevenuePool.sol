pragma solidity ^0.4.0;

import "../../common/interfaces/ISettingsRegistry.sol";
import "../../common/interfaces/ERC223ReceivingContract.sol";
import "../../common/interfaces/TRC223.sol";
import "../../common/interfaces/IUserPoints.sol";
import "../../common/DSAuth.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./AuctionSettingIds.sol";

// Use proxy mode
contract RevenuePool is DSAuth, ERC223ReceivingContract, AuctionSettingIds {

//    // 10%
//    address public pointsRewardPool;
//    // 30%
//    address public contributionIncentivePool;
//    // 30%
//    address public dividendsPool;
//    // 30%
//    address public devPool;

    ISettingsRegistry public registry;

    // claimedToken event
    event ClaimedTokens(address indexed token, address indexed owner, uint amount);

    constructor(ISettingsRegistry _registry) public {
        // initializeContract
        registry = _registry;
    }

    function tokenFallback(address _from, uint256 _value, bytes _data) public {

        address ring = registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN);
        address userPoints = registry.addressOf(SettingIds.CONTRACT_USER_POINTS);

        if(msg.sender == ring) {
            address buyer = bytesToAddress(_data);
            // should same with trading reward percentage in settleToken;

            IUserPoints(userPoints).addPoints(buyer, _value / 1000);
        }
    }


    function settleToken(address _tokenAddress) public {
        uint balance = ERC20(_tokenAddress).balanceOf(address(this));

        // to save gas when playing
        if (balance > 10) {
            address pointsRewardPool = registry.addressOf(AuctionSettingIds.CONTRACT_POINTS_REWARD_POOL);
            address contributionIncentivePool = registry.addressOf(AuctionSettingIds.CONTRACT_CONTRIBUTION_INCENTIVE_POOL);
            address dividendsPool = registry.addressOf(CONTRACT_DIVIDENDS_POOL);
            address devPool = registry.addressOf(AuctionSettingIds.CONTRACT_DEV_POOL);

            require(pointsRewardPool != 0x0 && contributionIncentivePool != 0x0 && dividendsPool != 0x0 && devPool != 0x0);

            require(TRC223(_tokenAddress).transferAndFallback(pointsRewardPool, balance / 10, "0x0"));
            require(TRC223(_tokenAddress).transferAndFallback(contributionIncentivePool, balance * 3 / 10, "0x0"));
            require(TRC223(_tokenAddress).transferAndFallback(dividendsPool, balance * 3 / 10, "0x0"));
            require(TRC223(_tokenAddress).transferAndFallback(devPool, balance * 3 / 10, "0x0"));
        }

    }


    /// @notice This method can be used by the owner to extract mistakenly
    ///  sent tokens to this contract.
    /// @param _token The address of the token contract that you want to recover
    ///  set to 0 in case you want to extract ether.
    function claimTokens(address _token) public auth {
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }
        ERC20 token = ERC20(_token);
        uint balance = token.balanceOf(address(this));
        token.transfer(owner, balance);

        emit ClaimedTokens(_token, msg.sender, balance);
    }

    function bytesToAddress(bytes b) public pure returns (address) {
        bytes32 out;

        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[i] & 0xFF) >> (i * 8);
        }
        return address(out);
    }

    function setRegistry(address _registry) public onlyOwner {
        registry = ISettingsRegistry(_registry);
    }

}
