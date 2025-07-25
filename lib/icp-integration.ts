import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import type { Principal } from "@dfinity/principal"

// Types matching the Motoko contract
export interface Employee {
  id: string
  principal: Principal
  name: string
  position: string
  salary: bigint
  walletAddress: string
  isActive: boolean
  joinDate: bigint
}

export interface EscrowContract {
  id: string
  title: string
  totalAmount: bigint
  fundedAmount: bigint
  employeeCount: bigint
  releaseDate: bigint
  status: EscrowStatus
  approvals: Principal[]
  requiredApprovals: bigint
  creator: Principal
}

export type EscrowStatus = { Pending: null } | { Active: null } | { Released: null } | { Cancelled: null }

export interface PaymentRecord {
  id: string
  employeeId: string
  amount: bigint
  timestamp: bigint
  escrowId: string
  transactionHash: string
  status: PaymentStatus
}

export type PaymentStatus = { Pending: null } | { Completed: null } | { Failed: null }

export interface TokenBalance {
  icpBalance: bigint
  talPayBalance: bigint
}

export interface TokenTransaction {
  id: string
  transactionType: TokenTransactionType
  amount: bigint
  fromPrincipal: Principal | null
  toPrincipal: Principal | null
  timestamp: bigint
  status: TransactionStatus
  metadata: string | null
}

export type TokenTransactionType =
  | { Mint: null }
  | { Burn: null }
  | { Transfer: null }
  | { Convert: null }
  | { FundEscrow: null }
  | { PayrollDistribution: null }

export type TransactionStatus = { Pending: null } | { Completed: null } | { Failed: null }

// IDL Factory for the payroll contract
export const idlFactory = ({ IDL }: any) => {
  const Employee = IDL.Record({
    id: IDL.Text,
    principal: IDL.Principal,
    name: IDL.Text,
    position: IDL.Text,
    salary: IDL.Nat,
    walletAddress: IDL.Text,
    isActive: IDL.Bool,
    joinDate: IDL.Int,
  })

  const EscrowStatus = IDL.Variant({
    Pending: IDL.Null,
    Active: IDL.Null,
    Released: IDL.Null,
    Cancelled: IDL.Null,
  })

  const EscrowContract = IDL.Record({
    id: IDL.Text,
    title: IDL.Text,
    totalAmount: IDL.Nat,
    fundedAmount: IDL.Nat,
    employeeCount: IDL.Nat,
    releaseDate: IDL.Int,
    status: EscrowStatus,
    approvals: IDL.Vec(IDL.Principal),
    requiredApprovals: IDL.Nat,
    creator: IDL.Principal,
  })

  const PaymentStatus = IDL.Variant({
    Pending: IDL.Null,
    Completed: IDL.Null,
    Failed: IDL.Null,
  })

  const PaymentRecord = IDL.Record({
    id: IDL.Text,
    employeeId: IDL.Text,
    amount: IDL.Nat,
    timestamp: IDL.Int,
    escrowId: IDL.Text,
    transactionHash: IDL.Text,
    status: PaymentStatus,
  })

  const Result = IDL.Variant({
    ok: IDL.Text,
    err: IDL.Text,
  })

  const ResultVoid = IDL.Variant({
    ok: IDL.Null,
    err: IDL.Text,
  })

  const ResultPayments = IDL.Variant({
    ok: IDL.Vec(IDL.Text),
    err: IDL.Text,
  })

  return IDL.Service({
    // Employee Management
    addEmployee: IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Principal], [Result], []),
    updateEmployee: IDL.Func(
      [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat), IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
      [ResultVoid],
      [],
    ),
    getEmployees: IDL.Func([], [IDL.Vec(Employee)], ["query"]),
    getEmployee: IDL.Func([IDL.Text], [IDL.Opt(Employee)], ["query"]),

    // Escrow Management
    createEscrowContract: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat, IDL.Int, IDL.Nat], [Result], []),
    fundEscrowContract: IDL.Func([IDL.Text, IDL.Nat], [ResultVoid], []),
    approveEscrowRelease: IDL.Func([IDL.Text], [ResultVoid], []),
    releaseEscrowFunds: IDL.Func([IDL.Text], [ResultPayments], []),
    getEscrowContracts: IDL.Func([], [IDL.Vec(EscrowContract)], ["query"]),
    getEscrowContract: IDL.Func([IDL.Text], [IDL.Opt(EscrowContract)], ["query"]),

    // Payment Records
    getPaymentRecords: IDL.Func([], [IDL.Vec(PaymentRecord)], ["query"]),
    getEmployeePayments: IDL.Func([IDL.Text], [IDL.Vec(PaymentRecord)], ["query"]),

    // Admin Management
    addAdmin: IDL.Func([IDL.Principal], [ResultVoid], []),
    removeAdmin: IDL.Func([IDL.Principal], [ResultVoid], []),

    // Token Management
    mintTalPayTokens: IDL.Func([IDL.Nat], [ResultVoid], []),
    convertIcpToTalPay: IDL.Func([IDL.Nat], [ResultVoid], []),
    convertTalPayToIcp: IDL.Func([IDL.Nat], [ResultVoid], []),
    transferTalPay: IDL.Func([IDL.Principal, IDL.Nat], [ResultVoid], []),
    fundEscrowWithTalPay: IDL.Func([IDL.Text, IDL.Nat], [ResultVoid], []),
    getTokenBalance: IDL.Func(
      [IDL.Principal],
      [
        IDL.Record({
          icpBalance: IDL.Nat,
          talPayBalance: IDL.Nat,
        }),
      ],
      ["query"],
    ),
    getTokenTransactions: IDL.Func(
      [IDL.Principal],
      [
        IDL.Vec(
          IDL.Record({
            id: IDL.Text,
            transactionType: IDL.Variant({
              Mint: IDL.Null,
              Burn: IDL.Null,
              Transfer: IDL.Null,
              Convert: IDL.Null,
              FundEscrow: IDL.Null,
              PayrollDistribution: IDL.Null,
            }),
            amount: IDL.Nat,
            fromPrincipal: IDL.Opt(IDL.Principal),
            toPrincipal: IDL.Opt(IDL.Principal),
            timestamp: IDL.Int,
            status: IDL.Variant({
              Pending: IDL.Null,
              Completed: IDL.Null,
              Failed: IDL.Null,
            }),
            metadata: IDL.Opt(IDL.Text),
          }),
        ),
      ],
      ["query"],
    ),
    getTalPayToIcpRate: IDL.Func([], [IDL.Nat], ["query"]),
    setTalPayToIcpRate: IDL.Func([IDL.Nat], [ResultVoid], []),

    // System Stats
    getSystemStats: IDL.Func(
      [],
      [
        IDL.Record({
          totalEmployees: IDL.Nat,
          activeEmployees: IDL.Nat,
          totalEscrowContracts: IDL.Nat,
          activeEscrowContracts: IDL.Nat,
          totalPayments: IDL.Nat,
          totalTalPayCirculation: IDL.Opt(IDL.Nat),
        }),
      ],
      ["query"],
    ),
  })
}

// ICP Integration Class
export class ICPPayrollService {
  private actor: any
  private authClient: AuthClient | null = null
  private agent: HttpAgent | null = null

  constructor(private canisterId: string) {}

  async initialize() {
    this.authClient = await AuthClient.create()

    if (process.env.NODE_ENV === "development") {
      this.agent = new HttpAgent({ host: "http://localhost:4943" })
      await this.agent?.fetchRootKey()
    } else {
      this.agent = new HttpAgent({ host: "https://ic0.app" })
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: this.canisterId,
    })
  }

  async login(): Promise<boolean> {
    if (!this.authClient) return false

    return new Promise((resolve) => {
      this.authClient!.login({
        identityProvider:
          process.env.NODE_ENV === "development"
            ? `http://localhost:4943/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`
            : "https://identity.ic0.app",
        onSuccess: () => {
          this.updateActor()
          resolve(true)
        },
        onError: () => resolve(false),
      })
    })
  }

  async logout() {
    await this.authClient?.logout()
    this.updateActor()
  }

  private updateActor() {
    const identity = this.authClient?.getIdentity()
    this.agent = new HttpAgent({
      identity,
      host: process.env.NODE_ENV === "development" ? "http://localhost:4943" : "https://ic0.app",
    })

    if (process.env.NODE_ENV === "development") {
      this.agent.fetchRootKey()
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: this.canisterId,
    })
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.authClient?.isAuthenticated()) ?? false
  }

  async getPrincipal(): Promise<Principal | null> {
    const identity = this.authClient?.getIdentity()
    return identity?.getPrincipal() ?? null
  }

  // Employee Management Methods
  async addEmployee(
    name: string,
    position: string,
    salary: number,
    walletAddress: string,
    employeePrincipal: Principal,
  ): Promise<{ ok?: string; err?: string }> {
    try {
      return await this.actor.addEmployee(name, position, BigInt(salary), walletAddress, employeePrincipal)
    } catch (error) {
      return { err: `Failed to add employee: ${error}` }
    }
  }

  async getEmployees(): Promise<Employee[]> {
    try {
      return await this.actor.getEmployees()
    } catch (error) {
      console.error("Failed to get employees:", error)
      return []
    }
  }

  async updateEmployee(
    employeeId: string,
    updates: {
      name?: string
      position?: string
      salary?: number
      walletAddress?: string
      isActive?: boolean
    },
  ): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.updateEmployee(
        employeeId,
        updates.name ? [updates.name] : [],
        updates.position ? [updates.position] : [],
        updates.salary ? [BigInt(updates.salary)] : [],
        updates.walletAddress ? [updates.walletAddress] : [],
        updates.isActive !== undefined ? [updates.isActive] : [],
      )
    } catch (error) {
      return { err: `Failed to update employee: ${error}` }
    }
  }

  // Escrow Management Methods
  async createEscrowContract(
    title: string,
    totalAmount: number,
    employeeCount: number,
    releaseDate: Date,
    requiredApprovals: number,
  ): Promise<{ ok?: string; err?: string }> {
    try {
      return await this.actor.createEscrowContract(
        title,
        BigInt(totalAmount),
        BigInt(employeeCount),
        BigInt(releaseDate.getTime() * 1000000), // Convert to nanoseconds
        BigInt(requiredApprovals),
      )
    } catch (error) {
      return { err: `Failed to create escrow contract: ${error}` }
    }
  }

  async fundEscrowContract(escrowId: string, amount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.fundEscrowContract(escrowId, BigInt(amount))
    } catch (error) {
      return { err: `Failed to fund escrow contract: ${error}` }
    }
  }

  async approveEscrowRelease(escrowId: string): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.approveEscrowRelease(escrowId)
    } catch (error) {
      return { err: `Failed to approve escrow release: ${error}` }
    }
  }

  async releaseEscrowFunds(escrowId: string): Promise<{ ok?: string[]; err?: string }> {
    try {
      return await this.actor.releaseEscrowFunds(escrowId)
    } catch (error) {
      return { err: `Failed to release escrow funds: ${error}` }
    }
  }

  async getEscrowContracts(): Promise<EscrowContract[]> {
    try {
      return await this.actor.getEscrowContracts()
    } catch (error) {
      console.error("Failed to get escrow contracts:", error)
      return []
    }
  }

  // Payment Methods
  async getPaymentRecords(): Promise<PaymentRecord[]> {
    try {
      return await this.actor.getPaymentRecords()
    } catch (error) {
      console.error("Failed to get payment records:", error)
      return []
    }
  }

  async getEmployeePayments(employeeId: string): Promise<PaymentRecord[]> {
    try {
      return await this.actor.getEmployeePayments(employeeId)
    } catch (error) {
      console.error("Failed to get employee payments:", error)
      return []
    }
  }

  // Token Management Methods
  async getTokenBalance(principal?: Principal): Promise<{ icpBalance: number; talPayBalance: number }> {
    try {
      const userPrincipal = principal || (await this.getPrincipal())
      if (!userPrincipal) return { icpBalance: 0, talPayBalance: 0 }

      const balance = await this.actor.getTokenBalance(userPrincipal)
      return {
        icpBalance: Number(balance.icpBalance),
        talPayBalance: Number(balance.talPayBalance),
      }
    } catch (error) {
      console.error("Failed to get token balance:", error)
      return { icpBalance: 0, talPayBalance: 0 }
    }
  }

  async mintTalPayTokens(amount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.mintTalPayTokens(BigInt(amount))
    } catch (error) {
      return { err: `Failed to mint TalPay tokens: ${error}` }
    }
  }

  async convertIcpToTalPay(icpAmount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.convertIcpToTalPay(BigInt(icpAmount))
    } catch (error) {
      return { err: `Failed to convert ICP to TalPay: ${error}` }
    }
  }

  async convertTalPayToIcp(talPayAmount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.convertTalPayToIcp(BigInt(talPayAmount))
    } catch (error) {
      return { err: `Failed to convert TalPay to ICP: ${error}` }
    }
  }

  async transferTalPay(to: Principal, amount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.transferTalPay(to, BigInt(amount))
    } catch (error) {
      return { err: `Failed to transfer TalPay: ${error}` }
    }
  }

  async fundEscrowWithTalPay(escrowId: string, amount: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.fundEscrowWithTalPay(escrowId, BigInt(amount))
    } catch (error) {
      return { err: `Failed to fund escrow with TalPay: ${error}` }
    }
  }

  async getTokenTransactions(): Promise<TokenTransaction[]> {
    try {
      const principal = await this.getPrincipal()
      if (!principal) return []

      return await this.actor.getTokenTransactions(principal)
    } catch (error) {
      console.error("Failed to get token transactions:", error)
      return []
    }
  }

  async getTalPayToIcpRate(): Promise<number> {
    try {
      const rate = await this.actor.getTalPayToIcpRate()
      return Number(rate)
    } catch (error) {
      console.error("Failed to get TalPay to ICP rate:", error)
      return 100 // Default rate
    }
  }

  async setTalPayToIcpRate(newRate: number): Promise<{ ok?: null; err?: string }> {
    try {
      return await this.actor.setTalPayToIcpRate(BigInt(newRate))
    } catch (error) {
      return { err: `Failed to set TalPay to ICP rate: ${error}` }
    }
  }

  // System Stats
  async getSystemStats(): Promise<{
    totalEmployees: number
    activeEmployees: number
    totalEscrowContracts: number
    activeEscrowContracts: number
    totalPayments: number
    totalTalPayCirculation: number
  }> {
    try {
      const stats = await this.actor.getSystemStats()
      return {
        totalEmployees: Number(stats.totalEmployees),
        activeEmployees: Number(stats.activeEmployees),
        totalEscrowContracts: Number(stats.totalEscrowContracts),
        activeEscrowContracts: Number(stats.activeEscrowContracts),
        totalPayments: Number(stats.totalPayments),
        totalTalPayCirculation: Number((stats as any).totalTalPayCirculation || 0),
      }
    } catch (error) {
      console.error("Failed to get system stats:", error)
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        totalEscrowContracts: 0,
        activeEscrowContracts: 0,
        totalPayments: 0,
        totalTalPayCirculation: 0,
      }
    }
  }
}

// Singleton instance
export const icpPayrollService = new ICPPayrollService(
  process.env.NEXT_PUBLIC_PAYROLL_CANISTER_ID || "rdmx6-jaaaa-aaaah-qcaiq-cai",
)
