// Responsive category grid - 2 cols mobile, 6 cols desktop
import { Card } from "@/components/ui/card"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad } from "lucide-react"
import Link from "next/link"

export function Categories() {
  const categories = [
// <<<<<<< sprint2
//     { icon: Smartphone, name: "Smartphones", count: 2650 },
//     { icon: Laptop, name: "Laptops", count: 1800 },
// =======
//     { icon: Smartphone, name: "Smartphones", count: 2500 },
//     { icon: Laptop, name: "Laptops", count: 1950 },
// >>>>>>> main
    { icon: Headphones, name: "Audio", count: 1200 },
    { icon: Watch, name: "Wearables", count: 850 },
    { icon: Camera, name: "Cameras", count: 650 },
    { icon: Gamepad, name: "Gaming", count: 1400 },
  ]

  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">

