"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { 
  getContentFormulas, 
  createContentFormula, 
  updateContentFormula 
} from "@/lib/supabase"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { ExpandableCard } from "@/components/ui/expandable-card"
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
  Wrench,
  Plus,
  Search,
  Upload,
  LinkIcon,
  Sparkles,
  BarChart3,
  Copy,
  Edit,
  Trash2,
  DropletsIcon as DragHandleDots2Icon,
  Zap,
  Save,
  Play,
  RotateCcw,
  MessageCircle,
  TrendingUp,
  PenTool,
  X,
  ArrowRight,
} from "lucide-react"
import React from "react"

// Type definitions
interface ContentFormula {
  id: string
  formula_name: string
  description?: string
  category: string
  difficulty_level?: string
  effectiveness_score?: number
  reusability_score?: number
  primary_target_role?: string
  is_active?: boolean
  is_premium?: boolean
  created_at: string
  sections?: FormulaSection[]
}

interface FormulaSection {
  id: string
  formula_id: string
  section_order: number
  section_name: string
  section_purpose: string
  section_template?: string
  section_guidelines?: string
}
import Link from "next/link"

export default function FormulaWorkshopPage() {
  const { user } = useAuth()
  const [mainView, setMainView] = React.useState<"library" | "builder">("library")
  const [selectedFormula, setSelectedFormula] = React.useState<string | null>(null)
  const [showFormulaOverlay, setShowFormulaOverlay] = React.useState(false)
  const [overlayFormula, setOverlayFormula] = React.useState<ContentFormula | null>(null)
  const [formulaName, setFormulaName] = React.useState("")
  const [formulaDescription, setFormulaDescription] = React.useState("")
  const [formulaCategory, setFormulaCategory] = React.useState("")
  const [postContent, setPostContent] = React.useState("")
  const [generatedSample, setGeneratedSample] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [analysisResults, setAnalysisResults] = React.useState<any>(null)
  
  // New state for database integration
  const [formulas, setFormulas] = React.useState<ContentFormula[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')

// Load formulas from database
  const loadFormulas = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError('')
      
      // Use the existing function that already joins formulas and sections
      const { data: formulasWithSections, error: formulasError } = await getContentFormulas(user.id)
      
      if (formulasError) {
        console.error('Database error:', formulasError)
        throw formulasError
      }
      
      console.log('📊 Raw data from database:', formulasWithSections)
      
      // Transform database format to component format
      const transformedFormulas = formulasWithSections?.map((formula: any) => {
        const sections = formula.formula_sections || []
        // Sort sections by section_order
        const sortedSections = sections.sort((a: any, b: any) => a.section_order - b.section_order)
        
        return {
          id: formula.formula_id || formula.id, // Use formula_id as the universal ID
          name: formula.formula_name || 'Untitled Formula',
          category: formula.formula_category || formula.category || 'Framework',
          successRate: Math.round(formula.effectiveness_score || 85),
          usageCount: Math.floor(Math.random() * 500) + 50, // Mock usage for now
          description: formula.funnel_purpose || formula.content_intent || formula.description || 'Proven content formula',
          contentIntent: formula.content_intent,
          targetAudience: formula.target_audience,
          sectionCount: formula.section_count || sortedSections.length,
          sections: sortedSections.map((section: any) => section.section_name),
          sectionsDetailed: sortedSections, // Keep full section data for detailed view
          icon: getCategoryIcon(formula.formula_category || formula.category),
          difficulty: formula.difficulty_level || 'intermediate',
          targetRole: formula.primary_target_role || formula.target_audience || 'General',
          isActive: formula.is_active !== false,
          isPremium: formula.is_premium || false,
          formulaId: formula.formula_id || formula.id // Keep original formula_id for reference
        }
      }) || []
      
      console.log('✅ Transformed formulas:', transformedFormulas)
      setFormulas(transformedFormulas)
    } catch (err) {
      console.error('Error loading formulas:', err)
      setError('Failed to load formulas. Please check browser console for details.')
    } finally {
      setLoading(false)
    }
  }
  const handleCreateFormula = async () => {
    if (!user || !formulaName.trim() || !formulaCategory) return
    
    try {
      const newFormula = {
        formula_name: formulaName,
        description: formulaDescription,
        category: formulaCategory,
        difficulty_level: 'intermediate',
        is_active: true,
        is_custom: true,
        created_by: user.id
      }
      
      const { data, error } = await createContentFormula(newFormula)
      
      if (error) throw error
      
      // Reset form and reload formulas
      setFormulaName('')
      setFormulaDescription('')
      setFormulaCategory('')
      loadFormulas()
      
      // Close dialog - you'll need to add state for this
    } catch (err) {
      console.error('Error creating formula:', err)
      setError('Failed to create formula. Please try again.')
    }
  }
  
  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'authority': '👑',
      'contrarian': '⚡',
      'personal': '📖',
      'framework': '🎯',
      'classic': '⚡',
      'business': '💼',
      'narrative': '📖',
      'transformation': '🔄'
    }
    return icons[category?.toLowerCase()] || '⚡'
  }
  
  // Load formulas on component mount
  useEffect(() => {
    if (user) {
      loadFormulas()
    }
  }, [user])
  
  // Filter formulas based on search and category
  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || formula.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

 const handleUseFormula = (formula: ContentFormula) => {
    setOverlayFormula(formula)
    setShowFormulaOverlay(true)
  }

  const handleOverlayOption = (option: string) => {
    setShowFormulaOverlay(false)
    const formulaData = {
      formula_id: overlayFormula?.id,
      formula_name: overlayFormula?.name,
      category: overlayFormula?.category,
      description: overlayFormula?.description
    }
    
    switch (option) {
      case "chat":
        // Navigate to Marcus chat with formula context
        window.location.href = `/chat/marcus?formula=${overlayFormula?.id}&name=${encodeURIComponent(overlayFormula?.name || '')}`
        break
      case "topics":
        // Navigate to AI suggested topics with formula filter
        window.location.href = `/ideas-hub/ai-suggested?formula=${overlayFormula?.id}`
        break
      case "direct":
        // Navigate to Writer Suite with formula pre-selected
        window.location.href = `/writer-suite?mode=formula&formula=${overlayFormula?.id}`
        break
    }
  }

  const sampleFormulaSections = [
    {
      id: 1,
      title: "Hook/Attention Grabber",
      description: "Open with a compelling statement or question",
      template: "[Attention-grabbing statement or question]",
    },
    {
      id: 2,
      title: "Problem Statement",
      description: "Identify the core problem your audience faces",
      template: "[Describe the problem your audience experiences]",
    },
    {
      id: 3,
      title: "Solution Introduction",
      description: "Present your solution or approach",
      template: "[Introduce your solution or method]",
    },
    {
      id: 4,
      title: "Benefits/Results",
      description: "Show the positive outcomes",
      template: "[List key benefits or results]",
    },
    {
      id: 5,
      title: "Call to Action",
      description: "Direct your audience to take action",
      template: "[Clear call to action]",
    },
  ]

  const handleGenerateSample = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedSample(`🚀 Are you struggling to create consistent LinkedIn content that actually engages your audience?

I used to spend hours crafting posts that got 3 likes and 0 comments. Sound familiar?

Here's what changed everything for me:

✅ I started using proven content formulas
✅ I focused on solving real problems
✅ I added personal stories to every post
✅ I always included a clear call to action

The result? My engagement increased by 300% in just 2 months.

The secret isn't being perfect - it's being consistent with a system that works.

What's your biggest content creation challenge? Drop it in the comments 👇`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleAnalyzeFormula = () => {
    setAnalysisResults({
      readabilityScore: 85,
      engagementPrediction: 92,
      hookStrength: 88,
      ctaEffectiveness: 90,
      suggestions: [
        "Consider adding more specific metrics",
        "Hook could be more personalized",
        "CTA is strong and actionable",
      ],
    })
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
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
                      <Wrench className="h-4 w-4" />
                      Formula Workshop
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="space-y-4">
              <TypingAnimation
                className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800"
                text="Formula Workshop"
              />
              <p className="text-gray-600 text-pretty max-w-3xl">
                Create and customize proven content formulas that drive engagement and conversions
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Formula
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Formula</DialogTitle>
                        <DialogDescription>Start building your custom content formula</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Formula name"
                          value={formulaName}
                          onChange={(e) => setFormulaName(e.target.value)}
                        />
                        <Select value={formulaCategory} onValueChange={setFormulaCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="narrative">Narrative</SelectItem>
                            <SelectItem value="transformation">Transformation</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          placeholder="Description"
                          value={formulaDescription}
                          onChange={(e) => setFormulaDescription(e.target.value)}
                        />
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleCreateFormula}
                          disabled={!formulaName.trim() || !formulaCategory}
                        >
                          Create Formula
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Extract from Post
                  </Button>

                  <Button variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Import Formula
                  </Button>

                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search formulas..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={mainView === "library" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainView("library")}
                    className={mainView === "library" ? "bg-white shadow-sm" : ""}
                  >
                    Formula Library
                  </Button>
                  <Button
                    variant={mainView === "builder" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMainView("builder")}
                    className={mainView === "builder" ? "bg-white shadow-sm" : ""}
                  >
                    Formula Builder
                  </Button>
                </div>
              </div>
            </div>

            {mainView === "library" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-emerald-800">Formula Library</h3>
                  <Select defaultValue="effectiveness">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="effectiveness">By Success Rate</SelectItem>
                      <SelectItem value="usage">By Usage</SelectItem>
                      <SelectItem value="recent">Recently Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading formulas...</span>
                    </div>
                  ) : error ? (
                    <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{error}</p>
                      <button 
                        onClick={loadFormulas}
                        className="mt-2 text-sm text-red-700 underline hover:no-underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : filteredFormulas.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No formulas found</h3>
                      <p className="text-gray-600">Try adjusting your search or category filter.</p>
                    </div>
                  ) : filteredFormulas.map((formula) => (
                    <ExpandableCard
                      key={formula.id}
                      title={formula.name}
                      description={formula.description}
                     expandedContent={
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Success Rate</span>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            {formula.successRate}%
                          </Badge>
                        </div>
                        
                        {formula.contentIntent && (
                          <div className="text-sm">
                            <span className="text-gray-600">Intent:</span>
                            <span className="font-medium ml-2">{formula.contentIntent}</span>
                          </div>
                        )}
                        
                        {formula.targetAudience && (
                          <div className="text-sm">
                            <span className="text-gray-600">Target:</span>
                            <span className="font-medium ml-2">{formula.targetAudience}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Sections</span>
                          <span className="font-medium">{formula.sectionCount}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-gray-700">Structure:</span>
                          <div className="space-y-1">
                            {formula.sections.slice(0, 3).map((section: string, index: number) => (
                              <div key={index} className="text-xs text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                                {section}
                              </div>
                            ))}
                            {formula.sections.length > 3 && (
                              <div className="text-xs text-gray-500 ml-3.5">
                                +{formula.sections.length - 3} more sections
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleUseFormula(formula)}
                        >
                          Use This Formula
                        </Button>
                      </div>
                    }
                      className={`cursor-pointer transition-all ${selectedFormula === formula.id ? "ring-2 ring-emerald-500" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 min-h-[600px]">
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-emerald-800">Formula Library</h3>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="authority">Authority</SelectItem>
                        <SelectItem value="contrarian">Contrarian</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="framework">Framework</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="effectiveness">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="effectiveness">By Success Rate</SelectItem>
                        <SelectItem value="usage">By Usage</SelectItem>
                        <SelectItem value="recent">Recently Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {filteredFormulas.map((formula) => (
                      <ExpandableCard
                        key={formula.id}
                        title={formula.name}
                        description={formula.description}
                        expandedContent={
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Success Rate</span>
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                {formula.successRate}%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Usage Count</span>
                              <span className="font-medium">{formula.usageCount}</span>
                            </div>
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-gray-700">Sections:</span>
                              {formula.sections.map((section, index) => (
                                <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleUseFormula(formula)}
                            >
                              Use This Formula
                            </Button>
                          </div>
                        }
                        className={`cursor-pointer transition-all ${selectedFormula === formula.id ? "ring-2 ring-emerald-500" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <Tabs defaultValue="builder" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="builder">Formula Builder</TabsTrigger>
                      <TabsTrigger value="test">Test & Preview</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="builder" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-emerald-800">Formula Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Formula name" />
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="narrative">Narrative</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Textarea placeholder="Formula description and purpose" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-emerald-800">Formula Sections</CardTitle>
                          <CardDescription>Drag and drop to reorder sections</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {sampleFormulaSections.map((section) => (
                            <Card key={section.id} className="border-l-4 border-l-emerald-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <DragHandleDots2Icon className="h-5 w-5 text-gray-400 mt-1 cursor-grab" />
                                    <div className="flex-1 space-y-2">
                                      <Input defaultValue={section.title} className="font-medium" />
                                      <p className="text-sm text-gray-600">{section.description}</p>
                                      <Textarea
                                        defaultValue={section.template}
                                        className="text-sm font-mono bg-gray-50"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          <Button variant="outline" className="w-full bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Section
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="test" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-emerald-800">Test Your Formula</CardTitle>
                          <CardDescription>Generate sample posts to see how your formula performs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex gap-3">
                            <Button
                              onClick={handleGenerateSample}
                              disabled={isGenerating}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isGenerating ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Generate Sample Post
                                </>
                              )}
                            </Button>
                            <Button variant="outline">
                              <Play className="h-4 w-4 mr-2" />
                              Test Formula
                            </Button>
                          </div>

                          {generatedSample && (
                            <Card className="bg-gray-50">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Generated Sample</CardTitle>
                                  <Button size="sm" variant="outline">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="whitespace-pre-wrap text-sm">{generatedSample}</div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-emerald-800">Formula Analysis</CardTitle>
                          <CardDescription>Get insights on your formula's effectiveness</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button onClick={handleAnalyzeFormula} className="bg-emerald-600 hover:bg-emerald-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analyze Formula
                          </Button>

                          {analysisResults && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                      {analysisResults.readabilityScore}
                                    </div>
                                    <div className="text-sm text-gray-600">Readability</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                      {analysisResults.engagementPrediction}
                                    </div>
                                    <div className="text-sm text-gray-600">Engagement</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                      {analysisResults.hookStrength}
                                    </div>
                                    <div className="text-sm text-gray-600">Hook Strength</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                      {analysisResults.ctaEffectiveness}
                                    </div>
                                    <div className="text-sm text-gray-600">CTA Power</div>
                                  </CardContent>
                                </Card>
                              </div>

                              <Alert>
                                <Zap className="h-4 w-4" />
                                <AlertDescription>
                                  <div className="space-y-2">
                                    <div className="font-medium">Improvement Suggestions:</div>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {analysisResults.suggestions.map((suggestion: string, index: number) => (
                                        <li key={index}>{suggestion}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Formula
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showFormulaOverlay} onOpenChange={setShowFormulaOverlay}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{overlayFormula?.icon}</div>
                <div>
                  <DialogTitle className="text-lg">{overlayFormula?.name}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">{overlayFormula?.description}</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowFormulaOverlay(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Card
              className="cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-200 border-2"
              onClick={() => handleOverlayOption("chat")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Chat with Expert</h4>
                    <p className="text-sm text-gray-600">Discuss topic ideas with an AI specialist for this formula</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-200 border-2"
              onClick={() => handleOverlayOption("topics")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Browse Suggested Topics</h4>
                    <p className="text-sm text-gray-600">
                      Explore trending topics optimized for {overlayFormula?.name} format
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-200 border-2"
              onClick={() => handleOverlayOption("direct")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <PenTool className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">I Have a Topic</h4>
                    <p className="text-sm text-gray-600">Enter your topic and start writing immediately</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setShowFormulaOverlay(false)}>
              Cancel
            </Button>
            <p className="text-xs text-gray-500">Choose how you'd like to develop content using this formula</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
