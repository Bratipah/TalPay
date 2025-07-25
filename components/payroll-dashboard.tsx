"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Clock, Shield, TrendingUp, AlertCircle, CheckCircle, Calendar, Wallet } from "lucide-react"

interface PayrollDashboardProps {
  userRole: "admin" | "employee" | null
}

export function PayrollDashboard({ userRole }: PayrollDashboardProps) {
  const [nextPayrollDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  if (userRole === "employee") {
    return (
      <div className="space-y-6">
        {/* Employee Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current Salary</p>
                  <p className="text-2xl font-bold text-white">$5,200</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Next Payment</p>
                  <p className="text-2xl font-bold text-white">7 days</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">YTD Earnings</p>
                  <p className="text-2xl font-bold text-white">$41,600</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Payment Status</p>
                  <Badge className="bg-green-500/20 text-green-300 mt-1">Active</Badge>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Payments</CardTitle>
            <CardDescription className="text-slate-300">Your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-15", amount: "$5,200", status: "Completed", txHash: "0x1234...5678" },
                { date: "2023-12-15", amount: "$5,200", status: "Completed", txHash: "0x2345...6789" },
                { date: "2023-11-15", amount: "$5,000", status: "Completed", txHash: "0x3456...7890" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.amount}</p>
                      <p className="text-sm text-slate-400">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-300 mb-1">{payment.status}</Badge>
                    <p className="text-xs text-slate-400">{payment.txHash}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Payroll</p>
                <p className="text-2xl font-bold text-white">$1,284,500</p>
                <p className="text-xs text-green-400 mt-1">+12.5% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Employees</p>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-xs text-blue-400 mt-1">8 new this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Escrow Balance</p>
                <p className="text-2xl font-bold text-white">$156,800</p>
                <p className="text-xs text-purple-400 mt-1">Ready for next cycle</p>
              </div>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Next Payroll</p>
                <p className="text-2xl font-bold text-white">7 days</p>
                <p className="text-xs text-orange-400 mt-1">{nextPayrollDate.toLocaleDateString()}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Escrow Status
            </CardTitle>
            <CardDescription className="text-slate-300">Current escrow funding for upcoming payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Funded Amount</span>
                <span className="text-white">$156,800 / $180,000</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="flex justify-between items-center">
                <Badge className="bg-orange-500/20 text-orange-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Needs Funding
                </Badge>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Payment Analytics
            </CardTitle>
            <CardDescription className="text-slate-300">Recent payment performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Success Rate</span>
                <span className="text-green-400 font-semibold">99.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg. Transaction Time</span>
                <span className="text-blue-400 font-semibold">1.8s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gas Fees Saved</span>
                <span className="text-purple-400 font-semibold">$2,340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Failed Transactions</span>
                <span className="text-red-400 font-semibold">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Payroll Activity</CardTitle>
          <CardDescription className="text-slate-300">Latest transactions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "payment",
                description: "Batch payment processed for 247 employees",
                amount: "$1,284,500",
                time: "2 hours ago",
                status: "completed",
              },
              {
                type: "escrow",
                description: "Escrow funded for next payroll cycle",
                amount: "$156,800",
                time: "1 day ago",
                status: "completed",
              },
              {
                type: "employee",
                description: "8 new employees added to payroll",
                amount: null,
                time: "2 days ago",
                status: "completed",
              },
              {
                type: "system",
                description: "Smart contract upgraded to v2.1",
                amount: null,
                time: "3 days ago",
                status: "completed",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      activity.type === "payment"
                        ? "bg-green-500/20"
                        : activity.type === "escrow"
                          ? "bg-purple-500/20"
                          : activity.type === "employee"
                            ? "bg-blue-500/20"
                            : "bg-orange-500/20"
                    }`}
                  >
                    {activity.type === "payment" && <DollarSign className="h-5 w-5 text-green-400" />}
                    {activity.type === "escrow" && <Shield className="h-5 w-5 text-purple-400" />}
                    {activity.type === "employee" && <Users className="h-5 w-5 text-blue-400" />}
                    {activity.type === "system" && <Wallet className="h-5 w-5 text-orange-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.description}</p>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && <p className="text-white font-semibold">{activity.amount}</p>}
                  <Badge className="bg-green-500/20 text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
