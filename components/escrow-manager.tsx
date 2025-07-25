"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Shield, Plus, Send, Clock, CheckCircle, AlertCircle, Users, Calendar, Lock } from "lucide-react"

interface EscrowContract {
  id: string
  title: string
  totalAmount: number
  fundedAmount: number
  employeeCount: number
  releaseDate: string
  status: "active" | "pending" | "released" | "cancelled"
  approvals: number
  requiredApprovals: number
}

interface EscrowManagerProps {
  userRole: "admin" | "employee" | null
}

export function EscrowManager({ userRole }: EscrowManagerProps) {
  const [escrowContracts, setEscrowContracts] = useState<EscrowContract[]>([
    {
      id: "1",
      title: "January 2024 Payroll",
      totalAmount: 1284500,
      fundedAmount: 1284500,
      employeeCount: 247,
      releaseDate: "2024-01-31",
      status: "released",
      approvals: 3,
      requiredApprovals: 3,
    },
    {
      id: "2",
      title: "February 2024 Payroll",
      totalAmount: 1320000,
      fundedAmount: 1156800,
      employeeCount: 252,
      releaseDate: "2024-02-29",
      status: "active",
      approvals: 2,
      requiredApprovals: 3,
    },
    {
      id: "3",
      title: "March 2024 Payroll",
      totalAmount: 1350000,
      fundedAmount: 0,
      employeeCount: 255,
      releaseDate: "2024-03-31",
      status: "pending",
      approvals: 0,
      requiredApprovals: 3,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState("")

  const [newContract, setNewContract] = useState({
    title: "",
    totalAmount: "",
    employeeCount: "",
    releaseDate: "",
  })

  const handleCreateContract = () => {
    const contract: EscrowContract = {
      id: Date.now().toString(),
      title: newContract.title,
      totalAmount: Number.parseInt(newContract.totalAmount),
      fundedAmount: 0,
      employeeCount: Number.parseInt(newContract.employeeCount),
      releaseDate: newContract.releaseDate,
      status: "pending",
      approvals: 0,
      requiredApprovals: 3,
    }

    setEscrowContracts([...escrowContracts, contract])
    setNewContract({
      title: "",
      totalAmount: "",
      employeeCount: "",
      releaseDate: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleFundContract = () => {
    if (selectedContract && fundAmount) {
      setEscrowContracts((contracts) =>
        contracts.map((contract) =>
          contract.id === selectedContract
            ? {
                ...contract,
                fundedAmount: Math.min(contract.fundedAmount + Number.parseInt(fundAmount), contract.totalAmount),
                status:
                  contract.fundedAmount + Number.parseInt(fundAmount) >= contract.totalAmount
                    ? "active"
                    : contract.status,
              }
            : contract,
        ),
      )
      setFundAmount("")
      setIsFundDialogOpen(false)
      setSelectedContract(null)
    }
  }

  if (userRole === "employee") {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Access Restricted</CardTitle>
          <CardDescription className="text-slate-300">
            Escrow management is only available to administrators.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Escrow Management</h2>
          <p className="text-slate-400">Manage smart contract escrow for secure payroll processing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Escrow
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Escrow Contract</DialogTitle>
              <DialogDescription className="text-slate-300">
                Set up a new escrow contract for upcoming payroll cycle.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">
                  Contract Title
                </Label>
                <Input
                  id="title"
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., March 2024 Payroll"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-slate-300">
                  Total Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newContract.totalAmount}
                  onChange={(e) => setNewContract({ ...newContract, totalAmount: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter total payroll amount"
                />
              </div>
              <div>
                <Label htmlFor="employees" className="text-slate-300">
                  Employee Count
                </Label>
                <Input
                  id="employees"
                  type="number"
                  value={newContract.employeeCount}
                  onChange={(e) => setNewContract({ ...newContract, employeeCount: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Number of employees"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-slate-300">
                  Release Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newContract.releaseDate}
                  onChange={(e) => setNewContract({ ...newContract, releaseDate: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleCreateContract}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create Escrow Contract
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Escrowed</p>
                <p className="text-2xl font-bold text-white">$2.44M</p>
              </div>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Contracts</p>
                <p className="text-2xl font-bold text-white">
                  {escrowContracts.filter((c) => c.status === "active").length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Release</p>
                <p className="text-2xl font-bold text-white">$1.32M</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">100%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Contracts */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Escrow Contracts
          </CardTitle>
          <CardDescription className="text-slate-300">
            Manage smart contract escrow for secure payroll processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escrowContracts.map((contract) => (
              <div key={contract.id} className="p-6 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{contract.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{contract.employeeCount} employees</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Release: {new Date(contract.releaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      contract.status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : contract.status === "pending"
                          ? "bg-orange-500/20 text-orange-300"
                          : contract.status === "released"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-red-500/20 text-red-300"
                    }
                  >
                    {contract.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Funding Progress</span>
                      <span className="text-white">
                        ${contract.fundedAmount.toLocaleString()} / ${contract.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(contract.fundedAmount / contract.totalAmount) * 100} className="h-2" />
                  </div>

                  {/* Approval Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Approvals</span>
                      <span className="text-white">
                        {contract.approvals} / {contract.requiredApprovals}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: contract.requiredApprovals }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded ${
                            index < contract.approvals ? "bg-green-400" : "bg-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    {contract.fundedAmount < contract.totalAmount && (
                      <Dialog
                        open={isFundDialogOpen && selectedContract === contract.id}
                        onOpenChange={(open) => {
                          setIsFundDialogOpen(open)
                          if (open) setSelectedContract(contract.id)
                          else setSelectedContract(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                            <Plus className="h-3 w-3 mr-1" />
                            Fund
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-purple-500/20 text-white">
                          <DialogHeader>
                            <DialogTitle>Fund Escrow Contract</DialogTitle>
                            <DialogDescription className="text-slate-300">
                              Add funds to {contract.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="fund-amount" className="text-slate-300">
                                Amount (TalPay Tokens)
                              </Label>
                              <Input
                                id="fund-amount"
                                type="number"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Enter amount to fund"
                                max={contract.totalAmount - contract.fundedAmount}
                              />
                              <p className="text-xs text-slate-400 mt-1">
                                Remaining needed: ${(contract.totalAmount - contract.fundedAmount).toLocaleString()} TPY
                              </p>
                            </div>
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
                                <p className="text-sm text-slate-300">
                                  This will transfer TalPay tokens from your account to the escrow contract. Funds will
                                  be locked until the release date or until all required approvals are received.
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={handleFundContract}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              >
                                Fund with TalPay
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsFundDialogOpen(false)
                                  // This would open a dialog to fund from wallet directly
                                }}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                              >
                                Fund from ICP Wallet
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {contract.status === "active" && contract.approvals < contract.requiredApprovals && (
                      <Button size="sm" className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}

                    {contract.status === "active" && contract.approvals >= contract.requiredApprovals && (
                      <Button size="sm" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                        <Send className="h-3 w-3 mr-1" />
                        Release Funds
                      </Button>
                    )}

                    {contract.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
