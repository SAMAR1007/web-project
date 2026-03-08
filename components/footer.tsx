import Link from "next/link"
import { Hexagon } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Hexagon className="h-6 w-6" />
              <span>Tech Hive</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your go-to marketplace for the latest tech gadgets and electronics.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/smartphones">Smartphones</Link>
              </li>
              <li>
                <Link href="/laptops">Laptops</Link>
              </li>
              <li>
                <Link href="/accessories">Accessories</Link>
              </li>
              <li>
                <Link href="/audio">Audio</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help">Help Center</Link>
              </li>
              <li>
                <Link href="/shipping">Shipping Info</Link>
              </li>
              <li>
                <Link href="/returns">Returns</Link>
              </li>
              <li>
                <Link href="/warranty">Warranty</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Tech Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
