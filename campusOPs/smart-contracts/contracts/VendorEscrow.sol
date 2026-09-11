// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VendorEscrow {
    address public admin;

    struct PurchaseOrder {
        uint256 poId;
        address payable vendor;
        uint256 amount;
        bool isApproved;
        bool isPaid;
    }

    mapping(uint256 => PurchaseOrder) public purchaseOrders;

    event POCreated(uint256 indexed poId, address indexed vendor, uint256 amount);
    event POApproved(uint256 indexed poId);
    event POPaid(uint256 indexed poId, address indexed vendor, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createPO(uint256 _poId, address payable _vendor) external payable onlyAdmin {
        require(purchaseOrders[_poId].vendor == address(0), "PO already exists");
        require(msg.value > 0, "Amount must be greater than 0");

        purchaseOrders[_poId] = PurchaseOrder({
            poId: _poId,
            vendor: _vendor,
            amount: msg.value,
            isApproved: false,
            isPaid: false
        });

        emit POCreated(_poId, _vendor, msg.value);
    }

    function approvePO(uint256 _poId) external onlyAdmin {
        PurchaseOrder storage po = purchaseOrders[_poId];
        require(po.vendor != address(0), "PO does not exist");
        require(!po.isApproved, "PO already approved");
        
        po.isApproved = true;
        emit POApproved(_poId);
    }

    function payVendor(uint256 _poId) external onlyAdmin {
        PurchaseOrder storage po = purchaseOrders[_poId];
        require(po.isApproved, "PO not approved");
        require(!po.isPaid, "PO already paid");

        po.isPaid = true;
        (bool success, ) = po.vendor.call{value: po.amount}("");
        require(success, "Transfer failed");

        emit POPaid(_poId, po.vendor, po.amount);
    }
}
