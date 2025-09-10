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
import { useAuth } from "@/contexts/AuthContext"
import { getContentFormulas, type ContentFormula, type FormulaSection } from "@/lib/supabase"

export default function WriterSuitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [currentSection, setCurrentSection] = React.useState(1)
  const [isTemplateView, setIsTemplateView] = React.useState(true)
  const [variables, setVariables] = React.useState<Record<string, string>>({})
  const [sessionTime, setSessionTime] = React.useState(0)
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false)
  const [activeGuidanceCard, setActiveGuidanceCard] = React.useState<string | null>(null)
  
  // Real data state
  const [formula, setFormula] = React.useState<any>(null)
  const [formulaSections, setFormulaSections] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [ideationData, setIdeationData] = React.useState<any>(null)
  const [contentData, setContentData] = React.useState<{
  guidance: any
  generatedContent: any
} | null>(null)

  const formulaId = searchParams.get("formulaId")
  const ideaId = searchParams.get("ideaId")
  const ideaTitle = searchParams.get("title") || "Content Creation"
  // Load formula data from URL parameters and database
React.useEffect(() => {
  const loadFormulaData = async () => {
    if (!user || !formulaId) return
    
    try {
      setLoading(true)
      
      // Extract idea data from URL parameters
      const ideaData = {
        id: ideaId,
        title: searchParams.get("title") || "",
        description: searchParams.get("description") || "",
        type: searchParams.get("type") || "",
        contentPillar: searchParams.get("contentPillar") || "",
        tags: JSON.parse(searchParams.get("tags") || "[]"),
        sourceData: JSON.parse(searchParams.get("sourceData") || "{}")
      }
      setIdeationData(ideaData)
      
      // Load formula from database
      const { data: formulasData, error } = await getContentFormulas(user.id)
      if (error) throw error
      
      const selectedFormula = formulasData?.find(f => f.formula_id === formulaId)
      if (!selectedFormula) throw new Error("Formula not found")
      
      setFormula(selectedFormula)
      
      // Transform database sections to component format
      const dbSections = selectedFormula.formula_sections || []
      const sortedSections = dbSections.sort((a: any, b: any) => a.section_order - b.section_order)
      
      const transformedSections = sortedSections.map((section: any, index: number) => ({
        id: section.section_order,
        title: section.section_name,
        description: section.section_purpose || "Complete this section",
        variables: extractVariablesFromTemplate(section.section_template || ""),
        completed: false,
        section_template: section.section_template,
        section_guidelines: section.section_guidelines,
        word_count_target: section.word_count_target,
        psychological_purpose: section.psychological_purpose
      }))
      
      setFormulaSections(transformedSections)
      
    } catch (error) {
      console.error("Error loading formula:", error)
    } finally {
      setLoading(false)
    }
  }
  
  loadFormulaData()
}, [user, formulaId, ideaId])

// Extract template variables from section template
const extractVariablesFromTemplate = (template: string) => {
  const matches = template.match(/\[([^\]]+)\]/g) || []
  return matches.map(match => match.slice(1, -1).toLowerCase().replace(/\s+/g, '_'))
}
  
// Auto-generate content and guidance on load
React.useEffect(() => {
  if (formula && ideationData && !contentData && !loading) {
    generatePostWithGuidance()
  }
}, [formula, ideationData, contentData, loading])
   
    // Main content generation with writing guidance
const generatePostWithGuidance = async () => {
  if (!user || !formula || !ideationData) return
  
  try {
    setLoading(true)
    
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    const payload = {
      user_id: user.id,
      session_id: sessionId,
      request_type: 'generate_content_with_guidance',
      timestamp: new Date().toISOString(),
      callback_url: `${window.location.origin}/api/formulas/content/callback`,
      
      selected_formula: {
        formula_id: formula.formula_id,
        name: formula.formula_name,
        category: formula.formula_category,
        structure: formulaSections.map(s => s.title),
        sections: formula.formula_sections
      },
      
      ai_recommendation_context: formula._aiData ? {
        confidence: formula._aiData.confidence,
        whyPerfect: formula._aiData.whyPerfect,
        source: formula._aiData.source
      } : {},
      
      user_context: {
        role: user?.user_metadata?.role || 'executive'
      },
      
      // All ideation data
      title: ideationData.title,
      content_type: ideationData.sourceData.content_type || 'personal_story',
      selected_hook: ideationData.description,
      selected_hook_index: 0,
      hooks: [ideationData.description],
      key_takeaways: ideationData.tags,
      personal_story: ideationData.sourceData.personal_story || '',
      pain_points_and_struggles: ideationData.sourceData.pain_points_and_struggles || '',
      concrete_evidence: ideationData.sourceData.concrete_evidence || '',
      audience_and_relevance: ideationData.sourceData.audience_and_relevance || '',
      
      // Current variables filled in by user
      template_variables: variables
    }
    
    console.log('🚀 Generating complete post with guidance:', payload)
    
    const response = await fetch('https://testcyber.app.n8n.cloud/webhook/1f6e3c3f-b68c-4f71-b83f-7330b528db58', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (data.message === "Workflow was started") {
      console.log('🔄 Content generation started, polling for response...')
      const contentResponse = await pollForContentResponse(sessionId)
      
      if (contentResponse && contentResponse !== 'TIMEOUT' && contentResponse !== 'ERROR') {
  console.log('✅ Received complete content and guidance:', contentResponse)
  
  // Store the complete response
  setContentData(contentResponse)
  
  // Update variables with generated content
  if (contentResponse.generatedContent?.all_filled_variables) {
    setVariables(prev => ({ 
      ...prev, 
      ...contentResponse.generatedContent.all_filled_variables 
    }))
  }
  
  return contentResponse;
}
    
    return null;
  } catch (error) {
    console.error('Error generating post with guidance:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

// Polling function for content response
const pollForContentResponse = async (sessionId: string) => {
  const maxAttempts = 80
  let attempts = 0
  
  const poll = async (): Promise<any> => {
    try {
      const response = await fetch(`/api/formulas/content/callback?session_id=${sessionId}`)
      const result = await response.json()
      
      if (result.success && result.data && result.type === 'final') {
        return result.data
      }
      
      attempts++
      if (attempts >= maxAttempts) {
        return 'TIMEOUT'
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      return poll()
    } catch (error) {
      return 'ERROR'
    }
  }
  
  return poll()
};

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
  const sectionIndex = currentSection - 1
  
  // Get guidance from backend response
  const backendGuidance = contentData?.guidance?.writing_guidance_sections?.[sectionIndex]
  
  const content = {
    "ai-enhancement": {
      title: "AI Enhancement",
      content: backendGuidance?.ai_enhancement || `Enhance your ${sectionTitle.toLowerCase()} with AI-powered suggestions.`,
    },
    "why-matters": {
      title: "Why This Matters", 
      content: backendGuidance?.why_this_matters || currentSectionData?.psychological_purpose || `Your ${sectionTitle.toLowerCase()} needs to immediately show value to your audience.`,
    },
    "story-essentials": {
      title: "Story Essentials",
      content: backendGuidance?.story_essentials || currentSectionData?.section_guidelines || `For your ${sectionTitle.toLowerCase()}, include relatable details and clear structure.`,
    },
    "writing-techniques": {
      title: "Writing Techniques", 
      content: backendGuidance?.writing_techniques || `Use short, punchy sentences. Target: ${currentSectionData?.word_count_target || 50} words.`,
    },
    "know-reader": {
      title: "Know Your Reader",
      content: backendGuidance?.know_your_reader || `Your audience for this ${sectionTitle.toLowerCase()} likely struggles with time constraints.`,
    },
    "emotional-arc": {
      title: "Emotional Arc",
      content: backendGuidance?.emotional_arc || currentSectionData?.psychological_purpose || `Create emotional connection in your ${sectionTitle.toLowerCase()}.`,
    },
    "voice-tone": {
      title: "Voice and Tone",
      content: backendGuidance?.voice_and_tone || `Maintain a professional yet approachable tone in your ${sectionTitle.toLowerCase()}.`,
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
    // Show template with current variables
    return formulaSections.map(section => {
      const sectionContent = section.variables.map(v => 
        variables[v] || `[${v.replace(/_/g, ' ').toUpperCase()}]`
      ).join('\n\n')
      return sectionContent
    }).join('\n\n---\n\n')
  } else {
    // Show AI-generated complete post
    if (contentData?.generatedContent?.generated_content?.complete_post) {
      return contentData.generatedContent.generated_content.complete_post
    }
    
    // Fallback to filled variables
    return formulaSections.map(section => {
      const sectionContent = section.variables.map(v => 
        variables[v] || `Your ${v.replace(/_/g, ' ')} goes here...`
      ).join('\n\n')
      return sectionContent
    }).join('\n\n')
  }
}

  // Add loading checks here - right before the main return
  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading formula...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!formula) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Formula not found</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
          </div>
        </div>
      </div>
    )
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:text-emerald-700"
                              onClick={() => generatePostWithGuidance()}
                            >
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
  {currentSection === formulaSections.length ? (
    <Button
      size="sm"
      onClick={generatePostWithGuidance}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700 flex-1"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-1" />
          Generate Post
        </>
      )}
    </Button>
  ) : (
    <Button
      size="sm"
      onClick={() => setCurrentSection(Math.min(formulaSections.length, currentSection + 1))}
      disabled={currentSection === formulaSections.length}
      className="bg-emerald-600 hover:bg-emerald-700 flex-1"
    >
      Next
      <ArrowRight className="h-4 w-4 ml-1" />
    </Button>
  )}
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
