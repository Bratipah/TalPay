"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WalletConnectProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
  onRoleChange: (role: "admin" | "employee" | null) => void
}

export function WalletConnect({ isConnected, onConnect, onRoleChange }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userRole, setUserRole] = useState<"admin" | "employee" | null>(null)

  const handleConnect = async (method: string) => {
    setIsConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "rdmx6-jaaaa-aaaah-qcaiq-cai"
      const mockRole = Math.random() > 0.5 ? "admin" : "employee"

      setWalletAddress(mockAddress)
      setUserRole(mockRole)
      onConnect(true)
      onRoleChange(mockRole)
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    setWalletAddress("")
    setUserRole(null)
    onConnect(false)
    onRoleChange(null)
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="border-purple-500/50 text-purple-300">
          <Shield className="h-3 w-3 mr-1" />
          {userRole === "admin" ? "Administrator" : "Employee"}
        </Badge>
        <div className="text-sm text-slate-300">
          {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-slate-300">
            Choose your preferred connection method to access the ICP Payroll system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Internet Identity */}
          <Card
            className="bg-slate-700/50 border-purple-500/20 cursor-pointer hover:bg-slate-700/70 transition-colors"
            onClick={() => handleConnect("internet-identity")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">II</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Internet Identity</h3>
                  <p className="text-sm text-slate-400">Secure authentication with ICP</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300">Recommended</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Social Logins via Reown AppKit */}
          <Card
            className="bg-slate-700/50 border-purple-500/20 cursor-pointer hover:bg-slate-700/70 transition-colors"
            onClick={() => handleConnect("google")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Google Account</h3>
                  <p className="text-sm text-slate-400">Sign in with your Google account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-700/50 border-purple-500/20 cursor-pointer hover:bg-slate-700/70 transition-colors"
            onClick={() => handleConnect("github")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">GH</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">GitHub</h3>
                  <p className="text-sm text-slate-400">Connect with GitHub account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Options */}
          <Card
            className="bg-slate-700/50 border-purple-500/20 cursor-pointer hover:bg-slate-700/70 transition-colors"
            onClick={() => handleConnect("plug")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Plug Wallet</h3>
                  <p className="text-sm text-slate-400">Connect with Plug browser extension</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isConnecting && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-purple-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              <span>Connecting...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
