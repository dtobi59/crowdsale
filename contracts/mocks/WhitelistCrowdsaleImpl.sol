pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../crowdsale/validation/WhitelistCrowdsale.sol";


contract WhitelistCrowdsaleImpl is WhitelistCrowdsale {
    constructor (uint256 _rate, address payable _wallet, IERC20 _token) public Crowdsale(_rate, _wallet, _token) {
        // solhint-disable-previous-line no-empty-blocks
    }



}