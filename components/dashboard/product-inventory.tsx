import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProductInventory() {
  const inventory = [
    { name: "Wireless Headphones", stock: 85, total: 100 },
    { name: "Laptops", stock: 42, total: 60 },
    { name: "Smart Watches", stock: 67, total: 80 },
    { name: "Cameras", stock: 23, total: 40 },
    { name: "Gaming Consoles", stock: 15, total: 30 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.stock}/{item.total}
                </span>
              </div>
              <Progress value={(item.stock / item.total) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
