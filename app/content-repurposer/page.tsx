"use client"

import { useAuth } from "@/contexts/AuthContext"
import { createIdeationSession, updateIdeationSession } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"
import { useEffect } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { StickyBanner } from "@/components/ui/sticky-banner"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Upload, FileText, Mic, Youtube, Linkedin, Copy, Sparkles, Home, RotateCcw } from "lucide-react"

// Type definitions
type RepurposeType = 'blog' | 'voice' | 'youtube' | 'linkedin'
type ProcessingStage = 'input' | 'processing' | 'completed' | 'error'

interface BlogInputData {
  content: string;
  target_audience?: string;
  content_preferences?: string[];
  user_role?: string;
}

// Repurpose configuration
const REPURPOSE_CONFIG = {
  WEBHOOK_URL: process.env.NEXT_PUBLIC_REPURPOSE_WEBHOOK_URL || 'https://testcyber.app.n8n.cloud/webhook/bf05add7-f1b0-483d-8765-2c0475005645',
  CALLBACK_URL: '/api/repurpose/callback',
  POLLING: {
    MAX_ATTEMPTS: 80,
    INTERVAL_MS: 1500,
    FALLBACK_MESSAGE_AFTER: 40
  }
}

// Type guard functions
const isBlogInputData = (input: any): input is BlogInputData => {
  return input && 
         typeof input === 'object' && 
         typeof input.content === 'string' && 
         !('name' in input) && 
         !('size' in input) && 
         !('type' in input);
};

const isFile = (input: any): input is File => {
  return input instanceof File || 
         (input && 
          typeof input === 'object' && 
          'name' in input && 
          'size' in input && 
          'type' in input);
};

export default function ContentRepurposerPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<RepurposeType>("blog")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([])
  
  // New state variables for webhook integration
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('input')
  const [currentStatus, setCurrentStatus] = useState('')
  const [currentError, setCurrentError] = useState('')
  const [showRetryButton, setShowRetryButton] = useState(false)
  const [lastProcessedInput, setLastProcessedInput] = useState<string | File | BlogInputData | null>(null)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [resultsData, setResultsData] = useState<any>(null)
  const [originalContentData, setOriginalContentData] = useState<string>('')
  
  // Input states for each tab
  const [blogContent, setBlogContent] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [linkedinContent, setLinkedinContent] = useState('')

  // Webhook integration functions
  const callRepurposeAI = async (input: string | File | BlogInputData, repurposeType: RepurposeType, sessionId: string) => {
    try {
      console.log('🚀 Calling Repurpose AI webhook:', { input, repurposeType, sessionId });
      
      let payload: any = {
        repurpose_type: repurposeType,
        user_id: user?.id,
        session_id: sessionId,
        callback_url: `${window.location.origin}${REPURPOSE_CONFIG.CALLBACK_URL}`,
        timestamp: new Date().toISOString()
      };

      if (typeof input === 'string') {
        if (repurposeType === 'blog') {
          payload.content = input;
        } else {
          payload.source_url = input;
        }
      } else if (isBlogInputData(input)) {
        payload.content = input.content;
        if (input.target_audience) payload.target_audience = input.target_audience;
        if (input.content_preferences) payload.content_preferences = input.content_preferences;
        if (input.user_role) payload.user_role = input.user_role;
      } else if (isFile(input)) {
        payload.file_name = input.name;
        payload.file_size = input.size;
        payload.file_reference = `temp_${sessionId}_${input.name}`;
      }

      const response = await fetch(REPURPOSE_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('✅ Repurpose AI response:', data);
      return data;
    } catch (error) {
      console.error('❌ Repurpose AI Error:', error);
      return { error: 'Processing failed, please try again' };
    }
  };

  const pollForRepurposeResponse = async (sessionId: string) => {
    const maxAttempts = REPURPOSE_CONFIG.POLLING.MAX_ATTEMPTS;
    let attempts = 0;
    
    const poll = async (): Promise<any> => {
      try {
        const response = await fetch(`${REPURPOSE_CONFIG.CALLBACK_URL}?session_id=${sessionId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log('📨 Received repurpose response:', result.data);
          return result.data;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          console.log('⏱️ Repurpose response timeout');
          return 'TIMEOUT';
        }
        
        await new Promise(resolve => setTimeout(resolve, REPURPOSE_CONFIG.POLLING.INTERVAL_MS));
        return poll();
      } catch (error) {
        console.error('❌ Error polling for repurpose response:', error);
        return 'ERROR';
      }
    };
    
    return poll();
  };

  const handleProcess = async () => {
    if (!user) return;

    // Get current input based on active tab
    let input: string | File | BlogInputData;
    let hasValidInput = false;

    switch (activeTab) {
      case 'blog':
        if (blogContent.trim()) {
          input = blogContent.trim();
          hasValidInput = true;
        }
        break;
      case 'youtube':
        if (youtubeUrl.trim()) {
          input = youtubeUrl.trim();
          hasValidInput = true;
        }
        break;
      case 'linkedin':
        if (linkedinUrl.trim()) {
          input = linkedinUrl.trim();
          hasValidInput = true;
        } else if (linkedinContent.trim()) {
          input = linkedinContent.trim();
          hasValidInput = true;
        }
        break;
      default:
        break;
    }

    if (!hasValidInput) {
      setCurrentError('Please provide content to repurpose');
      return;
    }

    setCurrentError('');
    setLastProcessedInput(input!);
    
    try {
      setProcessingStage('processing');
      setIsProcessing(true);
      setProgress(0);
      
      const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Create ideation session
      const { data: session, error } = await createIdeationSession({
        user_id: user.id,
        page_type: 'repurpose_content',
        session_data: {
          repurpose_type: activeTab,
          processing_status: 'processing',
          original_content: typeof input! === 'string' ? input! : 'File upload'
        },
        status: 'in_progress'
      });

      if (error) throw error;
      setCurrentSession(session);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => prev < 90 ? prev + 5 : prev);
      }, 1000);

      // Call backend webhook
      setCurrentStatus('Analyzing your content...');
      const response = await callRepurposeAI(input!, activeTab, sessionId);

      if (response.message === "Workflow was started" || response.success) {
        setCurrentStatus('Generating LinkedIn content variations...');
        
        const aiResponse = await pollForRepurposeResponse(sessionId);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (aiResponse === 'TIMEOUT') {
          setCurrentStatus('');
          setProcessingStage('error');
          setCurrentError("Processing is taking longer than expected. Please try again.");
          setShowRetryButton(true);
        } else if (aiResponse === 'ERROR') {
          setCurrentStatus('');
          setProcessingStage('error');
          setCurrentError("Something went wrong while processing your content. Please try again.");
          setShowRetryButton(true);
        } else {
          // Success - display results
          setProcessingStage('completed');
          setResultsData(aiResponse);
          setOriginalContentData(typeof input! === 'string' ? input! : 'File upload');
          
          // Convert to display format
          if (aiResponse.generated_ideas && aiResponse.generated_ideas.length > 0) {
            const posts = aiResponse.generated_ideas.map((idea: any, index: number) => ({
              id: index + 1,
              angle: idea.angle || 'Generated Content',
              content: idea.content || idea.post_content || '',
              engagement: 'High',
              takeaways: idea.key_takeaways || []
            }));
            setGeneratedPosts(posts);
          }
        }
      } else {
        throw new Error(response.error || 'Failed to start processing');
      }
    } catch (error) {
      console.error('Error in handleProcess:', error);
      setProcessingStage('error');
      setCurrentError('Failed to process content. Please try again.');
      setShowRetryButton(true);
    } finally {
      setIsProcessing(false);
      setCurrentStatus('');
    }
  };

  const handleRetry = () => {
    setShowRetryButton(false);
    setCurrentError('');
    setCurrentStatus('');
    if (lastProcessedInput) {
      handleProcess();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <StickyBanner
          message="🎉 New Feature: AI-powered content suggestions now available in Ideas Hub!"
          onClose={() => {}}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Content Repurposer
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-8">
              <TypingAnimation
                className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"
                text="Content Repurposer"
              />
              <p className="text-xl text-gray-600 mb-6">Transform existing content into LinkedIn-ready ideas</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="blog" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Blog/Articles
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Notes
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Videos
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="blog" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Blog/Article Content</CardTitle>
                    <CardDescription>Paste your article content or upload a document</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Paste content directly</label>
                      <Textarea 
                        placeholder="Paste your article content here..." 
                        className="min-h-[200px]"
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Upload document files</p>
                      <p className="text-xs text-gray-500">Supports PDF, Word, TXT files</p>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Notes</CardTitle>
                    <CardDescription>Upload audio files or record directly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Drop audio files here or click to upload</p>
                      <p className="text-xs text-gray-500 mb-4">Supports MP3, WAV, M4A, OGG</p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline">Upload Files</Button>
                        <Button variant="outline">
                          <Mic className="h-4 w-4 mr-2" />
                          Record Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>YouTube Videos</CardTitle>
                    <CardDescription>Provide YouTube URL to extract content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">YouTube URL</label>
                      <Input 
                        placeholder="https://youtube.com/watch?v=..." 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                      />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Video preview will appear here</p>
                      <div className="bg-gray-200 rounded h-48 flex items-center justify-center">
                        <Youtube className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="linkedin" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>LinkedIn Posts</CardTitle>
                    <CardDescription>Repurpose existing LinkedIn content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">LinkedIn Post URL</label>
                      <Input 
                        placeholder="https://linkedin.com/posts/..." 
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Or paste post content</label>
                      <Textarea 
                        placeholder="Paste LinkedIn post content here..." 
                        className="min-h-[150px]"
                        value={linkedinContent}
                        onChange={(e) => setLinkedinContent(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Processing Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate LinkedIn Posts
                  </>
                )}
              </Button>
            </div>

            {currentError && (
              <Card className="mt-8 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Processing Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 mb-4">{currentError}</p>
                  {showRetryButton && (
                    <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300">
                      Try Again
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            {isProcessing && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Analyzing Content</CardTitle>
                  <CardDescription>Extracting key insights and generating LinkedIn variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
                  {currentStatus && (
                    <p className="text-sm text-blue-600 mt-1">{currentStatus}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {generatedPosts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Generated LinkedIn Posts</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {generatedPosts.map((post) => (
                    <Card key={post.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{post.angle} Angle</CardTitle>
                          <Badge variant={post.engagement === "High" ? "default" : "secondary"}>
                            {post.engagement} Engagement
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm whitespace-pre-line">{post.content}</p>
                        </div>
                        <Button onClick={() => copyToClipboard(post.content)} className="w-full" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
