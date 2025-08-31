"use client"

import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { GridBeams } from "@/components/magicui/grid-beams"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Home,
  Target,
  PenTool,
  Save,
  Clock,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Users,
  Heart,
  Mic,
  Sparkles,
  Eye,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Globe,
  X,
} from "lucide-react"
import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function WriterSuitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSection, setCurrentSection] = React.useState(1)
  const [isTemplateView, setIsTemplateView] = React.useState(true)
  const [variables, setVariables] = React.useState<Record<string, string>>({})
  const [sessionTime, setSessionTime] = React.useState(0)
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false)
  const [activeGuidanceCard, setActiveGuidanceCard] = React.useState<string | null>(null)

  const formulaId = searchParams.get("formulaId")
  const ideaId = searchParams.get("ideaId")
  const ideaTitle = searchParams.get("title") || "Content Creation"

  const formulaSections = [
    {
      id: 1,
      title: "Hook & Problem",
      description: "Grab attention with a compelling opening",
      variables: ["hook_statement", "problem_description", "target_audience"],
      completed: true,
    },
    {
      id: 2,
      title: "Solution Introduction",
      description: "Present your solution clearly",
      variables: ["solution_overview", "key_benefit", "credibility_marker"],
      completed: false,
    },
    {
      id: 3,
      title: "Supporting Evidence",
      description: "Provide proof and examples",
      variables: ["example_story", "data_point", "social_proof"],
      completed: false,
    },
    {
      id: 4,
      title: "Implementation Steps",
      description: "Show how to apply the solution",
      variables: ["step_1", "step_2", "step_3", "implementation_tip"],
      completed: false,
    },
    {
      id: 5,
      title: "Call to Action",
      description: "Drive engagement and next steps",
      variables: ["cta_statement", "engagement_question", "next_step"],
      completed: false,
    },
  ]

  const currentSectionData = formulaSections.find((s) => s.id === currentSection)

  const guidanceTypes = [
    {
      id: "ai-enhancement",
      icon: Sparkles,
      title: "AI Enhancement",
    },
    {
      id: "why-matters",
      icon: Lightbulb,
      title: "Why This Matters",
    },
    {
      id: "story-essentials",
      icon: BookOpen,
      title: "Story Essentials",
    },
    {
      id: "writing-techniques",
      icon: PenTool,
      title: "Writing Techniques",
    },
    {
      id: "know-reader",
      icon: Users,
      title: "Know Your Reader",
    },
    {
      id: "emotional-arc",
      icon: Heart,
      title: "Emotional Arc",
    },
    {
      id: "voice-tone",
      icon: Mic,
      title: "Voice and Tone",
    },
  ]

  const getGuidanceContent = (guidanceId: string) => {
    const sectionTitle = currentSectionData?.title || "Current Section"

    const content = {
      "ai-enhancement": {
        title: "AI Enhancement",
        content: `Enhance your ${sectionTitle.toLowerCase()} with AI-powered suggestions. Get real-time improvements for clarity, engagement, and impact based on successful LinkedIn posts.`,
      },
      "why-matters": {
        title: "Why This Matters",
        content: `Your ${sectionTitle.toLowerCase()} needs to immediately show value to your audience. Focus on the specific problem this solves and why your readers should care right now.`,
      },
      "story-essentials": {
        title: "Story Essentials",
        content: `For your ${sectionTitle.toLowerCase()}, include a relatable character, clear conflict, and satisfying resolution. Use specific details and emotional hooks to keep readers engaged.`,
      },
      "writing-techniques": {
        title: "Writing Techniques",
        content: `Use short, punchy sentences for your ${sectionTitle.toLowerCase()}. Start with action words, include specific numbers, and break up text with line breaks for better readability.`,
      },
      "know-reader": {
        title: "Know Your Reader",
        content: `Your audience for this ${sectionTitle.toLowerCase()} likely struggles with time constraints and information overload. Speak directly to their pain points and use language they use.`,
      },
      "emotional-arc": {
        title: "Emotional Arc",
        content: `Take readers from curiosity to understanding in your ${sectionTitle.toLowerCase()}. Start with intrigue, build tension around the problem, then provide relief with your solution.`,
      },
      "voice-tone": {
        title: "Voice and Tone",
        content: `Maintain a professional yet approachable tone in your ${sectionTitle.toLowerCase()}. Be confident without being arrogant, and helpful without being condescending.`,
      },
    }

    return content[guidanceId as keyof typeof content] || content["why-matters"]
  }

  const handleGuidanceClick = (guidanceId: string) => {
    if (activeGuidanceCard === guidanceId) {
      setActiveGuidanceCard(null)
    } else {
      setActiveGuidanceCard(guidanceId)
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (activeGuidanceCard && !target.closest(".guidance-card") && !target.closest(".guidance-icon")) {
        setActiveGuidanceCard(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeGuidanceCard])

  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeGuidanceCard) {
        setActiveGuidanceCard(null)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [activeGuidanceCard])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVariableChange = (variable: string, value: string) => {
    setVariables((prev) => ({ ...prev, [variable]: value }))
  }

  const generatePreview = () => {
    if (isTemplateView) {
      return `[${variables.hook_statement || "HOOK_STATEMENT"}]

[${variables.problem_description || "PROBLEM_DESCRIPTION"}]

[${variables.solution_overview || "SOLUTION_OVERVIEW"}]

[${variables.key_benefit || "KEY_BENEFIT"}]

[${variables.cta_statement || "CTA_STATEMENT"}]`
    } else {
      return `${variables.hook_statement || "Your compelling hook goes here..."}

${variables.problem_description || "Describe the problem your audience faces..."}

${variables.solution_overview || "Present your solution clearly..."}

${variables.key_benefit || "Highlight the main benefit..."}

${variables.cta_statement || "What's your call to action?"}`
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">
          <GridBeams
            className="min-h-full"
            backgroundColor="rgba(255, 255, 255, 0.95)"
            gridColor="rgba(16, 185, 129, 0.1)"
            rayCount={8}
            rayOpacity={0.15}
            gridSize={60}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Breadcrumb>
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
                        <BreadcrumbLink asChild>
                          <Link href="/formula-matching" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Formula Matching
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="flex items-center gap-2">
                          <PenTool className="h-4 w-4" />
                          Writer Suite
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <TypingAnimation
                    className="text-2xl font-medium tracking-tight text-balance font-sans text-emerald-800"
                    text="Writer Suite"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(sessionTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Save className="h-4 w-4" />
                    <span>Auto-saved</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    Exit
                  </Button>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-800">Content Context</CardTitle>
                  <CardDescription className="text-emerald-900 font-medium">
                    {decodeURIComponent(ideaTitle)}
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    {formulaSections.map((section, index) => (
                      <React.Fragment key={section.id}>
                        <div
                          className={`flex flex-col items-center cursor-pointer transition-all ${
                            currentSection === section.id ? "scale-110" : ""
                          }`}
                          onClick={() => setCurrentSection(section.id)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full transition-colors ${
                              section.completed
                                ? "bg-green-500"
                                : currentSection === section.id
                                  ? "bg-emerald-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs mt-2 text-gray-600 max-w-16 text-center leading-tight">
                            {section.title}
                          </span>
                        </div>
                        {index < formulaSections.length - 1 && <div className="w-8 h-0.5 bg-gray-300 mt-[-20px]" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Section Variables
                        <Badge variant="secondary">{currentSectionData?.title}</Badge>
                      </CardTitle>
                      <CardDescription>{currentSectionData?.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentSectionData?.variables.map((variable) => (
                        <div key={variable} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 capitalize">
                              {variable.replace(/_/g, " ")}
                            </label>
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                              <Sparkles className="h-4 w-4 mr-1" />
                              AI Suggest
                            </Button>
                          </div>
                          <Textarea
                            placeholder={`Enter your ${variable.replace(/_/g, " ")}...`}
                            value={variables[variable] || ""}
                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="text-xs text-gray-500">{variables[variable]?.length || 0} characters</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                          disabled={currentSection === 1}
                          className="flex-1"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setCurrentSection(Math.min(5, currentSection + 1))}
                          disabled={currentSection === 5}
                          className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          LinkedIn Preview
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Template</span>
                          <Switch
                            checked={!isTemplateView}
                            onCheckedChange={(checked) => setIsTemplateView(!checked)}
                          />
                          <span className="text-sm text-gray-600">Generated</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              YN
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">Your Name</h3>
                              </div>
                              <p className="text-sm text-gray-600">Finance Professional • 1st</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <span>2h</span>
                                <span>•</span>
                                <Globe className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">{generatePreview()}</div>
                        </div>

                        <div className="px-4 py-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <ThumbsUp className="h-5 w-5" />
                                <span className="text-sm font-medium">Like</span>
                              </button>
                              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Comment</span>
                              </button>
                              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Repeat2 className="h-5 w-5" />
                                <span className="text-sm font-medium">Repost</span>
                              </button>
                              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Send className="h-5 w-5" />
                                <span className="text-sm font-medium">Send</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </GridBeams>
        </div>
      </div>

      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        {!isToolbarVisible ? (
          <div
            className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 shadow-lg"
            onClick={() => setIsToolbarVisible(true)}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="flex flex-col gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 shadow-lg">
            <div
              className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-all duration-200"
              onClick={() => setIsToolbarVisible(false)}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </div>
            {guidanceTypes.map((item) => (
              <div key={item.id} className="relative">
                <div
                  className={`guidance-icon group relative flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-all duration-200 hover:scale-110 ${
                    activeGuidanceCard === item.id
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                  }`}
                  onClick={() => handleGuidanceClick(item.id)}
                >
                  <item.icon className="h-5 w-5" />

                  {activeGuidanceCard !== item.id && (
                    <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      <div className="font-medium">{item.title}</div>
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                    </div>
                  )}
                </div>

                {activeGuidanceCard === item.id && (
                  <div
                    className="guidance-card absolute right-full mr-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{getGuidanceContent(item.id).title}</h3>
                      <button
                        onClick={() => setActiveGuidanceCard(null)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{getGuidanceContent(item.id).content}</p>

                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-white"></div>
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 translate-x-[-1px] border-8 border-transparent border-l-gray-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
