pragma solidity ^0.4.23;

import "../common/interfaces/ISettingsRegistry.sol";
import "../common/PausableDSAuth.sol";
import "../common/SettingIds.sol";
import "./converter/interfaces/IBancorConverter.sol";
import "./token/interfaces/ISmartToken.sol";
import "./IBancorNetwork.sol";
import "./converter/interfaces/IBancorFormula.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ContractIds.sol";

contract BancorExchange is PausableDSAuth, SettingIds, ContractIds {

    using SafeMath for *;

    ISettingsRegistry public registry;

    IBancorNetwork public bancorNetwork;
    IBancorConverter public bancorConverter;

    IERC20Token[] public quickSellPath;
    IERC20Token[] public quickBuyPath;

    uint64 private constant MAX_ERROR_TOLERANT_BASE = 10000000;

    // validates a conversion path - verifies that the number of elements is odd and that maximum number of 'hops' is 10
    modifier validConversionPath(IERC20Token[] _path) {
        require(_path.length > 2 && _path.length <= (1 + 2 * 10) && _path.length % 2 == 1);
        _;
    }

    constructor(address _bn, address _bc, address _registry) public {
        bancorNetwork = IBancorNetwork(_bn);
        bancorConverter = IBancorConverter(_bc);
        registry = ISettingsRegistry(_registry);
    }

    function() public payable {
        // this is necessary!
        // this is used in sell ring back to trx!
    }


    function setBancorNetwork(address _bn) public onlyOwner {
        bancorNetwork = IBancorNetwork(_bn);
    }

    function setBancorConverter(address _bc) public onlyOwner {
        bancorConverter = IBancorConverter(_bc);
    }

    function setQuickSellPath(IERC20Token[] _path)
    public
    onlyOwner
    validConversionPath(_path)
    {
        quickSellPath = _path;
    }

    function setQuickBuyPath(IERC20Token[] _path)
    public
    onlyOwner
    validConversionPath(_path)
    {
        quickBuyPath = _path;
    }

    function buyRING(uint _minReturn) public payable whenNotPaused returns (uint) {
        uint amount = bancorConverter.quickConvert.value(msg.value)(quickBuyPath, msg.value * 10**12, _minReturn);
        ISmartToken smartToken = ISmartToken(registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN));
        smartToken.transfer(msg.sender, amount);
        return amount;
    }

    // this is used to buy specific amount of ring with minimum required eth
    // @param _errorSpace belongs to [0, 10000000]
    function buyRINGInMinRequiedETH(uint _minReturn, address _buyer, uint _errorSpace) public payable auth whenNotPaused returns (uint, uint) {
        ISmartToken smartToken = ISmartToken(registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN));

        (uint amountRequired) = bancorConverter.getPurchaseRequire(quickBuyPath[0], _minReturn, _errorSpace);

        require(msg.value * 10**12 >= amountRequired);
        uint amount = bancorConverter.quickConvert.value(msg.value)(quickBuyPath, amountRequired, _minReturn);
        //        uint refundEth = msg.value - amountRequired;
        //        if (refundEth > 0) {
        //            _buyer.transfer(refundEth);
        //        }
        smartToken.transfer(msg.sender, amount);
        return (amount, amountRequired);
    }

    function tokenFallback(address _from, uint256 _value, bytes _data) public whenNotPaused  {
        ISmartToken smartToken = ISmartToken(registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN));

        if (address(smartToken) == msg.sender) {
            uint minReturn = bytesToUint256(_data);
            smartToken.transfer(address(bancorNetwork), _value);
            // cant replace address(this) with _from
            // because of whitelist mechanism in bancor protocol
            uint amount = bancorNetwork.convertForPrioritized2(quickSellPath, _value, minReturn, address(this), 0, 0, 0x0, 0x0);
            _from.transfer(amount/10**12);
        }
    }

    // @dev before invoke sellRING, make sure approve to exchange before in RING contract
    // @param _sellAmount amount of ring you want to sell
    // @param _minReturn minimum amount of ETH you expect
    function sellRING(uint _sellAmount, uint _minReturn) public whenNotPaused {
        ISmartToken smartToken = ISmartToken(registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN));

        smartToken.transferFrom(msg.sender, address(bancorNetwork), _sellAmount);
        // cant replace address(this) with msg.sender
        // because of whitelist mechanism in bancor protocol
        uint amount = bancorNetwork.convertForPrioritized2(quickSellPath, _sellAmount, _minReturn, address(this), 0, 0, 0x0, 0x0);
        msg.sender.transfer(amount/10**12);
    }


    function bytesToUint256(bytes b) public pure returns (uint256) {
        bytes32 out;

        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[i] & 0xFF) >> (i * 8);
        }
        return uint256(out);
    }


    function claimTokens(address _token) public onlyOwner {
        if (_token == 0x0) {
            owner.transfer(address(this).balance);
            return;
        }
        IERC20Token token = IERC20Token(_token);
        uint balance = token.balanceOf(address(this));
        token.transfer(owner, balance);
    }

    function setRegistry(address _registry) public onlyOwner {
        registry = ISettingsRegistry(_registry);
    }

    function getPurchaseReturn(IERC20Token _connectorToken, uint256 _depositAmount) public view returns (uint256) {
        uint amount = _depositAmount * 10**12;
        return bancorConverter.getPurchaseReturn(_connectorToken, amount);
    }

    function getPurchaseRequire(IERC20Token _connectorToken, uint256 _smartAmountToBuy, uint256 _errorSpace) public view returns (uint256) {
        uint amount = bancorConverter.getPurchaseRequire(_connectorToken, _smartAmountToBuy, _errorSpace);
        return (amount / 10**12 + 1);
    }

    function getSaleReturn(IERC20Token _connectorToken, uint256 _sellAmount) public view returns (uint256) {
        uint amount = bancorConverter.getSaleReturn(_connectorToken, _sellAmount);
        return (amount / 10**12);
    }


    function getSaleRequire(IERC20Token _connectorToken, uint256 _connectorAmountToExchange, uint _errorSpace) public view returns (uint256) {
        uint connectorTokenExpect = _connectorAmountToExchange * 10**12;
        uint totalSupply = IERC20Token(registry.addressOf(SettingIds.CONTRACT_RING_ERC20_TOKEN)).totalSupply();
        uint connectorBalance = bancorConverter.getConnectorBalance(_connectorToken);
        uint32 weight;
        (, weight, , , ) = bancorConverter.connectors(_connectorToken);
        IBancorFormula formula = IBancorFormula(registry.addressOf(ContractIds.BANCOR_FORMULA));
        uint256 amount = formula.calculateSaleRequire(connectorBalance, totalSupply, weight, connectorTokenExpect);
        // return the amount minus the conversion fee
        return bancorConverter.getFinalAmount(amount.mul(_errorSpace + MAX_ERROR_TOLERANT_BASE) / MAX_ERROR_TOLERANT_BASE, 1);
    }

}
