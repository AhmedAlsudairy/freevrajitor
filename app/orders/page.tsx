import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import { Search, Clock, Calendar, CheckCircle, AlertTriangle, Ban } from "lucide-react"

// Sample orders data
const orders = [
  {
    id: "ORD-1234",
    title: "WordPress Website Development",
    buyer: {
      name: "Jane Cooper",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "Mar 15, 2023",
    dueDate: "Mar 22, 2023",
    amount: 250,
    status: "In Progress",
  },
  {
    id: "ORD-1233",
    title: "Logo Design Package",
    buyer: {
      name: "Robert Fox",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "Mar 12, 2023",
    dueDate: "Mar 17, 2023",
    amount: 120,
    status: "Completed",
  },
  {
    id: "ORD-1232",
    title: "Content Writing - 5 Articles",
    buyer: {
      name: "Esther Howard",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "Mar 10, 2023",
    dueDate: "Mar 20, 2023",
    amount: 175,
    status: "Completed",
  },
  {
    id: "ORD-1231",
    title: "Social Media Strategy",
    buyer: {
      name: "Jenny Wilson",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "Mar 8, 2023",
    dueDate: "Mar 15, 2023",
    amount: 200,
    status: "Cancelled",
  },
  {
    id: "ORD-1230",
    title: "Mobile App UI Design",
    buyer: {
      name: "Darlene Robertson",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "Mar 5, 2023",
    dueDate: "Mar 12, 2023",
    amount: 350,
    status: "Pending",
  },
]

// Get orders by status for tab counts
const getOrdersByStatus = (status: string) => {
  return orders.filter((order) => {
    if (status === "active") {
      return order.status === "In Progress" || order.status === "Pending"
    }
    return order.status.toLowerCase() === status.toLowerCase()
  })
}

// Helper function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return { variant: "outline" as const, icon: <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" /> }
    case "In Progress":
      return { variant: "default" as const, icon: <Clock className="h-3.5 w-3.5 mr-1" /> }
    case "Pending":
      return { variant: "secondary" as const, icon: <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mr-1" /> }
    case "Cancelled":
      return { variant: "destructive" as const, icon: <Ban className="h-3.5 w-3.5 mr-1" /> }
    default:
      return { variant: "outline" as const, icon: null }
  }
}

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

        {/* Order Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getOrdersByStatus("active").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending & In Progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{getOrdersByStatus("completed").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{getOrdersByStatus("cancelled").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Orders cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="active">
                    Active
                    <Badge className="ml-2" variant="secondary">
                      {getOrdersByStatus("active").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-8 h-9 w-[200px]" />
                  </div>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                      <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={order.buyer.image || "/placeholder.svg"}
                              alt={order.buyer.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {order.buyer.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status).variant} className="flex items-center w-fit">
                            {getStatusBadge(order.status).icon}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="active">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getOrdersByStatus("active").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={order.buyer.image || "/placeholder.svg"}
                              alt={order.buyer.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {order.buyer.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status).variant} className="flex items-center w-fit">
                            {getStatusBadge(order.status).icon}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {getOrdersByStatus("active").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No active orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="completed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getOrdersByStatus("completed").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={order.buyer.image || "/placeholder.svg"}
                              alt={order.buyer.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {order.buyer.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status).variant} className="flex items-center w-fit">
                            {getStatusBadge(order.status).icon}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {getOrdersByStatus("completed").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No completed orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="cancelled">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getOrdersByStatus("cancelled").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={order.buyer.image || "/placeholder.svg"}
                              alt={order.buyer.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {order.buyer.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{order.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status).variant} className="flex items-center w-fit">
                            {getStatusBadge(order.status).icon}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {getOrdersByStatus("cancelled").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No cancelled orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
