"use client"

import { SidebarNavigation } from "@/components/sidebar-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Home, Lightbulb, MessageCircle } from "lucide-react"
import React from "react"

export default function MarcusChatPage() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: "Marcus",
      content: "Hi! I'm Marcus, your content strategist. How can I help you create amazing LinkedIn content today?",
      timestamp: new Date(),
      isUser: false,
    },
  ])
  const [inputValue, setInputValue] = React.useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: inputValue,
      timestamp: new Date(),
      isUser: true,
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    // Simulate Marcus response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "Marcus",
        content: "That's a great question! Let me help you with that. Based on my experience with content strategy...",
        timestamp: new Date(),
        isUser: false,
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/ideas-hub" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Ideas Hub
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat with Marcus
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/professional-man-avatar.png" alt="Marcus" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-emerald-800">Marcus</CardTitle>
                  <p className="text-sm text-gray-600">Content Strategist</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isUser ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
