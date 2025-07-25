"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { PayrollDashboard } from "@/components/payroll-dashboard"
import { EmployeeManagement } from "@/components/employee-management"
import { EscrowManager } from "@/components/escrow-manager"
import { TokenManager } from "@/components/token-manager"
import { Wallet, Shield, Users, TrendingUp, Zap, Globe, Coins } from "lucide-react"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "employee" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TalPay</h1>
                <p className="text-sm text-purple-300">Blockchain Payroll Management</p>
              </div>
            </div>
            <WalletConnect isConnected={isConnected} onConnect={setIsConnected} onRoleChange={setUserRole} />
          </div>
        </div>
      </header>

      {!isConnected ? (
        <main className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Powered by Internet Computer Protocol</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Next-Generation
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                TalPay{" "}
              </span>
              Platform
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Secure, transparent, and efficient payroll management with TalPay tokens, smart contract escrow, and
              seamless Web3 integration for modern organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                Connect Wallet to Start
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Coins className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">TalPay Tokens</CardTitle>
                <CardDescription className="text-slate-300">
                  Dedicated token system for seamless payroll operations and employee compensation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Smart Contract Escrow</CardTitle>
                <CardDescription className="text-slate-300">
                  Automated escrow system ensures secure and timely payments with multi-signature approval
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-pink-400 mb-4" />
                <CardTitle className="text-white">Batch Payments</CardTitle>
                <CardDescription className="text-slate-300">
                  Process thousands of employee payments simultaneously with minimal gas fees
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Chain Fusion</CardTitle>
                <CardDescription className="text-slate-300">
                  Cross-chain compatibility with Bitcoin and other major cryptocurrencies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
              <div className="text-slate-400">Total Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-slate-400">Employees Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2s</div>
              <div className="text-slate-400">Transaction Time</div>
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="bg-slate-800/30 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl mb-4">Built on Cutting-Edge Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ICP</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Internet Computer</h3>
                  <p className="text-slate-400 text-sm">
                    Scalable blockchain infrastructure with web-speed performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">₿</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Chain Fusion</h3>
                  <p className="text-slate-400 text-sm">Direct Bitcoin integration without bridges or wrapped tokens</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Web3 Integration</h3>
                  <p className="text-slate-400 text-sm">Seamless wallet connection with social login options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-purple-500/20">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                Employees
              </TabsTrigger>
              <TabsTrigger
                value="escrow"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                Escrow
              </TabsTrigger>
              <TabsTrigger
                value="tokens"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                Tokens
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <PayrollDashboard userRole={userRole} />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeeManagement userRole={userRole} />
            </TabsContent>

            <TabsContent value="escrow">
              <EscrowManager userRole={userRole} />
            </TabsContent>

            <TabsContent value="tokens">
              <TokenManager userRole={userRole} />
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Payroll Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-white mb-1">$125,430</div>
                      <div className="text-sm text-slate-400">Total Payroll This Month</div>
                      <div className="text-xs text-green-400 mt-1">+12.5% from last month</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
                      <div className="text-2xl font-bold text-white mb-1">247</div>
                      <div className="text-sm text-slate-400">Active Employees</div>
                      <div className="text-xs text-green-400 mt-1">+8 new hires</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-white mb-1">98.7%</div>
                      <div className="text-sm text-slate-400">Payment Success Rate</div>
                      <div className="text-xs text-green-400 mt-1">Above target</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
                      <div className="text-2xl font-bold text-white mb-1">1.2</div>
                      <div className="text-sm text-slate-400">Avg Transaction Time (seconds)</div>
                      <div className="text-xs text-green-400 mt-1">-0.3s improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-slate-900/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 TalPay. Built on Internet Computer Protocol with Chain Fusion technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
