# CampusOps

CampusOps is a hybrid campus facility management platform designed to streamline daily operations and ensure secure, transparent handling of high-value transactions.

## Live Demo
Check out the live demo here: [CampusOps Demo](https://drive.google.com/file/d/1WKSwV3yG8THq9Q_Sq8AotkDTDvFzbDCu/view?usp=drive_link)

## Project Architecture

CampusOps utilizes a **Hybrid Architecture**:
- **Centralized Database (Supabase)**: Handles daily operations such as student reporting, worker job queues, upvotes, live tracking, and notices to ensure ultra-fast response times.
- **Decentralized Smart Contracts**: Manages high-value security logs and financial vendor Purchase Order (PO) escrow payments for immutability and transparency.

## Features
- **Role-Based Access Control**: Supports different roles including Student, Faculty, Facility Worker, and Estate Admin.
- **Fast CRUD Operations**: Efficient handling of tickets, upvote counters, and notice board broadcasts.
- **Blockchain Bridge**: Bridges centralized Supabase database events to decentralized smart contracts using `ethers.js`.
- **Immutable Hazard Logs**: Checkpoints recorded via `TrustChainAudit.sol`.
- **Vendor Escrow**: Outside vendor purchase order fund management via `VendorEscrow.sol`.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS
- **Backend**: Node.js, Express
- **Database & Authentication**: Supabase (PostgreSQL + Supabase Auth)
- **Blockchain**: Solidity, Hardhat, Ethers.js

## Folder Structure
- `client/`: Contains Frontend HTML UI files and Tailwind CSS configuration.
- `server/`: Contains Node.js backend setup, API routes, controllers, and middleware (including Supabase client config and RBAC).
- `smart-contracts/`: Contains Hardhat environment and Solidity contracts for Escrow and Audit logging.
