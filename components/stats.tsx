import { Package, Users, ShieldCheck, Zap } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: Package,
      value: "12,000+",
      label: "Products Available",
    },
    {
      icon: Users,
      value: "55,000+",
      label: "Happy Customers",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Secure Payments",
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Customer Support",
    },
  ]

  return (
    <section className="w-full border-y bg-muted/50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center">
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
              </div>
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
