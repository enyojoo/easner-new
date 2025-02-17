"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClientAuthState } from "@/app/utils/client-auth"
import { modules } from "@/app/data/courses"

// This would typically come from your API or database
const mockWorkshop = {
  id: 1,
  title: "Digital Marketing Strategies",
  date: "2023-07-15",
  time: "14:00",
  attendees: 25,
  isOnline: true,
  description: "Learn cutting-edge digital marketing techniques from industry experts.",
  price: 99,
  courseId: "1",
}

export default function EditWorkshopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [workshop, setWorkshop] = useState(mockWorkshop)

  useEffect(() => {
    const { isLoggedIn, userType, user } = getClientAuthState()
    if (!isLoggedIn || userType !== "instructor") {
      router.push("/login")
    } else {
      setUser(user)
    }
  }, [router])

  useEffect(() => {
    // In a real application, you would fetch the workshop data here
    // For now, we'll use the mock data
    setWorkshop(mockWorkshop)
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkshop((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setWorkshop((prev) => ({ ...prev, isOnline: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated workshop data to your backend
    console.log("Updating workshop:", workshop)
    // After updating, redirect to the workshops list
    router.push("/plan-workshops")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className=" pt-4 md:pt-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Edit Workshop</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workshop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={workshop.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={workshop.date} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={workshop.time} onChange={handleInputChange} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isOnline" checked={workshop.isOnline} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isOnline">Online Workshop</Label>
            </div>
            {!workshop.isOnline && (
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={workshop.address} onChange={handleInputChange} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={workshop.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={workshop.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <Select
                id="courseId"
                name="courseId"
                value={workshop.courseId}
                onValueChange={(value) => setWorkshop((prev) => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/plan-workshops")}>
                Cancel
              </Button>
              <Button type="submit">Update Workshop</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

