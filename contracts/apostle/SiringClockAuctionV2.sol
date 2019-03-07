pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../common/interfaces/ISettingsRegistry.sol";
import "../common/interfaces/TRC223.sol";
import "../common/interfaces/ITokenUse.sol";
import "./interfaces/IApostleBase.sol";
import "./SiringAuctionBase.sol";

/// @title Clock auction for non-fungible tokens.
contract SiringClockAuctionV2 is SiringAuctionBase {
    // claimedToken event
    event ClaimedTokens(address indexed token, address indexed owner, uint amount);
    
    constructor(ISettingsRegistry _registry) public {
        registry = _registry;
    }

    /// @dev Cancels an auction that hasn't been won yet.
    ///  Returns the NFT to original owner.
    /// @notice This is a state-modifying function that can
    ///  be called while the contract is paused.
    /// @param _tokenId - ID of token on auction
    function cancelAuction(uint256 _tokenId)
    public
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_tokenId, seller);
    }

    /// @dev Cancels an auction when the contract is paused.
    ///  Only the owner may do this, and NFTs are returned to
    ///  the seller. This should only be used in emergencies.
    /// @param _tokenId - ID of the NFT on auction to cancel.
    function cancelAuctionWhenPaused(uint256 _tokenId)
    whenPaused
    onlyOwner
    public
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        _cancelAuction(_tokenId, auction.seller);
    }

    /// @dev Returns auction info for an NFT on auction.
    /// @param _tokenId - ID of NFT on auction.
    function getAuction(uint256 _tokenId)
    public
    view
    returns
    (
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint256 duration,
        uint256 startedAt,
        address token
    ) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        return (
        auction.seller,
        uint256(auction.startingPriceInToken),
        uint256(auction.endingPriceInToken),
        uint256(auction.duration),
        uint256(auction.startedAt),
        auction.token
        );
    }

    /// @dev Returns the current price of an auction.
    /// @param _tokenId - ID of the token price we are checking.
    function getCurrentPriceInToken(uint256 _tokenId)
    public
    view
    returns (uint256)
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        return _currentPrice(auction);
    }

    function receiveApproval(
        address _from,
        uint256 _tokenId,
        bytes //_extraData
    ) public whenNotPaused {
        if (msg.sender == registry.addressOf(SettingIds.CONTRACT_OBJECT_OWNERSHIP)) {
            uint256 startingPriceInRING;
            uint256 endingPriceInRING;
            uint256 duration;
            address seller;

            assembly {
                let ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize)
                startingPriceInRING := mload(add(ptr, 132))
                endingPriceInRING := mload(add(ptr, 164))
                duration := mload(add(ptr, 196))
                seller := mload(add(ptr, 228))
            }

            // TODO: add parameter _token
            _createAuction(_from, _tokenId, startingPriceInRING, endingPriceInRING, duration, now, seller, registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN));
        }
    }


    function tokenFallback(address _from, uint256 _valueInToken, bytes _data) public whenNotPaused {
        uint sireId;
        uint matronId;
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            matronId := mload(add(ptr, 132))
            sireId := mload(add(ptr, 164))
        }
        // safer for users
        require(msg.sender == tokenIdToAuction[sireId].token);
        require(tokenIdToAuction[sireId].startedAt > 0);

        uint256 autoBirthFee = registry.uintOf(UINT_AUTOBIRTH_FEE);

        // Check that the incoming bid is higher than the current price
        uint priceInToken = getCurrentPriceInToken(sireId);

        require(_valueInToken >= (priceInToken + autoBirthFee),
            "your offer is lower than the current price, try again with a higher one.");
        Auction storage auction = tokenIdToAuction[sireId];
        require(now >= uint256(auction.startedAt), "you cant bid before the auction starts.");

        address seller = auction.seller;

        _removeAuction(sireId);
        uint refund = _valueInToken - priceInToken - autoBirthFee;
        
        if (refund > 0) {
            ERC20(msg.sender).transfer(_from, refund);
        }

        if (priceInToken > 0) {
            _bidWithToken(msg.sender, _from, seller, sireId, matronId, priceInToken, autoBirthFee);
        }
    }


    function _bidWithToken(
        address _auctionToken, address _from, address _seller, uint256 _sireId, uint256 _matronId, uint256 _priceInToken, uint256 _autoBirthFee) internal {
        ERC721 objectOwnership = ERC721(registry.addressOf(SettingIds.CONTRACT_OBJECT_OWNERSHIP));
        require(objectOwnership.ownerOf(_matronId) == _from, "You can only breed your own apostle.");
        //uint256 ownerCutAmount = _computeCut(priceInToken);
        uint cut = _computeCut(_priceInToken);
        TRC223(_auctionToken).transferAndFallback(_seller, (_priceInToken - cut), toBytes(_from));
        TRC223(_auctionToken).transferAndFallback(registry.addressOf(CONTRACT_REVENUE_POOL), (cut + _autoBirthFee), toBytes(_from));

        IApostleBase(registry.addressOf(CONTRACT_APOSTLE_BASE)).approveSiring(_from, _sireId);

        address apostleBase = registry.addressOf(CONTRACT_APOSTLE_BASE);

        require(IApostleBase(apostleBase).breedWithInAuction(_matronId, _sireId));

        objectOwnership.transferFrom(address(this), _seller, _sireId);

        // Tell the world!
        emit AuctionSuccessful(_sireId, _priceInToken, _from);

    }

    function toBytes(address x) public pure returns (bytes b) {
        b = new bytes(32);
        assembly {mstore(add(b, 32), x)}
    }

    // to apply for the safeTransferFrom
    function onERC721Received(
        address, //_operator,
        address, //_from,
        uint256, // _tokenId,
        bytes //_data
    )
    public
    returns (bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

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

    function claimERC721Tokens(uint256 _tokenId) public onlyOwner {
        ERC721(registry.addressOf(SettingIds.CONTRACT_OBJECT_OWNERSHIP)).transferFrom(address(this), owner, _tokenId);
    }

    function setRegistry(address _registry) public onlyOwner {
        registry = ISettingsRegistry(_registry);
    }
}
