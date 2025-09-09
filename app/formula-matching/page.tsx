"use client"

import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExpandableCard } from "@/components/ui/expandable-card"
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
  Lightbulb,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  Bookmark,
  CheckCircle,
  Star,
  Zap,
  AlertCircle,
} from "lucide-react"
import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { getContentFormulas } from "@/lib/supabase"

export default function FormulaMatchingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [selectedFormulas, setSelectedFormulas] = React.useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(true)
  const [aiFormulas, setAiFormulas] = React.useState<any[]>([])
  const [dbFormulas, setDbFormulas] = React.useState<any[]>([])
  const [enhancedFormulas, setEnhancedFormulas] = React.useState<any[]>([])
  const [error, setError] = React.useState<string>('')

  // Get idea details from URL params
const ideaId = searchParams.get("ideaId")
const ideaTitle = searchParams.get("title") || "Content Idea"
const ideaDescription = searchParams.get("description") || ""
const ideaType = searchParams.get("type") || "topic"
const contentPillar = searchParams.get("contentPillar") || ""
const ideaTags = JSON.parse(searchParams.get("tags") || "[]")
const sourceData = JSON.parse(searchParams.get("sourceData") || "{}")

// Extract additional data from source_data
const contentType = sourceData.content_type || ideaType
const hooks = sourceData.hooks || []
const keyTakeaways = sourceData.key_takeaways || ideaTags
const personalStory = sourceData.personal_story || ""
const hasRichData = Object.keys(sourceData).length > 0

 React.useEffect(() => {
  if (user && ideaId && !isAnalyzing) {
    loadFormulasAndRecommendations()
  }
}, [user, ideaId])

  // Cleanup useEffect to prevent memory leaks
React.useEffect(() => {
  return () => {
    // Cleanup function to prevent memory leaks
    setIsAnalyzing(false)
  }
}, [])

  // Webhook integration functions
const callFormulaRecommendationAI = async (ideaData: any, sessionId: string) => {
  const FORMULA_WEBHOOK_URL = 'https://testcyber.app.n8n.cloud/webhook/1f6e3c3f-b68c-4f71-b83f-7330b528db58'
  
  try {
    console.log('🚀 Calling Formula AI webhook:', { ideaData, sessionId })
    
    const payload = {
  user_id: user?.id,
  session_id: sessionId,
  request_type: 'generate_content_with_guidance',
  timestamp: new Date().toISOString(),
  callback_url: `${window.location.origin}/api/formulas/content/callback`,
      
      title: ideaData.title,
content_type: ideaData.contentType || 'personal_story',
selected_hook: ideaData.description,
hooks: [ideaData.description],
key_takeaways: ideaData.tags,
personal_story: ideaData.sourceData.personal_story || '',
pain_points_and_struggles: ideaData.sourceData.pain_points_and_struggles || '',
concrete_evidence: ideaData.sourceData.concrete_evidence || '',
audience_and_relevance: ideaData.sourceData.audience_and_relevance || '',

user_context: {
  role: user?.user_metadata?.role || 'executive'
}
    }

    const response = await fetch(FORMULA_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log('✅ Formula AI response:', data)
    return data
  } catch (error) {
    console.error('❌ Formula AI Error:', error)
    return { error: 'Failed to get formula recommendations' }
  }
}

const pollForFormulaResponse = async (sessionId: string) => {
  const maxAttempts = 40
  let attempts = 0
  
  const poll = async (): Promise<any> => {
    try {
      const response = await fetch(`/api/formulas/content/callback?session_id=${sessionId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        console.log('📨 Received formula recommendations:', result.data)
        // Check if data has the expected structure
        if (result.data.recommended_formulas || result.data.formulas) {
          return result.data
        }
        // Return the data as-is if it has a different structure
        return { recommended_formulas: [] }
      }
      
      attempts++
      if (attempts >= maxAttempts) {
        console.log('⏱️ Formula recommendation timeout')
        return null
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      return poll()
    } catch (error) {
      console.error('❌ Error polling for formula response:', error)
      return null
    }
  }
  
  return poll()
}

// Load database formulas and get AI recommendations
const loadFormulasAndRecommendations = async () => {
  if (!user) return
  
  try {
    setIsAnalyzing(true)
    setError('')
    
    // Load database formulas
    const { data: formulasData, error: formulasError } = await getContentFormulas(user.id)
    if (formulasError) throw formulasError
    
    setDbFormulas(formulasData || [])
    
    // Prepare idea data for AI analysis
    const ideaData = {
      title: ideaTitle,
      description: ideaDescription,
      contentType: contentType,
      contentPillar: contentPillar,
      tags: ideaTags,
      sourceData: sourceData
    }
    
    // Get AI recommendations
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    const aiResponse = await callFormulaRecommendationAI(ideaData, sessionId)
    
    if (aiResponse.message === "Workflow was started" || aiResponse.success) {
      const aiRecommendations = await pollForFormulaResponse(sessionId)
      
      if (aiRecommendations && aiRecommendations.recommended_formulas) {
        setAiFormulas(aiRecommendations.recommended_formulas)
        
        // Enhance database formulas with AI recommendations
        const enhanced = enhanceFormulasWithAI(formulasData || [], aiRecommendations.recommended_formulas)
        setEnhancedFormulas(enhanced)
      } else {
        // No AI recommendations, use database formulas only
        setEnhancedFormulas(formulasData || [])
      }
    } else {
      throw new Error(aiResponse.error || 'Failed to get recommendations')
    }
  } catch (error) {
    console.error('Error loading formulas:', error)
    setError('Failed to get formula recommendations. Showing available formulas.')
    setEnhancedFormulas(dbFormulas)
  } finally {
    setIsAnalyzing(false)
  }
}

// Enhance database formulas with AI recommendations
const enhanceFormulasWithAI = (dbFormulas: any[], aiRecommendations: any[]) => {
  return dbFormulas.map(dbFormula => {
    const aiMatch = aiRecommendations.find(ai => ai.formula_id === dbFormula.formula_id)
    
    if (aiMatch) {
      return {
        ...dbFormula,
        id: dbFormula.formula_id,
        name: dbFormula.formula_name,
        description: dbFormula.funnel_purpose || dbFormula.description,
        category: dbFormula.formula_category || 'Framework',
        matchScore: Math.round(aiMatch.match_score || 85),
        successRate: Math.round(dbFormula.effectiveness_score || 80),
        isRecommended: aiMatch.match_score > 90,
        whyMatched: aiMatch.why_it_works || 'Good match for your content type',
        structure: dbFormula.formula_sections?.map((s: any) => s.section_name) || [],
        complexity: dbFormula.difficulty_level || 'Medium',
        timeToComplete: `${Math.round((dbFormula.estimated_word_count || 400) / 100) * 5}-${Math.round((dbFormula.estimated_word_count || 400) / 100) * 7} min`,
        expectedEngagement: aiMatch.match_score > 90 ? 'High' : aiMatch.match_score > 80 ? 'Medium-High' : 'Medium',
        _aiData: {
          confidence: aiMatch.match_score,
          whyPerfect: aiMatch.why_it_works,
          source: 'AI Analysis'
        },
        exampleSections: {
          hook: `Hook for: ${dbFormula.formula_name}`,
          main: "Main content section...",
          insight: "Key insight or takeaway...",
          cta: "What's your experience? Share below 👇"
        }
      }
    }
    
    return {
      ...dbFormula,
      id: dbFormula.formula_id,
      name: dbFormula.formula_name,
      description: dbFormula.funnel_purpose || dbFormula.description,
      category: dbFormula.formula_category || 'Framework',
      matchScore: Math.round(dbFormula.effectiveness_score || 75),
      successRate: Math.round(dbFormula.effectiveness_score || 80),
      isRecommended: false,
      whyMatched: 'Available formula from your library',
      structure: dbFormula.formula_sections?.map((s: any) => s.section_name) || [],
      complexity: dbFormula.difficulty_level || 'Medium',
      timeToComplete: `${Math.round((dbFormula.estimated_word_count || 400) / 100) * 5}-${Math.round((dbFormula.estimated_word_count || 400) / 100) * 7} min`,
      expectedEngagement: 'Medium',
      exampleSections: {
        hook: `Hook for: ${dbFormula.formula_name}`,
        main: "Main content section...",
        insight: "Key insight or takeaway...",
        cta: "What's your experience? Share below 👇"
      }
    }
  })
}

  const handleFormulaSelect = (formulaId: string) => {
    setSelectedFormulas((prev) =>
      prev.includes(formulaId) ? prev.filter((id) => id !== formulaId) : [...prev, formulaId],
    )
  }

  const handleUseFormula = (formulaId: string) => {
  // Navigate to Writer Suite with selected formula and complete idea data
  const writerSuiteParams = new URLSearchParams({
    formulaId: formulaId,
    ideaId: ideaId || '',
    title: ideaTitle,
    description: ideaDescription,
    type: ideaType,
    contentPillar: contentPillar,
    tags: JSON.stringify(ideaTags),
    sourceData: JSON.stringify(sourceData)
  })
  router.push(`/writer-suite?${writerSuiteParams.toString()}`)
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
            rayCount={12}
            rayOpacity={0.2}
            gridSize={50}
          >
            <div className="p-6 space-y-8">
              {/* Breadcrumb Navigation */}
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
                      <Link href="/ideas-hub" className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Ideas Hub
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Formula Matching
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Hero Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <TypingAnimation
                    className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800"
                    text="Formula Matching"
                  />
                  <p className="text-gray-600 text-pretty max-w-3xl">AI-matched formulas for your content idea</p>
                </div>

                {/* Content Idea Display */}
                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-800">Your Content Idea</CardTitle>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {ideaType === "ai_generated" && sourceData.source_page === "talk_with_marcus"
                        ? "Marcus Conversation"
                        : ideaType === "ai_generated"
                          ? "AI Generated Topic"
                          : ideaType === "trending"
                            ? "Trending Topic"
                            : "Saved Idea"}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-emerald-900">
                    {decodeURIComponent(ideaTitle)}
                  </CardDescription>
                  {ideaDescription && (
                    <CardDescription className="text-sm text-emerald-700 mt-2">
                      {decodeURIComponent(ideaDescription)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Dynamic tags from actual idea data */}
                    <div className="flex flex-wrap gap-2">
                      {contentPillar && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {contentPillar.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      )}
                      {ideaTags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {ideaTags.length > 3 && (
                        <Badge variant="outline" className="text-gray-500">
                          +{ideaTags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {/* Show rich data if available */}
                    {hasRichData && (
                      <div className="text-sm text-emerald-800">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span>Enhanced with Marcus ideation data</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                </Card>
              </div>

              {/* AI Analysis Section */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {isAnalyzing ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      Analyzing Your Content Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Matching formulas...</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Analyzing topic type, industry context, and target audience to find the best formula matches.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Alert className="border-emerald-200 bg-emerald-50">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    <strong>Analysis Complete!</strong> Found {enhancedFormulas.length} highly compatible formulas for "{ideaTitle}".
                    {hasRichData 
                      ? `Analyzed using rich ideation data including ${keyTakeaways.length} key takeaways and content structure.`
                      : "Analyzed based on topic type, content pillar, and available context."
                    }
                  </AlertDescription>
                </Alert>
              )}

              {/* Formula Options */}
              {!isAnalyzing && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">Matched Formulas</h2>
                    {selectedFormulas.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{selectedFormulas.length} selected</span>
                        <Button variant="outline" size="sm">
                          Compare Selected
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enhancedFormulas.map((formula) => (
                      <ExpandableCard
                        key={formula.id}
                        id={formula.id}
                        title={formula.name}
                        description={formula.description}
                        date={`${formula.matchScore}% match`}
                        tags={[formula.category, formula.complexity, formula.expectedEngagement]}
                        performance={`${formula.successRate}% success rate`}
                        icon={formula.isRecommended ? Star : Target}
                        color={formula.isRecommended ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}
                        isSelected={selectedFormulas.includes(formula.id)}
                        onSelect={handleFormulaSelect}
                      >
                        <div className="space-y-4">
                          {formula.isRecommended && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Star className="h-3 w-3 mr-1" />
                              AI Recommended
                            </Badge>
                          )}

                          {/* Formula Structure */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Formula Structure</h4>
                            <div className="space-y-2">
                              {formula.structure.map((section, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                  </div>
                                  <span>{section}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-xs text-gray-500">Time to Complete</span>
                              </div>
                              <span className="text-sm font-medium">{formula.timeToComplete}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                <span className="text-xs text-gray-500">Expected Engagement</span>
                              </div>
                              <span className="text-sm font-medium">{formula.expectedEngagement}</span>
                            </div>
                          </div>

                          {/* Why This Match */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Why This Match?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{formula.whyMatched}</p>
                          </div>

                          {/* Example Sections */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Example Structure</h4>
                            <div className="space-y-2">
                              {Object.entries(formula.exampleSections).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-2 rounded text-xs">
                                  <span className="font-medium text-gray-700 capitalize">{key}:</span>
                                  <span className="ml-2 text-gray-600">"{value}"</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <Button
                              onClick={() => handleUseFormula(formula.id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              size="sm"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Use This Formula
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </ExpandableCard>
                    ))}
                  </div>

                  {/* Alternative Actions */}
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                    <Button variant="outline">Show More Formulas</Button>
                    <Button variant="outline">Edit Content Idea</Button>
                    <Button variant="ghost">Skip Formula (Freeform)</Button>
                  </div>
                </div>
              )}
            </div>
          </GridBeams>
        </div>
      </div>
    </div>
  )
}
