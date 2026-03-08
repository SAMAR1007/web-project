// Main navigation bar with responsive mobile menu
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hexagon, ShoppingCart, Menu, LayoutDashboard } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Hexagon className="h-6 w-6" />
          <span>Tech Hive</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
            Deals
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="outline" className="gap-2 bg-transparent">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button>Get Started</Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-sm font-medium">
                  Products
                </Link>
                <Link href="/categories" className="text-sm font-medium">
                  Categories
                </Link>
                <Link href="/deals" className="text-sm font-medium">
                  Deals
                </Link>
                <Link href="/dashboard" className="text-sm font-medium">
                  Dashboard
                </Link>
                <div className="border-t pt-4 mt-4">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full mt-2">Get Started</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
