// Featured products showcase section
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      rating: 4.8,
      reviews: 245,
      image: "premium wireless headphones with noise cancellation",
    },
    {
      id: 2,
      name: "Ultra-Slim Laptop Pro",
      price: 1249.99,
      rating: 4.9,
      reviews: 512,
      image: "modern ultra slim laptop computer",
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.6,
      reviews: 389,
      image: "modern smartwatch fitness tracker",
    },
    {
      id: 4,
      name: "4K Action Camera",
      price: 399.99,
      rating: 4.7,
      reviews: 178,
      image: "4k action camera for sports",
    },
  ]

  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Featured Products</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Browse our top-rated tech gadgets and bestsellers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={`/.jpg?key=xke07&height=300&width=300&query=${encodeURIComponent(product.image)}`}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-3 md:p-4 gap-2">
                <h3 className="font-semibold line-clamp-1 text-sm md:text-base">{product.name}</h3>
                <div className="flex items-center gap-1 text-xs md:text-sm">
                  <Star className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg md:text-xl font-bold">${product.price}</span>
                  <Button size="sm">Add to Cart</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
