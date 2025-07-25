"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Edit, Trash2, DollarSign, Calendar, Mail } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  salary: number
  walletAddress: string
  status: "active" | "inactive" | "pending"
  joinDate: string
}

interface EmployeeManagementProps {
  userRole: "admin" | "employee" | null
}

export function EmployeeManagement({ userRole }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@company.com",
      position: "Senior Developer",
      department: "Engineering",
      salary: 85000,
      walletAddress: "rdmx6-jaaaa-aaaah-qcaiq-cai",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@company.com",
      position: "Product Manager",
      department: "Product",
      salary: 95000,
      walletAddress: "rrkah-fqaaa-aaaah-qcaiq-cai",
      status: "active",
      joinDate: "2023-03-20",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@company.com",
      position: "UX Designer",
      department: "Design",
      salary: 75000,
      walletAddress: "ryjl3-tyaaa-aaaah-qcaiq-cai",
      status: "pending",
      joinDate: "2024-01-10",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    walletAddress: "",
  })

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      department: newEmployee.department,
      salary: Number.parseInt(newEmployee.salary),
      walletAddress: newEmployee.walletAddress,
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
    }

    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      email: "",
      position: "",
      department: "",
      salary: "",
      walletAddress: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditEmployee = () => {
    if (!editingEmployee) return

    const updatedEmployees = employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))

    setEmployees(updatedEmployees)
    setEditingEmployee(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return

    const updatedEmployees = employees.filter((emp) => emp.id !== employeeToDelete)
    setEmployees(updatedEmployees)
    setEmployeeToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee({ ...employee })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (employeeId: string) => {
    setEmployeeToDelete(employeeId)
    setIsDeleteDialogOpen(true)
  }

  if (userRole === "employee") {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Access Restricted</CardTitle>
          <CardDescription className="text-slate-300">
            Employee management is only available to administrators.
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
          <h2 className="text-2xl font-bold text-white">Employee Management</h2>
          <p className="text-slate-400">Manage your workforce and payroll settings</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription className="text-slate-300">
                Enter the employee details to add them to the payroll system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="position" className="text-slate-300">
                  Position
                </Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter job position"
                />
              </div>
              <div>
                <Label htmlFor="department" className="text-slate-300">
                  Department
                </Label>
                <Select onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary" className="text-slate-300">
                  Annual Salary
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter annual salary"
                />
              </div>
              <div>
                <Label htmlFor="wallet" className="text-slate-300">
                  Wallet Address
                </Label>
                <Input
                  id="wallet"
                  value={newEmployee.walletAddress}
                  onChange={(e) => setNewEmployee({ ...newEmployee, walletAddress: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter ICP wallet address"
                />
              </div>
              <Button
                onClick={handleAddEmployee}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription className="text-slate-300">
                Update employee information in the payroll system.
              </DialogDescription>
            </DialogHeader>
            {editingEmployee && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="edit-name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-position" className="text-slate-300">
                    Position
                  </Label>
                  <Input
                    id="edit-position"
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department" className="text-slate-300">
                    Department
                  </Label>
                  <Select
                    defaultValue={editingEmployee.department}
                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, department: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-salary" className="text-slate-300">
                    Annual Salary
                  </Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-wallet" className="text-slate-300">
                    Wallet Address
                  </Label>
                  <Input
                    id="edit-wallet"
                    value={editingEmployee.walletAddress}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, walletAddress: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="edit-status" className="text-slate-300">
                    Status
                  </Label>
                  <Select
                    defaultValue={editingEmployee.status}
                    onValueChange={(value: "active" | "inactive" | "pending") =>
                      setEditingEmployee({ ...editingEmployee, status: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleEditEmployee}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Update Employee
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription className="text-slate-300">
                Are you sure you want to delete this employee? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteEmployee} className="bg-red-500 hover:bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20 md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Employees</p>
                <p className="text-2xl font-bold text-white">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-white">{employees.filter((e) => e.status === "active").length}</p>
              </div>
              <div className="h-8 w-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Employee Directory
          </CardTitle>
          <CardDescription className="text-slate-300">Manage employee information and payroll settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{employee.name}</h3>
                      <p className="text-sm text-slate-400">
                        {employee.position} • {employee.department}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-400">{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-400">Joined {employee.joinDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          employee.status === "active"
                            ? "bg-green-500/20 text-green-300"
                            : employee.status === "pending"
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-red-500/20 text-red-300"
                        }
                      >
                        {employee.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          onClick={() => openEditDialog(employee)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
                          onClick={() => openDeleteDialog(employee.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-white font-semibold">${employee.salary.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      {employee.walletAddress.slice(0, 8)}...{employee.walletAddress.slice(-6)}
                    </p>
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
