# OrderBasedSwap: Decentralized Token Swap Contract

This project implements a decentralized token swap contract using Solidity and Hardhat. The `OrderBasedSwap` contract allows users to create and fulfill token swap orders without the need for a centralized exchange.

## Table of Contents

1. [Features](#features)
2. [Contract Overview](#contract-overview)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Security Considerations](#security-considerations)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- Create swap orders for ERC20 tokens
- Fulfill existing swap orders
- View order details and status
- Secure token transfers using OpenZeppelin's SafeERC20
- Event emission for order creation and fulfillment
- Prevention of duplicate order fulfillment

## Contract Overview

The main contract `OrderBasedSwap` contains the following key components:

### Structs

- `Order`: Represents a swap order with details like orderId, seller, tokens involved, and amounts.

### State Variables

- `orders`: An array to store all created orders.
- `orderFulfilled`: A mapping to track fulfilled orders.

### Events

- `OrderCreated`: Emitted when a new order is created.
- `OrderFulfilled`: Emitted when an order is successfully fulfilled.

### Functions

1. `createOrder`: Create a new swap order
2. `fulfillOrder`: Fulfill an existing swap order
3. `getOrdersCount`: Get the total number of orders

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Hardhat

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/order-based-swap.git
   cd order-based-swap
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Creating an Order

To create a new swap order:

1. Approve the `OrderBasedSwap` contract to spend the tokens you want to sell.
2. Call the `createOrder` function with the following parameters:
   - `_tokenToSell`: Address of the token you're selling
   - `_amountToSell`: Amount of tokens to sell
   - `_tokenToBuy`: Address of the token you want to receive
   - `_amountToBuy`: Amount of tokens to receive

### Fulfilling an Order

To fulfill an existing order:

1. Ensure you have sufficient balance of the token to buy.
2. Approve the `OrderBasedSwap` contract to spend the required amount.
3. Call the `fulfillOrder` function with the `_orderId` of the order you want to fulfill.

## Testing

To run the test suite:

1. Make sure you have installed all dependencies:
   ```
   npm install
   ```

2. Compile the contracts:
   ```
   npx hardhat compile
   ```

3. Run the test suite:
   ```
   npx hardhat test
   ```

This will execute all the tests in the `test` directory. The test suite simply includes tests for creating orders and fulfilling orders to ensure the contract functions as expected.
