"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { getUserByEmail } from "@/app/data/users"
import Logo from "../components/Logo"
import { Copy } from "lucide-react"

const DemoAccess = ({ setCredentials }: { setCredentials: (email: string, password: string) => void }) => (
  <div className="text-center mb-6 space-y-2">
    <p className="text-sm font-medium text-muted-foreground">Interactive Demo Access - Try on PC:</p>
    <div className="space-y-1">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm">Learner: learner@example.com | password123</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCredentials("learner@example.com", "password123")}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm">Instructor: instructor@example.com | password123</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCredentials("instructor@example.com", "password123")}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const setCredentials = (newEmail: string, newPassword: string) => {
    setEmail(newEmail)
    setPassword(newPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getUserByEmail(email)
    if (user && password === "password123") {
      // In a real app, you would validate the password here
      // Set the authentication cookie with more user data
      const authData = {
        userType: user.userType,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      }
      document.cookie = `auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=86400;`

      // Redirect to the dashboard
      router.push("/dash")
    } else {
      // Handle login error
      alert("Invalid email or password")
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked")
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 sm:px-0">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Logo className="mx-auto mb-4" />
          <DemoAccess setCredentials={setCredentials} />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                Login with Google
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

