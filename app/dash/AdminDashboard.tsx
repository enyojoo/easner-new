'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientAuthState } from '@/app/utils/client-auth' // Import client-side auth
import { User } from '@/app/data/users'

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { user } = getClientAuthState() // Use client-side auth
    setUser(user)
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8 pt-16">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-8">Welcome, {user.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">42</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$52,789</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button className="h-auto py-4 flex flex-col items-center">
              <span>Manage Users</span>
            </Button>
            <Button className="h-auto py-4 flex flex-col items-center" variant="outline">
              <span>Review Courses</span>
            </Button>
            <Button className="h-auto py-4 flex flex-col items-center" variant="outline">
              <span>Generate Reports</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>John Doe - Learner</li>
                <li>Jane Smith - Instructor</li>
                <li>Bob Johnson - Learner</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Average Course Rating: 4.7</li>
                <li>Total Course Completions: 3,567</li>
                <li>Active Workshops: 12</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

