// Registration page for new users
import { RegisterForm } from "@/components/auth/register-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
        <RegisterForm />
      </div>
      <Footer />
    </>
  )
}
