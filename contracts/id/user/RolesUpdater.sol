pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IUserRoles.sol";

contract RolesUpdater is Ownable {
    address public supervisor;

    IUserRoles public userRoles;

    uint256 public networkId;

    mapping(address => uint256) public userToNonce;

    event UpdateTesterRole(address indexed _user, uint indexed _nonce, bytes32 _testerCodeHash);

    event ClaimedTokens(address indexed _token, address indexed _controller, uint _amount);

    constructor(IUserRoles _userRoles, uint _networkId, address _supervisor) public {
        userRoles = _userRoles;
        networkId = _networkId;
        supervisor = _supervisor;
    }

    // _hashmessage = hash("${_address}${_nonce}${sha3(_testercode)}${_networkId}")
    // _v, _r, _s are from supervisor's signature on _hashmessage
    function updateTesterRole(uint256 _nonce, bytes32 _testerCodeHash, bytes32 _hashmessage, uint8 _v, bytes32 _r, bytes32 _s) public {
        address _user = msg.sender;

        // verify the _nonce is right
        require(userToNonce[_user] == _nonce);

        // verify the _hashmessage is signed by supervisor
        require(supervisor == verify(_hashmessage, _v, _r, _s));

        // verify that the _user, _nonce, _value are exactly what they should be
        require(keccak256(abi.encodePacked(_user, _nonce, _testerCodeHash, networkId)) == _hashmessage);

        userRoles.addAddressToTester(_user);

        // after the claiming operation succeeds
        userToNonce[_user] += 1;

        emit UpdateTesterRole(_user, _nonce, _testerCodeHash);
    }

    function verify(bytes32 _hashmessage, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (address) {
        bytes memory prefix = "\x19EvolutionLand Signed Message For Role Updater:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, _hashmessage));
        address signer = ecrecover(prefixedHash, _v, _r, _s);
        return signer;
    }

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

    function changeSupervisor(address _newSupervisor) public onlyOwner {
        supervisor = _newSupervisor;
    }

    function changeUserRoles(address _newUserRoles) public onlyOwner {
        userRoles = IUserRoles(_newUserRoles);
    }
}