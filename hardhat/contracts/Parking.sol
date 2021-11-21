// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Parking is Ownable, Pausable {
  enum ParkingZone {
    A,
    B,
    C
  }

  struct ParkingTicket {
    uint256 expirationTime;
    address buyer;
    ParkingZone zone;
  }

  mapping(ParkingZone => uint256) public zonePricePerMinute;
  mapping(string => ParkingTicket) private parkingTickets;

  modifier isBuyer(string memory plate) {
    require(msg.sender == parkingTickets[plate].buyer, "Only ticket owner can modify it");
    _;
  }

  constructor() {
    zonePricePerMinute[ParkingZone.A] = 0.00002 ether;
    zonePricePerMinute[ParkingZone.B] = 0.000015 ether;
    zonePricePerMinute[ParkingZone.C] = 0.00001 ether;
  }

  function buyTicket(
    string memory plate,
    uint256 numOfMinutes,
    ParkingZone zone
  ) external payable whenNotPaused {
    require(numOfMinutes * zonePricePerMinute[zone] <= msg.value, "Amount is not sufficient");

    ParkingTicket storage ticket = parkingTickets[plate];
    uint256 duration = numOfMinutes * 1 minutes;

    // if ticket not expired yet, then prolong it
    if (ticket.expirationTime > block.timestamp) {
      require(ticket.zone == zone, "You are trying to buy ticket for other parking zone");
      ticket.expirationTime = ticket.expirationTime + duration;
    } else {
      uint256 expiration = block.timestamp + duration;
      parkingTickets[plate] = ParkingTicket(expiration, msg.sender, zone);
    }
  }

  function changePrice(uint256 price, ParkingZone zone) external onlyOwner {
    zonePricePerMinute[zone] = price;
  }

  function isTicketValid(string memory plate, ParkingZone zone) public view returns (bool) {
    return parkingTickets[plate].zone == zone && parkingTickets[plate].expirationTime > block.timestamp;
  }

  function getTicket(string memory plate) external view returns (uint256, ParkingZone) {
    return (parkingTickets[plate].expirationTime, parkingTickets[plate].zone);
  }

  function cancelTicket(string memory plate) external isBuyer(plate) {
    ParkingTicket storage ticket = parkingTickets[plate];
    uint256 minLeft = (ticket.expirationTime - block.timestamp) / 60;
    uint256 balanceLeft = (minLeft * zonePricePerMinute[ticket.zone] * 9) / 10; // get back 90% of funds

    if (balanceLeft > 0) {
      delete parkingTickets[plate];
      (bool succeed, ) = msg.sender.call{ value: balanceLeft }("");
      require(succeed, "Failed to withdraw Ether");
    }
  }

  function transferTicket(
    string memory oldPlate,
    string memory newPlate,
    address newOwner
  ) external isBuyer(oldPlate) {
    require(
      parkingTickets[newPlate].expirationTime <= block.timestamp,
      "You cannot transfer ticket to a plate with active subscription"
    );

    ParkingTicket storage old = parkingTickets[oldPlate];
    parkingTickets[newPlate] = ParkingTicket(old.expirationTime, newOwner, old.zone);
    delete parkingTickets[oldPlate];
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  function withdraw(uint256 value) external onlyOwner {
    require(value <= address(this).balance, "Contract's balance too low to withdraw such amount");
    (bool succeed, ) = msg.sender.call{ value: value }("");
    require(succeed, "Failed to withdraw Ether");
  }
}
