'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getClientAuthState } from '@/app/utils/client-auth' // Correct import
import { User } from '@/app/data/users'
import MessageThreadModal from '../components/MessageThreadModal'
import NewUpdateModal from '../components/NewUpdateModal'
import NewMessageModal from '../components/NewMessageModal'
import { users } from '../data/users'
import { modules } from '../data/courses'
import { workshops } from '../data/workshops' // Add this import

// Mock data for admin's inbox messages
const mockInboxMessages = [
  { 
    id: '1', 
    sender: 'John Doe', // Learner
    unread: true,
    timestamp: '2024-01-05 11:15', 
    thread: [
      { id: '1a', sender: 'John Doe', content: 'Hello Admin, I have a question about the platform.', timestamp: '2024-01-05 10:30' },
    ]
  },
  { 
    id: '2', 
    sender: 'Jane Smith', // Instructor
    unread: false,
    timestamp: '2024-01-06 14:15', 
    thread: [
      { id: '2a', sender: 'Jane Smith', content: 'Hi Admin, I need assistance with course creation.', timestamp: '2024-01-06 14:15' },
    ]
  },
]

// Mock data for admin's updates
const mockUpdates = [
  { id: '1', type: 'platform', name: 'All Users', message: 'Platform maintenance scheduled for this weekend.', timestamp: '2024-01-04 09:00' },
  { id: '2', type: 'course', name: 'All Courses', message: 'New feature: Interactive quizzes now available for all courses.', timestamp: '2024-01-05 11:00' },
]

export default function AdminMessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState<typeof mockInboxMessages[0] | null>(null)
  const [isMessageThreadModalOpen, setIsMessageThreadModalOpen] = useState(false)
  const [isNewUpdateModalOpen, setIsNewUpdateModalOpen] = useState(false)
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false)
  const [inboxMessages, setInboxMessages] = useState(mockInboxMessages)

  useEffect(() => {
    const { isLoggedIn, userType, user } = getClientAuthState()
    if (!isLoggedIn || userType !== 'admin') {
      router.push('/login')
    } else {
      setUser(user)
    }
  }, [router])

  const handleOpenMessageThread = (message: typeof mockInboxMessages[0]) => {
    setSelectedMessage(message)
    setIsMessageThreadModalOpen(true)
    // Mark the message as read
    setInboxMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === message.id ? { ...msg, unread: false } : msg
      )
    )
  }

  const handleSendReply = (reply: string) => {
    console.log('Sending reply:', reply)
    setIsMessageThreadModalOpen(false)
    if (selectedMessage && user) {
      const updatedMessages = inboxMessages.map(msg => 
        msg.id === selectedMessage.id 
          ? {
              ...msg,
              thread: [
                ...msg.thread,
                { 
                  id: `${msg.id}-${msg.thread.length + 1}`,
                  sender: user.name,
                  content: reply,
                  timestamp: new Date().toISOString()
                }
              ]
            }
          : msg
      )
      setInboxMessages(updatedMessages)
    }
  }

  const handleSendUpdate = (type: 'platform' | 'course' | 'workshop', id: string, recipients: string, message: string) => {
    // In a real application, you would send this update to an API
    console.log('Sending update:', { type, id, recipients, message })
    setIsNewUpdateModalOpen(false)
  }

  const handleSendMessage = (recipientId: string, message: string) => {
    // In a real application, you would send this message to an API
    console.log('Sending message:', { recipientId, message })
    setIsNewMessageModalOpen(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  // Get all users (both instructors and learners) for the new message modal
  const allUsers = users.filter(u => u.userType !== 'admin')

  return (
    <div className="container-fluid pt-4 md:pt-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Messages</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inbox</CardTitle>
              <Button onClick={() => setIsNewMessageModalOpen(true)}>New Message</Button>
            </CardHeader>
            <CardContent>
              {inboxMessages.map((message) => (
                <div
                  key={message.id}
                  className="mb-4 p-4 border rounded-lg cursor-pointer hover:bg-muted"
                  onClick={() => handleOpenMessageThread(message)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{message.sender}</span>
                    <div className="flex items-center">
                      {message.unread && (
                        <Badge variant="destructive" className="mr-2">New</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm">
                    {message.thread[message.thread.length - 1].content}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="updates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Updates</CardTitle>
              <Button onClick={() => setIsNewUpdateModalOpen(true)}>New Update</Button>
            </CardHeader>
            <CardContent>
              {mockUpdates.map((update) => (
                <div key={update.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{update.name} ({update.type})</span>
                    <span className="text-sm text-muted-foreground">{update.timestamp}</span>
                  </div>
                  <p className="text-sm">{update.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedMessage && user && (
        <MessageThreadModal
          isOpen={isMessageThreadModalOpen}
          onClose={() => setIsMessageThreadModalOpen(false)}
          messages={selectedMessage.thread}
          onSendReply={handleSendReply}
          instructorName={user.name}
        />
      )}

      <NewUpdateModal
        isOpen={isNewUpdateModalOpen}
        onClose={() => setIsNewUpdateModalOpen(false)}
        courses={modules}
        workshops={workshops} // Pass the workshops data
        onSendUpdate={handleSendUpdate}
      />

      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        learners={allUsers} 
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

