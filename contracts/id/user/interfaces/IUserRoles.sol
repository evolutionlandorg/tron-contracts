pragma solidity ^0.4.0;

contract IUserRoles {
    function addAddressToTester(address _operator) public;

    function addAddressesToTester(address[] _operators) public;

    function isTester(address _operator) public view returns (bool);

    function isDeveloper(address _operator) public view returns (bool);

    function isTesterOrDeveloper(address _operator) public view returns (bool);

    function addAddressToDeveloper(address _operator) public;

    function addAddressesToDeveloper(address[] _operators) public;
}