// 1. Pragma
// 2. Imports
// 3. Interfaces, Libraries, Contracts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_InvalidOwner();
error FundMe_InsufficientUsd();
error FundMe_WithdrawFailed();

contract FundMe {
    /**
     Type Declarations
     State variables
     Events
     Modifiers
     Functions
     */

    using PriceConverter for uint256;

    address private immutable i_owner;
    uint256 public constant MIN_USD = 1 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmount;
    AggregatorV3Interface public s_priceFeed;

    modifier verifyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe_InvalidOwner();
        }
        _;
    }
    modifier checkMinimumUsd() {
        if (msg.value.getConversionRate(s_priceFeed) < MIN_USD) {
            revert FundMe_InsufficientUsd();
        }
        _;
    }

    /**
    Functions Order:
        constructor
        receive
        fallback
        external
        public
        internal
        private
        view / pure
     */
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable checkMinimumUsd {
        s_funders.push(msg.sender);
        s_addressToAmount[msg.sender] = msg.value;
    }

    function withdraw() public verifyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            s_addressToAmount[funders[funderIndex]] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable (msg.sender).transfer(address(this).balance);
        // // send
        // bool sent = payable (msg.sender).send(address(this).balance);
        // require(sent, "Send failed!");
        // Call
        (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
        if (!callSuccess) {
            revert FundMe_WithdrawFailed();
        }
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmount(address funder) public view returns (uint256) {
        return s_addressToAmount[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
