# Parking App

The project contains two parts. First one is a solidity contract that handles all of the logic and state of the parking ticket purchases. The second part is a frontend app that will allow different types of users to interact with a parking contract (buy tickets, withdraw funds, verify bought tickets...).

## Features

1. Users can buy parking tickets for selected plate number for selected amount of time
2. Owner can set/change price per hour and per area
3. Controllers can check if vehicle with a plate number has bought a parking ticket
4. Users can claim back funds for the paid time that was unused (for lower price than when bought)
5. Buying longer duration tickets leads to discount
6. Users can transfer valid parking ticket between different plate numbers
7. Owner can withdraw funds
