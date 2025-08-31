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
} from "lucide-react"
import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function FormulaMatchingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedFormulas, setSelectedFormulas] = React.useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(true)

  // Get idea details from URL params
  const ideaId = searchParams.get("ideaId")
  const ideaTitle = searchParams.get("title") || "Content Idea"
  const ideaType = searchParams.get("type") || "topic"

  React.useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Sample matched formulas
  const matchedFormulas = [
    {
      id: "1",
      name: "Problem-Solution-Outcome",
      category: "Educational",
      matchScore: 94,
      successRate: 87,
      structure: ["Hook with Problem", "Solution Explanation", "Real-world Example", "Call to Action"],
      description: "Perfect for thought leadership content",
      isRecommended: true,
      complexity: "Medium",
      timeToComplete: "15-20 min",
      expectedEngagement: "High",
      whyMatched:
        "Your content idea focuses on solving business challenges, making this problem-solution structure ideal for maximum impact.",
      exampleSections: {
        hook: "Are you struggling with remote team productivity?",
        solution: "Here's the 3-step framework that increased our team output by 40%",
        example: "Last month, we implemented this system and saw immediate results...",
        cta: "What's your biggest remote work challenge? Share below 👇",
      },
    },
    {
      id: "2",
      name: "Story-Lesson-Application",
      category: "Storytelling",
      matchScore: 89,
      successRate: 82,
      structure: ["Personal Story", "Key Lesson", "How to Apply", "Engagement Question"],
      description: "Great for building personal connection",
      isRecommended: false,
      complexity: "Easy",
      timeToComplete: "10-15 min",
      expectedEngagement: "Medium-High",
      whyMatched:
        "The conversational nature of your idea pairs well with storytelling approaches that build trust and relatability.",
      exampleSections: {
        story: "Three years ago, I made a mistake that cost us $50K...",
        lesson: "The key insight: always validate assumptions before scaling",
        application: "Here's how you can avoid this same trap:",
        question: "Have you ever learned an expensive lesson? What was it?",
      },
    },
    {
      id: "3",
      name: "Data-Insight-Action",
      category: "Analytical",
      matchScore: 85,
      successRate: 79,
      structure: ["Surprising Data Point", "Analysis & Insight", "Actionable Steps", "Results Preview"],
      description: "Ideal for data-driven professionals",
      isRecommended: false,
      complexity: "Hard",
      timeToComplete: "20-25 min",
      expectedEngagement: "Medium",
      whyMatched:
        "Your industry context suggests an audience that values concrete data and measurable outcomes over abstract concepts.",
      exampleSections: {
        data: "73% of SaaS companies fail within their first 2 years",
        insight: "But the ones that survive share these 3 common traits...",
        action: "Here's how to implement each trait in your business:",
        results: "Companies using this approach see 2.3x higher retention rates",
      },
    },
    {
      id: "4",
      name: "Question-Answer-Deeper-Dive",
      category: "Educational",
      matchScore: 78,
      successRate: 74,
      structure: ["Compelling Question", "Direct Answer", "Deeper Explanation", "Next Steps"],
      description: "Perfect for FAQ-style content",
      isRecommended: false,
      complexity: "Easy",
      timeToComplete: "12-18 min",
      expectedEngagement: "Medium",
      whyMatched:
        "Your content idea addresses common questions in your field, making this Q&A format naturally engaging for your audience.",
      exampleSections: {
        question: "Why do most content strategies fail?",
        answer: "Because they focus on quantity over quality",
        deeper: "Here's what quality really means in content marketing...",
        steps: "Start with these 3 quality checkpoints for every piece you create",
      },
    },
  ]

  const handleFormulaSelect = (formulaId: string) => {
    setSelectedFormulas((prev) =>
      prev.includes(formulaId) ? prev.filter((id) => id !== formulaId) : [...prev, formulaId],
    )
  }

  const handleUseFormula = (formulaId: string) => {
    // Navigate to Writer Suite with selected formula
    router.push(`/writer-suite?formulaId=${formulaId}&ideaId=${ideaId}&title=${encodeURIComponent(ideaTitle)}`)
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
                        {ideaType === "conversation"
                          ? "Marcus Conversation"
                          : ideaType === "topic"
                            ? "Generated Topic"
                            : "Repurposed Content"}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg font-medium text-emerald-900">
                      {decodeURIComponent(ideaTitle)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Business Strategy</Badge>
                      <Badge variant="outline">Leadership</Badge>
                      <Badge variant="outline">B2B Audience</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Analysis Section */}
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
                    <strong>Analysis Complete!</strong> Found {matchedFormulas.length} highly compatible formulas.
                    Analyzed 47 formulas considering topic type, industry alignment, and audience preferences.
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
                    {matchedFormulas.map((formula) => (
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
