pragma solidity ^0.4.24;


// TODO: upgrade common-contacts version then delete this.
contract IApostleBase {
    function createApostle(
        uint256 _matronId, uint256 _sireId, uint256 _generation, uint256 _genes, uint256 _talents, address _owner) public returns (uint256) ;

    function isReadyToBreed(uint256 _apostleId) public view returns (bool);

    function isAbleToBreed(uint256 _matronId, uint256 _sireId, address _owner) public view returns(bool);

    function breedWithInAuction(uint256 _matronId, uint256 _sireId) public returns (bool);

    function canBreedWith(uint256 _matronId, uint256 _sireId) public view returns (bool);

    function getCooldownDuration(uint256 _tokenId) public view returns (uint256);

    function defaultLifeTime(uint256 _tokenId) public view returns (uint256);

    function isDead(uint256 _tokenId) public view returns (bool);

    function approveSiring(address _addr, uint256 _sireId) public;
}