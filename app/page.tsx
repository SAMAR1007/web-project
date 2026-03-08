import { Navbar } from "@/components/layout/navbar"
import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Categories } from "@/components/home/categories"
import { Stats } from "@/components/home/stats"
import { Footer } from "@/components/layout/footer"

// Home page - main landing page component
export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}
