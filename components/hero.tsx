import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full px-4 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-balance">
            Discover the Latest Tech at <span className="text-foreground">Tech Hive</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 text-pretty max-w-2xl mx-auto">
            Your trusted marketplace for cutting-edge gadgets, smartphones, laptops, and accessories. Quality tech
            delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                My Dashboard
              </Button>
            </Link>
            <Link href="/deals">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                View Deals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
