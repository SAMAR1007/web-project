import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentOrders() {
  const orders = [
    { id: "#ORD-001", customer: "Alice Johnson", amount: "$299.99", status: "completed" },
    { id: "#ORD-002", customer: "Bob Smith", amount: "$1,299.99", status: "processing" },
    { id: "#ORD-003", customer: "Carol White", amount: "$199.99", status: "pending" },
    { id: "#ORD-004", customer: "David Brown", amount: "$399.99", status: "completed" },
    { id: "#ORD-005", customer: "Eve Davis", amount: "$799.99", status: "processing" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <p className="text-sm font-medium">{order.amount}</p>
                <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
