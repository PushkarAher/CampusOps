// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TrustChainAudit {
    address public auditor;

    struct HazardLog {
        uint256 ticketId;
        string detailsCID; // IPFS CID for extended details
        uint256 timestamp;
    }

    mapping(uint256 => HazardLog) public hazardLogs;

    event HazardLogged(uint256 indexed ticketId, string detailsCID, uint256 timestamp);

    modifier onlyAuditor() {
        require(msg.sender == auditor, "Only auditor can call this");
        _;
    }

    constructor() {
        auditor = msg.sender;
    }

    function logHazard(uint256 _ticketId, string calldata _detailsCID) external onlyAuditor {
        require(hazardLogs[_ticketId].timestamp == 0, "Hazard already logged");

        hazardLogs[_ticketId] = HazardLog({
            ticketId: _ticketId,
            detailsCID: _detailsCID,
            timestamp: block.timestamp
        });

        emit HazardLogged(_ticketId, _detailsCID, block.timestamp);
    }

    function getHazardLog(uint256 _ticketId) external view returns (HazardLog memory) {
        return hazardLogs[_ticketId];
    }
}
