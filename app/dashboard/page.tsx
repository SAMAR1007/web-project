import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { ProductInventory } from "@/components/dashboard/product-inventory"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Welcome back to your dashboard! Here&apos;s an overview of your store.
          </p>
        </div>
        <DashboardStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentOrders />
          <ProductInventory />
        </div>
      </div>
    </DashboardLayout>
  )
}
