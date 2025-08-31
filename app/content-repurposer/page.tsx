"use client"

import { useState } from "react"
import Link from "next/link"
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

export default function ContentRepurposerPage() {
  const [activeTab, setActiveTab] = useState("blog")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([])

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Generate mock LinkedIn posts
          setGeneratedPosts([
            {
              id: 1,
              angle: "Educational",
              content:
                "🎯 Just discovered 3 game-changing insights about content strategy:\n\n1. Quality beats quantity every time\n2. Authentic storytelling drives engagement\n3. Consistency builds trust\n\nWhich resonates most with your experience?",
              engagement: "High",
            },
            {
              id: 2,
              angle: "Personal Story",
              content:
                "Yesterday, I learned something that completely changed my perspective on content creation...\n\nIt's not about having the perfect strategy.\nIt's about being genuinely helpful to your audience.\n\nWhat's one lesson that transformed your approach?",
              engagement: "Medium",
            },
            {
              id: 3,
              angle: "Question-Based",
              content:
                "Quick question for content creators:\n\nWhat's your biggest challenge right now?\n\n• Finding time to create\n• Coming up with ideas\n• Measuring success\n• Building an audience\n\nDrop your answer below 👇",
              engagement: "High",
            },
          ])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

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
                      <Textarea placeholder="Paste your article content here..." className="min-h-[200px]" />
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
                      <Input placeholder="https://youtube.com/watch?v=..." />
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
                      <Input placeholder="https://linkedin.com/posts/..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Or paste post content</label>
                      <Textarea placeholder="Paste LinkedIn post content here..." className="min-h-[150px]" />
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

            {isProcessing && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Analyzing Content</CardTitle>
                  <CardDescription>Extracting key insights and generating LinkedIn variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
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
