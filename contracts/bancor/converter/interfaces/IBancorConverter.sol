pragma solidity ^0.4.23;
import '../../token/interfaces/IERC20Token.sol';
import '../../utility/interfaces/IWhitelist.sol';

/*
    Bancor Converter interface
*/
contract IBancorConverter {
    function getReturn(IERC20Token _fromToken, IERC20Token _toToken, uint256 _amount) public view returns (uint256);
    function convert(IERC20Token _fromToken, IERC20Token _toToken, uint256 _amount, uint256 _minReturn) public returns (uint256);
    function conversionWhitelist() public view returns (IWhitelist) {}
    function conversionFee() public view returns (uint32) {}
    function connectors(address _address) public view returns (uint256, uint32, bool, bool, bool) {}
    function getConnectorBalance(IERC20Token _connectorToken) public view returns (uint256);
    function convertInternal(IERC20Token _fromToken, IERC20Token _toToken, uint256 _amount, uint256 _minReturn) public returns (uint256);
    function getPurchaseRequire(IERC20Token _connectorToken, uint256 _smartAmountToBuy, uint256 _errorSpace) public view returns (uint256);
    function quickConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public payable returns (uint256);
    function getPurchaseReturn(IERC20Token _connectorToken, uint256 _depositAmount) public view returns (uint256);
    function getSaleReturn(IERC20Token _connectorToken, uint256 _sellAmount) public view returns (uint256);
    function getSaleRequire(IERC20Token _connectorToken, uint256 _connectorAmountToExchange, uint _errorSpace) public view returns (uint256);
}
