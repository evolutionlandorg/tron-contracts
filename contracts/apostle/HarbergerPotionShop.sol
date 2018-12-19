pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../ERC721/ERC721.sol";
import "../common/interfaces/ISettingsRegistry.sol";
import "../common/interfaces/IBurnableERC20.sol";
import "../common/interfaces/IMintableERC20.sol";
import "../common/DSAuth.sol";
import "./ApostleSettingIds.sol";
import "./interfaces/IApostleBase.sol";

contract  HarbergerPotionShop is DSAuth, ApostleSettingIds {
    using SafeMath for *;

    /*
     *  Events
     */
    event ClaimedTokens(address indexed _token, address indexed _owner, uint _amount);

    /*
     *  Storages
     */

    bool private singletonLock = false;

    ISettingsRegistry public registry;

    /*
     *  Structs
     */
    struct PotionState {
        uint256 estimatePrice;
        uint256 availablePotionFund;
        uint48 startTime;
        uint48 boughtLifeTime;
        uint48 lastUpdateTime;
        bool isDead;
    }

    mapping (uint256 => PotionState) public tokenId2PotionState;

    /*
     *  Modifiers
     */
    modifier singletonLockCall() {
        require(!singletonLock, "Only can call once");
        _;
        singletonLock = true;
    }


    /**
     * @dev Bank's constructor which set the token address and unitInterest_
     */
    constructor () public {
        // initializeContract(_registry);
    }

    /**
     * @dev Same with constructor, but is used and called by storage proxy as logic contract.
     * @param _registry - address of SettingsRegistry
     */
    function initializeContract(address _registry) public singletonLockCall {
        // call Ownable's constructor
        owner = msg.sender;

        emit LogSetOwner(msg.sender);

        registry = ISettingsRegistry(_registry);
    }

    function startHabergPotionModel(uint256 _tokenId, uint256 _estimatePrice, uint256 _ringAmount) public {
        require(
            ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).ownerOf(_tokenId) == msg.sender, "Only apostle owner can start Potion model.");

        
        address apostleBase = registry.addressOf(CONTRACT_APOSTLE_BASE);
        require(!(IApostleBase(apostleBase).isDead(_tokenId)), "Apostle is dead, can not start Haberg.");

        require(tokenId2PotionState[_tokenId].lastUpdateTime == 0, "Potion model should not started yet.");
        require(_estimatePrice > 0, "Apostle estimated price must larger than zero.");

        ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transferFrom(msg.sender, address(this), _ringAmount);

        tokenId2PotionState[_tokenId] = PotionState({
            estimatePrice: _estimatePrice,
            availablePotionFund: _ringAmount,
            startTime: uint48(IApostleBase(apostleBase).defaultLifeTime(_tokenId)),
            boughtLifeTime: 0,
            lastUpdateTime: uint48(now),
            isDead: false
        });
    }

    function tryKillApostle(uint256 _tokenId, address _killer) public auth {
        if (tokenId2PotionState[_tokenId].lastUpdateTime == 0) {
            // didn't start hargberg or already exited.
            return;
        } else if (tokenId2PotionState[_tokenId].isDead) {
            return;
        } else {
            uint256 currentHarbergLifeTime = harbergLifeTime(_tokenId);
            require(currentHarbergLifeTime < now);

            tokenId2PotionState[_tokenId].isDead = true;
            tokenId2PotionState[_tokenId].boughtLifeTime += uint48(currentHarbergLifeTime - tokenId2PotionState[_tokenId].startTime);
            tokenId2PotionState[_tokenId].availablePotionFund = 0;
            tokenId2PotionState[_tokenId].lastUpdateTime = uint48(now);
        }
    }

    // deposit haberg tax
    function buyPotion(uint256 _tokenId, uint256 _ringAmount) public {
        require(ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).ownerOf(_tokenId) == msg.sender, "Only apostle owner can buy potion.");

        _buyPotion(msg.sender, _tokenId, _ringAmount);
    }

    function _buyPotion(address _payer, uint256 _tokenId, uint256 _ringAmount) internal {
        require(tokenId2PotionState[_tokenId].lastUpdateTime > 0, "Potion model does not exist.");
        require(!tokenId2PotionState[_tokenId].isDead, "Apostle must not be dead.");

        ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transferFrom(_payer, address(this), _ringAmount);

        tokenId2PotionState[_tokenId].availablePotionFund += _ringAmount;
    }

    function changeHabergEstimatePrice(uint256 _tokenId, uint256 _estimatePrice) public {
        require(ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).ownerOf(_tokenId) == msg.sender);
        require(tokenId2PotionState[_tokenId].lastUpdateTime > 0, "Potion model does not exist.");
        require(!tokenId2PotionState[_tokenId].isDead, "Apostle must not be dead.");

        _updateHabergPotionState(_tokenId);

        tokenId2PotionState[_tokenId].estimatePrice = _estimatePrice;
    }

    function _updateHabergPotionState(uint256 _tokenId) internal {
        uint256 newBoughtLifeTime = now - tokenId2PotionState[_tokenId].lastUpdateTime;

        uint256 usedPotionFund = tokenId2PotionState[_tokenId].estimatePrice
            .mul(registry.uintOf(UINT_HABERG_POTION_TAX_RATE)).div(100000000)
            .mul(newBoughtLifeTime).div(1 days);

        tokenId2PotionState[_tokenId].availablePotionFund = tokenId2PotionState[_tokenId].availablePotionFund.sub(usedPotionFund);

        tokenId2PotionState[_tokenId].boughtLifeTime = uint48(tokenId2PotionState[_tokenId].boughtLifeTime + newBoughtLifeTime);

        tokenId2PotionState[_tokenId].lastUpdateTime = uint48(now);
    }

    /// stop Haberg will kill the apostle
    function stopHabergAndWithdrawFunds(uint256 _tokenId) public {
        require(ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).ownerOf(_tokenId) == msg.sender, "Only apostle owner can call this.");
        require(tokenId2PotionState[_tokenId].lastUpdateTime > 0, "Potion model does not exist.");
        require(!tokenId2PotionState[_tokenId].isDead, "Apostle must not be dead.");

        _updateHabergPotionState(_tokenId);

        tokenId2PotionState[_tokenId].isDead = true;
        tokenId2PotionState[_tokenId].availablePotionFund = 0;
        
        ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transferFrom(
            address(this), msg.sender, tokenId2PotionState[_tokenId].availablePotionFund);
    }

    function forceBuy(uint256 _tokenId, uint256 _depositPotionFee) public {
        require(tokenId2PotionState[_tokenId].lastUpdateTime > 0, "Potion model does not exist.");
        require(!tokenId2PotionState[_tokenId].isDead, "Apostle must not be dead.");

        address tokenOwner = ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).ownerOf(_tokenId);

        uint256 oldAvailablePotionFund = tokenId2PotionState[_tokenId].availablePotionFund;

        /// new owner must make up the potion fee if the old owner didn't pay enough
        _buyPotion(msg.sender, _tokenId, _depositPotionFee);

        _updateHabergPotionState(_tokenId);

        uint256 usedFund = oldAvailablePotionFund + _depositPotionFee - tokenId2PotionState[_tokenId].availablePotionFund;

        if (oldAvailablePotionFund > usedFund) {
            ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transferFrom(
                address(this), tokenOwner, (oldAvailablePotionFund - usedFund)
            );
        }

        ERC20(registry.addressOf(CONTRACT_RING_ERC20_TOKEN)).transferFrom(
            msg.sender, tokenOwner, tokenId2PotionState[_tokenId].estimatePrice);

        // must approve this first, if not, others can kill this apostle in Apostle.
        ERC721(registry.addressOf(CONTRACT_OBJECT_OWNERSHIP)).transferFrom(tokenOwner, msg.sender, _tokenId);
    }

    function harbergLifeTime(uint256 _tokenId) public view returns (uint256) {
        return tokenId2PotionState[_tokenId].startTime + tokenId2PotionState[_tokenId].boughtLifeTime + tokenId2PotionState[_tokenId].availablePotionFund
            .mul(1 days).div(
            tokenId2PotionState[_tokenId].estimatePrice.mul(registry.uintOf(UINT_HABERG_POTION_TAX_RATE)).div(100000000)
            );
    }

    /// @notice This method can be used by the owner to extract mistakenly
    ///  sent tokens to this contract.
    /// @param _token The address of the token contract that you want to recover
    ///  set to 0 in case you want to extract ether.
    function claimTokens(address _token) public onlyOwner {
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }
        ERC20 token = ERC20(_token);
        uint balance = token.balanceOf(address(this));
        token.transfer(owner, balance);

        emit ClaimedTokens(_token, owner, balance);
    }

}
