import { Card } from "@/components/ui/card"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad } from "lucide-react"
import Link from "next/link"

export function Categories() {
  const categories = [
    { icon: Smartphone, name: "Smartphones", count: 2500 },
    { icon: Laptop, name: "Laptops", count: 1950 },
    { icon: Headphones, name: "Audio", count: 1200 },
    { icon: Watch, name: "Wearables", count: 850 },
    { icon: Camera, name: "Cameras", count: 650 },
    { icon: Gamepad, name: "Gaming", count: 1400 },
  ]

  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">All Categories</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Browse through our extensive collection of tech gadgets organized by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={`/category/${category.name.toLowerCase()}`}>
              <Card className="p-4 md:p-6 text-center hover:bg-accent transition-colors cursor-pointer">
                <category.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3" />
                <h3 className="font-semibold mb-1 text-sm md:text-base">{category.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{category.count} items</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
