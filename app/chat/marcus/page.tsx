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
import { useAuth } from "@/contexts/AuthContext"
import { createIdeationSession, updateIdeationSession, saveIdeaFromSession } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Home, Lightbulb, MessageCircle } from "lucide-react"
import React from "react"

export default function MarcusChatPage() {
  const { user } = useAuth()
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
const [isLoading, setIsLoading] = React.useState(false)
const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null)
const [conversationContext, setConversationContext] = React.useState({
  previous_messages: [],
  current_stage: 'initial',
  topic_focus: ''
})
const [currentStatus, setCurrentStatus] = React.useState('')
const [waitingForClarification, setWaitingForClarification] = React.useState(false)

  // Webhook integration functions
const callMarcusAI = async (userInput: string, conversationContext: any, contentPreference: string, sessionId: string) => {
  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_MARCUS_WEBHOOK_URL || 'https://testcyber.app.n8n.cloud/webhook/74cc6b41-dc95-4bb4-b0ea-adc8f6fa56b1';
  
  try {
    console.log('🚀 Calling Marcus AI webhook:', { userInput, conversationContext, contentPreference });
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: userInput,
        conversation_context: conversationContext,
        user_id: user?.id,
        content_type_preference: contentPreference,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    });

    const data = await response.json();
    console.log('✅ Marcus AI response:', data);
    return data;
  } catch (error) {
    console.error('❌ Marcus AI Error:', error);
    return { error: 'Marcus is thinking too hard, try again' };
  }
};

// Poll for AI response from callback
const pollForAIResponse = async (sessionId: string) => {
  const maxAttempts = 40;
  let attempts = 0;
  
  const poll = async (): Promise<any> => {
    try {
      const response = await fetch(`/api/marcus/callback?session_id=${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        if (result.type === 'final') {
          console.log('📨 Received final AI response:', result.data);
          return result.data;
        } else if (result.type === 'status') {
          console.log('📝 Status update:', result.data);
          setCurrentStatus(result.data.message);
        }
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        console.log('⏱️ AI response timeout');
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      return poll();
    } catch (error) {
      console.error('❌ Error polling for AI response:', error);
      return null;
    }
  };
  
  return poll();
};

  const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading || !user) return

  const sessionId = currentSessionId || Date.now().toString() + Math.random().toString(36).substr(2, 9)
  if (!currentSessionId) {
    setCurrentSessionId(sessionId)
  }

  const newMessage = {
    id: messages.length + 1,
    sender: "You",
    content: inputValue,
    timestamp: new Date(),
    isUser: true,
  }

  setMessages(prev => [...prev, newMessage])
  setInputValue("")
  setIsLoading(true)
  setWaitingForClarification(false)

  try {
    // Create or update ideation session
    if (!currentSessionId) {
      await createIdeationSession({
        user_id: user.id,
        page_type: 'talk_with_marcus',
        session_data: { messages: [newMessage] },
        status: 'in_progress'
      })
    }

    // Update conversation context
    const updatedContext = {
      ...conversationContext,
      previous_messages: [...conversationContext.previous_messages, inputValue].slice(-5) // Keep last 5 messages
    }
    setConversationContext(updatedContext)

    // Call Marcus AI
    await callMarcusAI(inputValue, updatedContext, 'business_authority', sessionId)
    
    // Poll for response
    const aiResponse = await pollForAIResponse(sessionId)
    
    if (aiResponse) {
      let responseContent = ''
      
      if (aiResponse.response_type === 'topic_ready' && aiResponse.topics?.length > 0) {
  const topic = aiResponse.topics[0]
  responseContent = `Great! I've developed a content idea for you:\n\n**${topic.title}**\n\n${topic.key_takeaways?.join('\n') || ''}\n\nWould you like me to save this to your Ideas Library?`
  
  const marcusMessage = {
    id: messages.length + 2,
    sender: "Marcus",
    content: responseContent,
    timestamp: new Date(),
    isUser: false,
  }
  setMessages(prev => [...prev, marcusMessage])
  setWaitingForClarification(false)
  
} else if (aiResponse.response_type === 'clarification' && aiResponse.questions) {
  // First: Send the main message
  const mainMessage = {
    id: messages.length + 2,
    sender: "Marcus",
    content: aiResponse.message,
    timestamp: new Date(),
    isUser: false,
  }
  setMessages(prev => [...prev, mainMessage])
  
  // Then: Send follow-up questions after delay and WAIT
  setTimeout(() => {
    const questionsMessage = {
      id: messages.length + 3,
      sender: "Marcus", 
      content: aiResponse.questions.join('\n\n'),
      timestamp: new Date(),
      isUser: false,
    }
    setMessages(prev => [...prev, questionsMessage])
    setWaitingForClarification(true) // Now wait for user response!
  }, 1500)
  
  return // Don't continue processing - wait for user input
  
} else {
  responseContent = aiResponse.message || "I'm thinking about your request..."
  
  const marcusMessage = {
    id: messages.length + 2,
    sender: "Marcus",
    content: responseContent,
    timestamp: new Date(),
    isUser: false,
  }
  setMessages(prev => [...prev, marcusMessage])
  setWaitingForClarification(false)
}
    } else {
      // Fallback message
      const errorMessage = {
        id: messages.length + 2,
        sender: "Marcus",
        content: "I'm having trouble processing that right now. Could you try rephrasing your question?",
        timestamp: new Date(),
        isUser: false,
      }
      setMessages(prev => [...prev, errorMessage])
    }
  } catch (error) {
    console.error('Error in handleSendMessage:', error)
  } finally {
    setIsLoading(false)
    setCurrentStatus('')
  }
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
                {currentStatus && (
  <div className="px-4 py-2 bg-blue-50 border-b">
    <p className="text-sm text-blue-600 flex items-center gap-2">
      <Loader2 className="h-3 w-3 animate-spin" />
      {currentStatus}
    </p>
  </div>
)}
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
                  <Button onClick={handleSendMessage} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
