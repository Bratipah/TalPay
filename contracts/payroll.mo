import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

actor PayrollContract {
    
    // Types
    public type Employee = {
        id: Text;
        principal: Principal;
        name: Text;
        position: Text;
        salary: Nat;
        walletAddress: Text;
        isActive: Bool;
        joinDate: Int;
    };
    
    public type EscrowContract = {
        id: Text;
        title: Text;
        totalAmount: Nat;
        fundedAmount: Nat;
        employeeCount: Nat;
        releaseDate: Int;
        status: EscrowStatus;
        approvals: [Principal];
        requiredApprovals: Nat;
        creator: Principal;
    };
    
    public type EscrowStatus = {
        #Pending;
        #Active;
        #Released;
        #Cancelled;
    };
    
    public type PaymentRecord = {
        id: Text;
        employeeId: Text;
        amount: Nat;
        timestamp: Int;
        escrowId: Text;
        transactionHash: Text;
        status: PaymentStatus;
    };
    
    public type PaymentStatus = {
        #Pending;
        #Completed;
        #Failed;
    };
    
    public type TokenBalance = {
        icpBalance: Nat;
        talPayBalance: Nat;
    };

    public type TokenTransaction = {
        id: Text;
        transactionType: TokenTransactionType;
        amount: Nat;
        fromPrincipal: ?Principal;
        toPrincipal: ?Principal;
        timestamp: Int;
        status: TransactionStatus;
        metadata: ?Text;
    };

    public type TokenTransactionType = {
        #Mint;
        #Burn;
        #Transfer;
        #Convert;
        #FundEscrow;
        #PayrollDistribution;
    };

    public type TransactionStatus = {
        #Pending;
        #Completed;
        #Failed;
    };
    
    // State variables
    private stable var nextEmployeeId: Nat = 1;
    private stable var nextEscrowId: Nat = 1;
    private stable var nextPaymentId: Nat = 1;
    
    private var employees = HashMap.HashMap<Text, Employee>(10, Text.equal, Text.hash);
    private var escrowContracts = HashMap.HashMap<Text, EscrowContract>(10, Text.equal, Text.hash);
    private var paymentRecords = HashMap.HashMap<Text, PaymentRecord>(100, Text.equal, Text.hash);
    private var adminPrincipals = HashMap.HashMap<Principal, Bool>(5, Principal.equal, Principal.hash);
    private var tokenBalances = HashMap.HashMap<Principal, TokenBalance>(50, Principal.equal, Principal.hash);
    private var tokenTransactions = HashMap.HashMap<Text, TokenTransaction>(100, Text.equal, Text.hash);
    private stable var nextTransactionId: Nat = 1;
    private stable var talPayToIcpRate: Nat = 100; // 100 TalPay = 1 ICP
    
    // Initialize with default admin
    private func initializeAdmin() {
        // This would be set to the deployer's principal in production
        let defaultAdmin = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
        adminPrincipals.put(defaultAdmin, true);
    };
    
    // Access control
    private func isAdmin(caller: Principal): Bool {
        switch (adminPrincipals.get(caller)) {
            case (?isAdmin) { isAdmin };
            case null { false };
        }
    };
    
    private func isEmployee(caller: Principal): Bool {
        for ((id, employee) in employees.entries()) {
            if (employee.principal == caller and employee.isActive) {
                return true;
            }
        };
        false
    };
    
    // Employee Management
    public shared(msg) func addEmployee(
        name: Text,
        position: Text,
        salary: Nat,
        walletAddress: Text,
        employeePrincipal: Principal
    ): async Result.Result<Text, Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        let employeeId = "emp_" # Nat.toText(nextEmployeeId);
        nextEmployeeId += 1;
        
        let employee: Employee = {
            id = employeeId;
            principal = employeePrincipal;
            name = name;
            position = position;
            salary = salary;
            walletAddress = walletAddress;
            isActive = true;
            joinDate = Time.now();
        };
        
        employees.put(employeeId, employee);
        #ok(employeeId)
    };
    
    public shared(msg) func updateEmployee(
        employeeId: Text,
        name: ?Text,
        position: ?Text,
        salary: ?Nat,
        walletAddress: ?Text,
        isActive: ?Bool
    ): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        switch (employees.get(employeeId)) {
            case (?employee) {
                let updatedEmployee: Employee = {
                    id = employee.id;
                    principal = employee.principal;
                    name = switch (name) { case (?n) n; case null employee.name };
                    position = switch (position) { case (?p) p; case null employee.position };
                    salary = switch (salary) { case (?s) s; case null employee.salary };
                    walletAddress = switch (walletAddress) { case (?w) w; case null employee.walletAddress };
                    isActive = switch (isActive) { case (?a) a; case null employee.isActive };
                    joinDate = employee.joinDate;
                };
                employees.put(employeeId, updatedEmployee);
                #ok()
            };
            case null {
                #err("Employee not found")
            };
        }
    };
    
    public query func getEmployees(): async [Employee] {
        Iter.toArray(employees.vals())
    };
    
    public query func getEmployee(employeeId: Text): async ?Employee {
        employees.get(employeeId)
    };
    
    // Escrow Management
    public shared(msg) func createEscrowContract(
        title: Text,
        totalAmount: Nat,
        employeeCount: Nat,
        releaseDate: Int,
        requiredApprovals: Nat
    ): async Result.Result<Text, Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        let escrowId = "escrow_" # Nat.toText(nextEscrowId);
        nextEscrowId += 1;
        
        let escrowContract: EscrowContract = {
            id = escrowId;
            title = title;
            totalAmount = totalAmount;
            fundedAmount = 0;
            employeeCount = employeeCount;
            releaseDate = releaseDate;
            status = #Pending;
            approvals = [];
            requiredApprovals = requiredApprovals;
            creator = msg.caller;
        };
        
        escrowContracts.put(escrowId, escrowContract);
        #ok(escrowId)
    };
    
    public shared(msg) func fundEscrowContract(
        escrowId: Text,
        amount: Nat
    ): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        switch (escrowContracts.get(escrowId)) {
            case (?contract) {
                if (contract.fundedAmount + amount > contract.totalAmount) {
                    return #err("Funding amount exceeds total contract amount");
                };
                
                let newFundedAmount = contract.fundedAmount + amount;
                let newStatus = if (newFundedAmount >= contract.totalAmount) {
                    #Active
                } else {
                    contract.status
                };
                
                let updatedContract: EscrowContract = {
                    id = contract.id;
                    title = contract.title;
                    totalAmount = contract.totalAmount;
                    fundedAmount = newFundedAmount;
                    employeeCount = contract.employeeCount;
                    releaseDate = contract.releaseDate;
                    status = newStatus;
                    approvals = contract.approvals;
                    requiredApprovals = contract.requiredApprovals;
                    creator = contract.creator;
                };
                
                escrowContracts.put(escrowId, updatedContract);
                #ok()
            };
            case null {
                #err("Escrow contract not found")
            };
        }
    };
    
    public shared(msg) func approveEscrowRelease(escrowId: Text): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        switch (escrowContracts.get(escrowId)) {
            case (?contract) {
                // Check if already approved by this principal
                let alreadyApproved = Array.find<Principal>(contract.approvals, func(p) = p == msg.caller);
                if (alreadyApproved != null) {
                    return #err("Already approved by this principal");
                };
                
                let newApprovals = Array.append<Principal>(contract.approvals, [msg.caller]);
                
                let updatedContract: EscrowContract = {
                    id = contract.id;
                    title = contract.title;
                    totalAmount = contract.totalAmount;
                    fundedAmount = contract.fundedAmount;
                    employeeCount = contract.employeeCount;
                    releaseDate = contract.releaseDate;
                    status = contract.status;
                    approvals = newApprovals;
                    requiredApprovals = contract.requiredApprovals;
                    creator = contract.creator;
                };
                
                escrowContracts.put(escrowId, updatedContract);
                #ok()
            };
            case null {
                #err("Escrow contract not found")
            };
        }
    };
    
    public shared(msg) func releaseEscrowFunds(escrowId: Text): async Result.Result<[Text], Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        switch (escrowContracts.get(escrowId)) {
            case (?contract) {
                if (contract.status != #Active) {
                    return #err("Contract is not active");
                };
                
                if (contract.approvals.size() < contract.requiredApprovals) {
                    return #err("Insufficient approvals");
                };
                
                if (Time.now() < contract.releaseDate) {
                    return #err("Release date not reached");
                };
                
                // Process batch payments to all active employees
                let paymentIds = await processBatchPayments(escrowId);
                
                // Update contract status
                let updatedContract: EscrowContract = {
                    id = contract.id;
                    title = contract.title;
                    totalAmount = contract.totalAmount;
                    fundedAmount = contract.fundedAmount;
                    employeeCount = contract.employeeCount;
                    releaseDate = contract.releaseDate;
                    status = #Released;
                    approvals = contract.approvals;
                    requiredApprovals = contract.requiredApprovals;
                    creator = contract.creator;
                };
                
                escrowContracts.put(escrowId, updatedContract);
                #ok(paymentIds)
            };
            case null {
                #err("Escrow contract not found")
            };
        }
    };
    
    // Payment Processing
    private func processBatchPayments(escrowId: Text): async [Text] {
        var paymentIds: [Text] = [];
        
        for ((employeeId, employee) in employees.entries()) {
            if (employee.isActive) {
                let paymentId = await createPaymentRecord(employeeId, employee.salary, escrowId);
                paymentIds := Array.append<Text>(paymentIds, [paymentId]);
            }
        };
        
        paymentIds
    };
    
    private func createPaymentRecord(
        employeeId: Text,
        amount: Nat,
        escrowId: Text
    ): async Text {
        let paymentId = "pay_" # Nat.toText(nextPaymentId);
        nextPaymentId += 1;
        
        let payment: PaymentRecord = {
            id = paymentId;
            employeeId = employeeId;
            amount = amount;
            timestamp = Time.now();
            escrowId = escrowId;
            transactionHash = "0x" # paymentId; // Simplified for demo
            status = #Completed;
        };
        
        paymentRecords.put(paymentId, payment);
        paymentId
    };
    
    // Token Management
    public shared(msg) func mintTalPayTokens(amount: Nat): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        let balance = switch (tokenBalances.get(msg.caller)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        let updatedBalance: TokenBalance = {
            icpBalance = balance.icpBalance;
            talPayBalance = balance.talPayBalance + amount;
        };
        
        tokenBalances.put(msg.caller, updatedBalance);
        
        // Record transaction
        let txId = "tx_" # Nat.toText(nextTransactionId);
        nextTransactionId += 1;
        
        let transaction: TokenTransaction = {
            id = txId;
            transactionType = #Mint;
            amount = amount;
            fromPrincipal = null;
            toPrincipal = ?msg.caller;
            timestamp = Time.now();
            status = #Completed;
            metadata = ?"Admin minted TalPay tokens";
        };
        
        tokenTransactions.put(txId, transaction);
        
        #ok()
    };

    public shared(msg) func convertIcpToTalPay(icpAmount: Nat): async Result.Result<(), Text> {
        let balance = switch (tokenBalances.get(msg.caller)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        if (balance.icpBalance < icpAmount) {
            return #err("Insufficient ICP balance");
        };
        
        let talPayAmount = icpAmount * talPayToIcpRate;
        
        let updatedBalance: TokenBalance = {
            icpBalance = balance.icpBalance - icpAmount;
            talPayBalance = balance.talPayBalance + talPayAmount;
        };
        
        tokenBalances.put(msg.caller, updatedBalance);
        
        // Record transaction
        let txId = "tx_" # Nat.toText(nextTransactionId);
        nextTransactionId += 1;
        
        let transaction: TokenTransaction = {
            id = txId;
            transactionType = #Convert;
            amount = icpAmount;
            fromPrincipal = ?msg.caller;
            toPrincipal = ?msg.caller;
            timestamp = Time.now();
            status = #Completed;
            metadata = ?"Converted ICP to TalPay";
        };
        
        tokenTransactions.put(txId, transaction);
        
        #ok()
    };

    public shared(msg) func convertTalPayToIcp(talPayAmount: Nat): async Result.Result<(), Text> {
        let balance = switch (tokenBalances.get(msg.caller)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        if (balance.talPayBalance < talPayAmount) {
            return #err("Insufficient TalPay balance");
        };
        
        let icpAmount = talPayAmount / talPayToIcpRate;
        
        let updatedBalance: TokenBalance = {
            icpBalance = balance.icpBalance + icpAmount;
            talPayBalance = balance.talPayBalance - talPayAmount;
        };
        
        tokenBalances.put(msg.caller, updatedBalance);
        
        // Record transaction
        let txId = "tx_" # Nat.toText(nextTransactionId);
        nextTransactionId += 1;
        
        let transaction: TokenTransaction = {
            id = txId;
            transactionType = #Convert;
            amount = talPayAmount;
            fromPrincipal = ?msg.caller;
            toPrincipal = ?msg.caller;
            timestamp = Time.now();
            status = #Completed;
            metadata = ?"Converted TalPay to ICP";
        };
        
        tokenTransactions.put(txId, transaction);
        
        #ok()
    };

    public shared(msg) func transferTalPay(to: Principal, amount: Nat): async Result.Result<(), Text> {
        let fromBalance = switch (tokenBalances.get(msg.caller)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        if (fromBalance.talPayBalance < amount) {
            return #err("Insufficient TalPay balance");
        };
        
        let toBalance = switch (tokenBalances.get(to)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        let updatedFromBalance: TokenBalance = {
            icpBalance = fromBalance.icpBalance;
            talPayBalance = fromBalance.talPayBalance - amount;
        };
        
        let updatedToBalance: TokenBalance = {
            icpBalance = toBalance.icpBalance;
            talPayBalance = toBalance.talPayBalance + amount;
        };
        
        tokenBalances.put(msg.caller, updatedFromBalance);
        tokenBalances.put(to, updatedToBalance);
        
        // Record transaction
        let txId = "tx_" # Nat.toText(nextTransactionId);
        nextTransactionId += 1;
        
        let transaction: TokenTransaction = {
            id = txId;
            transactionType = #Transfer;
            amount = amount;
            fromPrincipal = ?msg.caller;
            toPrincipal = ?to;
            timestamp = Time.now();
            status = #Completed;
            metadata = ?"TalPay transfer";
        };
        
        tokenTransactions.put(txId, transaction);
        
        #ok()
    };

    public shared(msg) func fundEscrowWithTalPay(escrowId: Text, amount: Nat): async Result.Result<(), Text> {
        let balance = switch (tokenBalances.get(msg.caller)) {
            case (?bal) bal;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        };
        
        if (balance.talPayBalance < amount) {
            return #err("Insufficient TalPay balance");
        };
        
        switch (escrowContracts.get(escrowId)) {
            case (?contract) {
                if (contract.fundedAmount + amount > contract.totalAmount) {
                    return #err("Funding amount exceeds total contract amount");
                };
                
                let newFundedAmount = contract.fundedAmount + amount;
                let newStatus = if (newFundedAmount >= contract.totalAmount) {
                    #Active
                } else {
                    contract.status
                };
                
                let updatedContract: EscrowContract = {
                    id = contract.id;
                    title = contract.title;
                    totalAmount = contract.totalAmount;
                    fundedAmount = newFundedAmount;
                    employeeCount = contract.employeeCount;
                    releaseDate = contract.releaseDate;
                    status = newStatus;
                    approvals = contract.approvals;
                    requiredApprovals = contract.requiredApprovals;
                    creator = contract.creator;
                };
                
                escrowContracts.put(escrowId, updatedContract);
                
                // Update user's balance
                let updatedBalance: TokenBalance = {
                    icpBalance = balance.icpBalance;
                    talPayBalance = balance.talPayBalance - amount;
                };
                
                tokenBalances.put(msg.caller, updatedBalance);
                
                // Record transaction
                let txId = "tx_" # Nat.toText(nextTransactionId);
                nextTransactionId += 1;
                
                let transaction: TokenTransaction = {
                    id = txId;
                    transactionType = #FundEscrow;
                    amount = amount;
                    fromPrincipal = ?msg.caller;
                    toPrincipal = null;
                    timestamp = Time.now();
                    status = #Completed;
                    metadata = ?("Funded escrow contract: " # escrowId);
                };
                
                tokenTransactions.put(txId, transaction);
                
                #ok()
            };
            case null {
                #err("Escrow contract not found")
            };
        }
    };

    // Query functions for token management
    public query func getTokenBalance(principal: Principal): async TokenBalance {
        switch (tokenBalances.get(principal)) {
            case (?balance) balance;
            case null { { icpBalance = 0; talPayBalance = 0 } };
        }
    };

    public query func getTokenTransactions(principal: Principal): async [TokenTransaction] {
        let allTransactions = Iter.toArray(tokenTransactions.vals());
        Array.filter<TokenTransaction>(
            allTransactions, 
            func(tx) = 
                switch (tx.fromPrincipal) {
                    case (?from) { from == principal };
                    case null { false };
                } or 
                switch (tx.toPrincipal) {
                    case (?to) { to == principal };
                    case null { false };
                }
        )
    };

    public query func getTalPayToIcpRate(): async Nat {
        talPayToIcpRate
    };

    public shared(msg) func setTalPayToIcpRate(newRate: Nat): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        talPayToIcpRate := newRate;
        #ok()
    };
    
    // Query functions
    public query func getEscrowContracts(): async [EscrowContract] {
        Iter.toArray(escrowContracts.vals())
    };
    
    public query func getEscrowContract(escrowId: Text): async ?EscrowContract {
        escrowContracts.get(escrowId)
    };
    
    public query func getPaymentRecords(): async [PaymentRecord] {
        Iter.toArray(paymentRecords.vals())
    };
    
    public query func getEmployeePayments(employeeId: Text): async [PaymentRecord] {
        let allPayments = Iter.toArray(paymentRecords.vals());
        Array.filter<PaymentRecord>(allPayments, func(payment) = payment.employeeId == employeeId)
    };
    
    // Admin management
    public shared(msg) func addAdmin(newAdmin: Principal): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        adminPrincipals.put(newAdmin, true);
        #ok()
    };
    
    public shared(msg) func removeAdmin(adminToRemove: Principal): async Result.Result<(), Text> {
        if (not isAdmin(msg.caller)) {
            return #err("Access denied: Admin privileges required");
        };
        
        adminPrincipals.delete(adminToRemove);
        #ok()
    };
    
    // System info
    public query func getSystemStats(): async {
        totalEmployees: Nat;
        activeEmployees: Nat;
        totalEscrowContracts: Nat;
        activeEscrowContracts: Nat;
        totalPayments: Nat;
        totalTalPayCirculation: Nat;
    } {
        let allEmployees = Iter.toArray(employees.vals());
        let activeEmployees = Array.filter<Employee>(allEmployees, func(emp) = emp.isActive);
        
        let allContracts = Iter.toArray(escrowContracts.vals());
        let activeContracts = Array.filter<EscrowContract>(allContracts, func(contract) = contract.status == #Active);
        
        // Calculate total TalPay in circulation
        var totalTalPay: Nat = 0;
        for ((_, balance) in tokenBalances.entries()) {
            totalTalPay += balance.talPayBalance;
        };
        
        {
            totalEmployees = allEmployees.size();
            activeEmployees = activeEmployees.size();
            totalEscrowContracts = allContracts.size();
            activeEscrowContracts = activeContracts.size();
            totalPayments = Iter.toArray(paymentRecords.vals()).size();
            totalTalPayCirculation = totalTalPay;
        }
    };
    
    // Initialize the contract
    system func preupgrade() {
        // Stable variable handling for upgrades
    };
    
    system func postupgrade() {
        initializeAdmin();
    };
}
