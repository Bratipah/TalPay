## TalPay
A payroll Management system for Talanta AI for ease of hiring recruiting and rentention
## Features 

### 1. TalPay Token Implementation

- Added a dedicated TalPay token system for payroll operations
- Implemented token conversion between ICP and TalPay (100 TPY = 1 ICP)
- Created a token management dashboard with balance display and transaction history
- Added functionality to fund from wallet in ICP tokens


### 2. Enhanced Employee Management

- Implemented full CRUD operations for employee records
- Added an edit dialog to modify employee details
- Added a confirmation dialog for employee deletion
- Improved the employee listing with more detailed information


### 3. Smart Contract Enhancements

- Added token management functions in the Motoko contract
- Implemented token balance tracking for all users
- Created transaction history for all token operations
- Added escrow funding with TalPay tokens


### 4. Wallet Integration

- Added direct funding from ICP wallet
- Implemented token conversion between ICP and TalPay
- Enhanced the escrow funding process to support both token types

### 5. **DeFi Features**

- **Smart Contract Escrow**: Automated fund management with multi-sig security
- **Transparent Payments**: All transactions recorded on-chain
- **Gas Optimization**: Batch processing reduces transaction costs
- **Audit Trail**: Complete payment history for compliance


## Technical Implementation

The system now uses a dual-token approach where:

1. ICP tokens are used for external transactions and wallet operations
2. TalPay tokens (TPY) are used for internal payroll management
3. Users can convert between the two tokens at a fixed rate (100 TPY = 1 ICP)

### **Smart Contract (Motoko)**

- **Escrow Management**: Multi-signature escrow contracts with approval workflows
- **Employee Management**: Complete CRUD operations for workforce management
- **Batch Payments**: Efficient processing of large-scale payroll distributions
- **Access Control**: Role-based permissions for admins and employees
- **Payment Records**: Comprehensive transaction history and audit trails
