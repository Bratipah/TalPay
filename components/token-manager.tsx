"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Coins, ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet, AlertCircle } from "lucide-react"

interface TokenManagerProps {
  userRole: "admin" | "employee" | null
}

export function TokenManager({ userRole }: TokenManagerProps) {
  const [talPayBalance, setTalPayBalance] = useState(10000)
  const [icpBalance, setIcpBalance] = useState(25.5)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [convertAmount, setConvertAmount] = useState("")
  const [convertDirection, setConvertDirection] = useState<"toTalPay" | "toICP">("toTalPay")
  const [isWalletFundDialogOpen, setIsWalletFundDialogOpen] = useState(false)
  const [fundAmount, setFundAmount] = useState("")

  const handleConvert = () => {
    const amount = Number.parseFloat(convertAmount)
    if (isNaN(amount) || amount <= 0) return

    if (convertDirection === "toTalPay") {
      // Convert ICP to TalPay (1 ICP = 100 TalPay for example)
      if (amount > icpBalance) return

      const talPayAmount = amount * 100
      setIcpBalance((prev) => prev - amount)
      setTalPayBalance((prev) => prev + talPayAmount)
    } else {
      // Convert TalPay to ICP (100 TalPay = 1 ICP)
      if (amount > talPayBalance) return

      const icpAmount = amount / 100
      setTalPayBalance((prev) => prev - amount)
      setIcpBalance((prev) => prev + icpAmount)
    }

    setConvertAmount("")
    setIsConvertDialogOpen(false)
  }

  const handleFundFromWallet = () => {
    const amount = Number.parseFloat(fundAmount)
    if (isNaN(amount) || amount <= 0) return

    // Simulate funding from wallet
    setIcpBalance((prev) => prev + amount)
    setFundAmount("")
    setIsWalletFundDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">TalPay Token Management</h2>
          <p className="text-slate-400">Manage your TalPay tokens and ICP balance</p>
        </div>
      </div>

      {/* Token Balances */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-purple-400" />
              TalPay Balance
            </CardTitle>
            <CardDescription className="text-slate-300">Your TalPay token balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{talPayBalance.toLocaleString()} TPY</div>
              <div className="flex space-x-2">
                <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Convert Tokens</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        Convert between TalPay tokens and ICP
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Current Balances</span>
                        <div className="space-y-1">
                          <div className="text-white text-right">{talPayBalance.toLocaleString()} TPY</div>
                          <div className="text-white text-right">{icpBalance.toFixed(4)} ICP</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="convert-direction" className="text-slate-300">
                          Conversion Direction
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={convertDirection === "toTalPay" ? "default" : "outline"}
                            className={
                              convertDirection === "toTalPay"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                            }
                            onClick={() => setConvertDirection("toTalPay")}
                          >
                            ICP → TalPay
                          </Button>
                          <Button
                            type="button"
                            variant={convertDirection === "toICP" ? "default" : "outline"}
                            className={
                              convertDirection === "toICP"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                            }
                            onClick={() => setConvertDirection("toICP")}
                          >
                            TalPay → ICP
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="convert-amount" className="text-slate-300">
                          Amount to Convert ({convertDirection === "toTalPay" ? "ICP" : "TPY"})
                        </Label>
                        <Input
                          id="convert-amount"
                          type="number"
                          value={convertAmount}
                          onChange={(e) => setConvertAmount(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder={`Enter amount in ${convertDirection === "toTalPay" ? "ICP" : "TPY"}`}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {convertDirection === "toTalPay"
                            ? `You will receive approximately ${Number.parseFloat(convertAmount || "0") * 100} TPY`
                            : `You will receive approximately ${Number.parseFloat(convertAmount || "0") / 100} ICP`}
                        </p>
                      </div>

                      <Button
                        onClick={handleConvert}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Convert
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              TalPay tokens are used for payroll operations within the platform. 1 ICP ≈ 100 TPY
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              ICP Balance
            </CardTitle>
            <CardDescription className="text-slate-300">Your Internet Computer Protocol balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">{icpBalance.toFixed(4)} ICP</div>
              <div className="flex space-x-2">
                <Dialog open={isWalletFundDialogOpen} onOpenChange={setIsWalletFundDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Fund
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Fund from Wallet</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        Add ICP from your connected wallet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="fund-amount" className="text-slate-300">
                          Amount (ICP)
                        </Label>
                        <Input
                          id="fund-amount"
                          type="number"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter amount to fund"
                        />
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                          <p className="text-sm text-slate-300">
                            This will transfer ICP from your connected wallet to your TalPay account. Make sure you have
                            sufficient balance in your wallet.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleFundFromWallet}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        Fund from Wallet
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              ICP tokens can be converted to TalPay tokens for use within the platform or withdrawn to your wallet.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-slate-300">Recent token transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "convert",
                description: "Converted ICP to TalPay",
                amount: "+500 TPY",
                icpAmount: "-5 ICP",
                time: "2 hours ago",
              },
              {
                type: "fund",
                description: "Funded from wallet",
                amount: "+10 ICP",
                icpAmount: null,
                time: "1 day ago",
              },
              {
                type: "payroll",
                description: "Payroll distribution",
                amount: "-2,500 TPY",
                icpAmount: null,
                time: "7 days ago",
              },
              {
                type: "convert",
                description: "Converted TalPay to ICP",
                amount: "-1,000 TPY",
                icpAmount: "+10 ICP",
                time: "14 days ago",
              },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      transaction.type === "convert"
                        ? "bg-purple-500/20"
                        : transaction.type === "fund"
                          ? "bg-green-500/20"
                          : "bg-blue-500/20"
                    }`}
                  >
                    {transaction.type === "convert" && <RefreshCw className="h-5 w-5 text-purple-400" />}
                    {transaction.type === "fund" && <ArrowDownLeft className="h-5 w-5 text-green-400" />}
                    {transaction.type === "payroll" && <Coins className="h-5 w-5 text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-sm text-slate-400">{transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${transaction.amount.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {transaction.amount}
                  </p>
                  {transaction.icpAmount && (
                    <p
                      className={`text-sm ${transaction.icpAmount.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {transaction.icpAmount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
