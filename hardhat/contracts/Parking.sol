// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Parking is Ownable, Pausable {
    uint256 public constant PRICE = 0.025 ether;

    constructor() {}

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool succeed, ) = msg.sender.call{value: balance}("");
        require(succeed, "Failed to withdraw Ether");
    }

    receive() external payable {}
}
