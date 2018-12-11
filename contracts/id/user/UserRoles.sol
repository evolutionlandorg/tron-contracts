pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";
import "../../common/DSAuth.sol";


/**
 * @title UserRoles
 * @dev The UserRoles contract has a list of addresses, and provides basic authorization control functions.
 * This simplifies the implementation of "user permissions".
 */
contract UserRoles is DSAuth, RBAC {
    string public constant ROLE_TESTER = "tester";
    string public constant ROLE_DEVELOPER = "developer";

    /**
     * @dev add an address to the tester
     * @param _operator address
     * @return true if the address was added to the whitelist, false if the address was already in the whitelist
     */
    function addAddressToTester(address _operator)
    public
    auth
    {
        addRole(_operator, ROLE_TESTER);
    }

    constructor() public {
        // initializeContract
    }

    /**
    * @dev getter to determine if address is in whitelist
    */
    function isTester(address _operator)
    public
    view
    returns (bool)
    {
        return hasRole(_operator, ROLE_TESTER);
    }

    function isDeveloper(address _operator)
    public
    view
    returns (bool)
    {
        return hasRole(_operator, ROLE_DEVELOPER);
    }

    function isTesterOrDeveloper(address _operator)
    public
    view
    returns (bool)
    {
        return hasRole(_operator, ROLE_TESTER) || hasRole(_operator, ROLE_DEVELOPER);
    }

    /**
    * @dev add addresses to the testers
    * @param _operators addresses
    * @return true if at least one address was added to the whitelist,
    * false if all addresses were already in the whitelist
    */
    function addAddressesToTester(address[] _operators)
    public
    auth
    {
        for (uint256 i = 0; i < _operators.length; i++) {
            addAddressToTester(_operators[i]);
        }
    }

    /**
    * @dev remove an address from the tester
    * @param _operator address
    * @return true if the address was removed from the whitelist,
    * false if the address wasn't in the whitelist in the first place
    */
    function removeAddressFromTester(address _operator)
    public
    auth
    {
        removeRole(_operator, ROLE_TESTER);
    }

    /**
    * @dev remove addresses from the tester
    * @param _operators addresses
    * @return true if at least one address was removed from the whitelist,
    * false if all addresses weren't in the whitelist in the first place
    */
    function removeAddressesFromTester(address[] _operators)
    public
    auth
    {
        for (uint256 i = 0; i < _operators.length; i++) {
            removeAddressFromTester(_operators[i]);
        }
    }

    function addAddressToDeveloper(address _operator)
    public
    auth
    {
        addRole(_operator, ROLE_DEVELOPER);
    }

    function addAddressesToDeveloper(address[] _operators)
    public
    auth
    {
        for (uint256 i = 0; i < _operators.length; i++) {
            addAddressToDeveloper(_operators[i]);
        }
    }

    function removeAddressFromDeveloper(address _operator)
    public
    auth
    {
        removeRole(_operator, ROLE_DEVELOPER);
    }

    function removeAddressesFromDeveloper(address[] _operators)
    public
    auth
    {
        for (uint256 i = 0; i < _operators.length; i++) {
            removeAddressFromDeveloper(_operators[i]);
        }
    }

}