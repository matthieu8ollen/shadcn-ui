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
import { createIdeationSession, updateIdeationSession, saveIdeaFromSession, createContentIdea } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Home, Lightbulb, MessageCircle } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"

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
const [showTopicOverlay, setShowTopicOverlay] = React.useState(false)
const [topicsData, setTopicsData] = React.useState([])
const [selectedHook, setSelectedHook] = React.useState('')
const [selectedHookIndex, setSelectedHookIndex] = React.useState(0)
const [waitingForClarification, setWaitingForClarification] = React.useState(false)
const router = useRouter()
  
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
  // Show overlay instead of regular message
  setTopicsData(aiResponse.topics)
  setSelectedHook(aiResponse.topics[0].hooks?.[0] || '')
  setSelectedHookIndex(0)
  setShowTopicOverlay(true)
  setWaitingForClarification(false)
  return
  
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
        <div className="flex-1 p-4">
          <Card className="flex flex-col" style={{height: 'calc(100vh - 140px)'}}>
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
            <CardContent className="flex-1 flex flex-col p-0 relative">
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{maxHeight: 'calc(100vh - 280px)'}}>
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
              <div className="border-t p-4 bg-white sticky bottom-0">
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
      {/* Topic Selection Overlay */}
{showTopicOverlay && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl w-full max-w-6xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Choose Your Content Hook</h3>
        <button
          onClick={() => setShowTopicOverlay(false)}
          className="text-gray-400 hover:text-gray-600 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {topicsData.map((topic: any, topicIndex: number) => (
          <div key={topicIndex} className="p-6 flex flex-col">
            {/* Key Takeaways - Teal Box at Top */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-teal-900">Key Takeaways for This Content</h4>
              </div>
              <div className="text-sm text-teal-800">
                {topic.key_takeaways?.map((takeaway: string, i: number) => (
                  <div key={i} className="mb-1">
                    • {takeaway}
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LinkedIn Preview - Left Side */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-gray-900">LinkedIn Preview</h5>
                <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  {/* LinkedIn Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">You</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Your Name</p>
                        <p className="text-sm text-gray-500">Your Title • Now</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* LinkedIn Content */}
                  <div className="p-4">
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {selectedHook.length > 150 ? `${selectedHook.substring(0, 150)}...` : selectedHook}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hook Selection - Right Side */}
              <div className="flex-1">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Hook</h5>
                <div className="space-y-3">
                  {topic.hooks?.map((hook: string, hookIndex: number) => (
                    <div 
                      key={hookIndex}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedHookIndex === hookIndex 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedHook(hook);
                        setSelectedHookIndex(hookIndex);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          selectedHookIndex === hookIndex 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {hookIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">Option {hookIndex + 1}</p>
                          <p className="text-sm text-gray-600">"{hook}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowTopicOverlay(false)}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Chat</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={async () => {
              // Save to Ideas Library
              if (user && topicsData?.[0]) {
                const topic = topicsData[0] as any
                await createContentIdea({
  user_id: user.id,
  title: topic?.title || 'AI Generated Topic',
  description: topic?.personal_story || selectedHook,
  tags: topic?.key_takeaways || [],
  content_pillar: 'ai_generated',
  source_type: 'ai_generated',
  source_data: {
    session_id: currentSessionId,
    source_page: 'talk_with_marcus',
    content_type: topic?.content_type || 'Personal Story',
    selected_hook: selectedHook,
    selected_hook_index: selectedHookIndex,
    hooks: topic?.hooks || [],
    key_takeaways: topic?.key_takeaways || [],
    personal_story: topic?.personal_story || '',
    pain_points_and_struggles: topic?.pain_points_and_struggles || '',
    concrete_evidence: topic?.concrete_evidence || '',
    audience_and_relevance: topic?.audience_and_relevance || '',
    // Store all the rich data from Marcus
    raw_ai_response: topic
  },
  status: 'active'
})
              }
              setShowTopicOverlay(false)
            }}
            className="px-6 py-3 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition"
          >
            Save to Ideas Library
          </button>
          
          <button
  onClick={async () => {
    if (topicsData?.[0]) {
      const topic = topicsData[0] as any
      
      // Save the idea to database first (optional - for tracking)
      const savedIdea = await createContentIdea({
        user_id: user.id,
        title: topic?.title || 'AI Generated Topic',
        description: topic?.personal_story || selectedHook,
        tags: topic?.key_takeaways || [],
        content_pillar: 'ai_generated',
        source_type: 'ai_generated',
        source_data: {
          session_id: currentSessionId,
          source_page: 'talk_with_marcus',
          content_type: topic?.content_type || 'personal_story',
          selected_hook: selectedHook,
          selected_hook_index: selectedHookIndex,
          hooks: topic?.hooks || [],
          key_takeaways: topic?.key_takeaways || [],
          personal_story: topic?.personal_story || '',
          pain_points_and_struggles: topic?.pain_points_and_struggles || '',
          concrete_evidence: topic?.concrete_evidence || '',
          audience_and_relevance: topic?.audience_and_relevance || '',
          raw_ai_response: topic
        },
        status: 'active'
      })
      
      // Navigate to formula matching with ideation data
      const ideationParams = new URLSearchParams({
        ideaId: savedIdea?.data?.id || '',
        title: encodeURIComponent(topic?.title || 'AI Generated Topic'),
        description: encodeURIComponent(selectedHook),
        contentPillar: 'ai_generated',
        tags: JSON.stringify(topic?.key_takeaways || []),
        sourceData: JSON.stringify({
          content_type: topic?.content_type || 'personal_story',
          selected_hook: selectedHook,
          selected_hook_index: selectedHookIndex,
          hooks: topic?.hooks || [],
          key_takeaways: topic?.key_takeaways || [],
          personal_story: topic?.personal_story || '',
          pain_points_and_struggles: topic?.pain_points_and_struggles || '',
          concrete_evidence: topic?.concrete_evidence || '',
          audience_and_relevance: topic?.audience_and_relevance || ''
        })
      })
      
      router.push(`/formula-matching?${ideationParams.toString()}`)
    }
    setShowTopicOverlay(false)
  }}
  className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
>
  Create Content Now
</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
