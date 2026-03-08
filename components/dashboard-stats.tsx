// Dashboard statistics overview cards
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Revenue",
// <<<<<<< sprint2
//       value: "$45,231",
//       change: "+22.5%",
// =======
//       value: "$48,750",
//       change: "+20.1%",
// >>>>>>> main
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "2,345",
      change: "+15.3%",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: "543",
      change: "+8.2%",
      icon: Package,
    },
    {
      title: "Growth",
      value: "32.5%",
      change: "+4.7%",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stat.change}</span> vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
