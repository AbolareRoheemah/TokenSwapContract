// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OrderBasedSwap {
    using SafeERC20 for IERC20;

    struct Order {
        uint orderId;
        address seller;
        address tokenToSell;
        uint256 amountToSell;
        address tokenToBuy;
        uint256 amountToBuy;
    }

    Order[] public orders;
    mapping(uint256 => bool) public orderFulfilled;

    event OrderCreated(uint256 indexed orderId, address indexed seller, address tokenToSell, uint256 amountToSell, address tokenToBuy, uint256 amountToBuy);
    event OrderFulfilled(uint256 indexed orderId, address indexed buyer);

    function createOrder(address _tokenToSell, uint256 _amountToSell, address _tokenToBuy, uint256 _amountToBuy) external {
        require(_tokenToSell != address(0), "Invalid token addresses");
        require(_tokenToBuy != address(0), "Invalid token addresses");
        require(_amountToSell > 0, "Invalid amounts");
        require(_amountToBuy > 0, "Invalid amounts");
        require(IERC20(_tokenToSell).balanceOf(msg.sender) >= _amountToSell, "insufficient balance");

        IERC20(_tokenToSell).safeTransferFrom(msg.sender, address(this), _amountToSell);

        orders.push(Order({
            orderId: orders.length,
            seller: msg.sender,
            tokenToSell: _tokenToSell,
            amountToSell: _amountToSell,
            tokenToBuy: _tokenToBuy,
            amountToBuy: _amountToBuy
        }));

        emit OrderCreated(orders.length - 1, msg.sender, _tokenToSell, _amountToSell, _tokenToBuy, _amountToBuy);
    }

    function fulfillOrder(uint256 _orderId) external {
        require(_orderId < orders.length, "Invalid order ID");
        require(!orderFulfilled[_orderId], "Order already fulfilled");

        Order storage order = orders[_orderId];

        require(IERC20(order.tokenToBuy).balanceOf(msg.sender) >= order.amountToBuy, "insufficient balance");

        IERC20(order.tokenToBuy).safeTransferFrom(msg.sender, order.seller, order.amountToBuy);
        IERC20(order.tokenToSell).safeTransfer(msg.sender, order.amountToSell);

        orderFulfilled[_orderId] = true;

        emit OrderFulfilled(_orderId, msg.sender);
    }

    function getOrdersCount() external view returns (uint256) {
        return orders.length;
    }
}