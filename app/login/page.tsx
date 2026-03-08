// Login page with centered layout
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
        <LoginForm />
      </div>
      <Footer />
    </>
  )
}
