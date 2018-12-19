pragma solidity ^0.4.24;


/// @title defined the interface that will be referenced in main Kitty contract
contract IGeneScience {
    /// @dev simply a boolean to indicate this is the contract we expect to be
    function isGeneScience() public pure returns (bool);

    /// @dev given genes of apostle 1 & 2, return a genetic combination - may have a random factor
    /// @param genes1 genes of mom
    /// @param genes2 genes of sire
    /// @param talents1 talents of mom
    /// @param talents2 talents of sire
    /// @return the genes and talents that are supposed to be passed down the child
    function mixGenesAndTalents(uint256 genes1, uint256 genes2, uint256 talents1, uint256 talents2, address resouceToken, uint256 level) public returns (uint256, uint256);

    function getStrength(uint256 _talents, address _resouceToken) public view returns (uint256);

    function isOkWithRaceAndGender(uint _matronGenes, uint _sireGenes) public view returns (bool);
}
