"use client"

import { useAuth } from '../contexts/AuthContext'
import { ContentIdea, createContentIdea, getContentIdeas, updateContentIdea } from '../lib/supabase'
import { Crown, Clock, ArrowRight, TrendingUp, Target, Users, BarChart3, Sparkles } from 'lucide-react'
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GridBeams } from "@/components/magicui/grid-beams"
import { ExpandableCard } from "@/components/ui/expandable-card"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MessageSquare, Lightbulb, BookOpen, Home, Recycle, Copy, Trash2 } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface IdeaLibraryProps {
  onUseInStandardMode?: (idea: ContentIdea) => void
  onUseInWriterSuite?: (idea: ContentIdea) => void
  onUseThisContent?: (idea: ContentIdea) => void
}

export default function IdeasLibraryPage({ onUseInStandardMode, onUseInWriterSuite, onUseThisContent }: IdeaLibraryProps = {}) {
  const router = useRouter()
  const { user, profile } = useAuth()
const [ideas, setIdeas] = React.useState<ContentIdea[]>([])
const [loading, setLoading] = React.useState(false)
const [activeSection, setActiveSection] = React.useState<'active' | 'used' | 'archived'>('active')
const [selectedIdeaForOverlay, setSelectedIdeaForOverlay] = React.useState<ContentIdea | null>(null)
const [searchQuery, setSearchQuery] = React.useState("")
const [selectedFilter, setSelectedFilter] = React.useState("all")
const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  
  const handleTabChange = (value: string) => {
    if (value === "ideas-hub") {
      router.push("/ideas-hub")
    }
  }

  // Add this after the handleTabChange function:
React.useEffect(() => {
  loadSavedIdeas()
}, [user])

const loadSavedIdeas = async () => {
  if (!user) return
  setLoading(true)
  try {
    const { data, error } = await getContentIdeas(user.id, 100)
    if (error) throw error
    setIdeas(data || [])
  } catch (error) {
    console.error('Error loading saved ideas:', error)
    setIdeas([])
  } finally {
    setLoading(false)
  }
}

const handleUpdateIdea = async (ideaId: string, updates: Partial<ContentIdea>) => {
  try {
    const { error } = await updateContentIdea(ideaId, updates)
    if (error) throw error
    loadSavedIdeas()
  } catch (error) {
    console.error('Error updating idea:', error)
  }
}
  const getCategoryIcon = (pillar: string) => {
  switch (pillar) {
    case 'industry_trends': return TrendingUp
    case 'case_studies': return BarChart3
    case 'leadership': return Users
    case 'saas_metrics': return Target
    default: return Sparkles
  }
}

const getCategoryColor = (pillar: string) => {
  switch (pillar) {
    case 'industry_trends': return 'bg-blue-100 text-blue-600'
    case 'case_studies': return 'bg-green-100 text-green-600'
    case 'leadership': return 'bg-purple-100 text-purple-600'
    case 'saas_metrics': return 'bg-orange-100 text-orange-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}w ago`
}

const sectionedIdeas = {
  active: ideas.filter(idea => idea.status === 'active'),
  used: ideas.filter(idea => idea.status === 'used'), 
  archived: ideas.filter(idea => idea.status === 'archived')
}

const currentIdeas = sectionedIdeas[activeSection]

 // Replace the entire savedIdeas array and filteredIdeas logic with:
const filteredIdeas = currentIdeas.filter((idea) => {
  const matchesSearch =
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesFilter = selectedFilter === "all" || idea.content_pillar === selectedFilter
  return matchesSearch && matchesFilter
})

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
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
                        <BookOpen className="h-4 w-4" />
                        Ideas Library
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Tabs value="ideas-library" onValueChange={handleTabChange}>
                  <TabsList className="grid grid-cols-2 w-80">
                    <TabsTrigger value="ideas-hub" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Ideas Hub
                    </TabsTrigger>
                    <TabsTrigger value="ideas-library" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Ideas Library
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-6">
                {/* Page Header */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800">
                      Ideas Library
                    </h1>
                    <p className="text-gray-600 text-pretty max-w-3xl">
                      Browse, organize, and reuse your saved content ideas from conversations, topics, formulas, and
                      repurposed content.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search your saved ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filter and Sort Section */}
                {/* Status Section Tabs and Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveSection('active')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        activeSection === 'active' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Fresh Ideas ({sectionedIdeas.active.length})
                    </button>
                    <button
                      onClick={() => setActiveSection('used')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        activeSection === 'used' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Used ({sectionedIdeas.used.length})
                    </button>
                    <button
                      onClick={() => setActiveSection('archived')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        activeSection === 'archived' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Archived ({sectionedIdeas.archived.length})
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    </div>

                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Content pillar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pillars</SelectItem>
                        <SelectItem value="industry_trends">Industry Trends</SelectItem>
                        <SelectItem value="case_studies">Case Studies</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="saas_metrics">SaaS Metrics</SelectItem>
                      </SelectContent>
                    </Select>

                    {selectedItems.length > 0 && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Content Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your saved ideas...</p>
                  </div>
                ) : filteredIdeas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIdeas.map((idea) => {
                      const IconComponent = getCategoryIcon(idea.content_pillar || '')
                      return (
                        <ExpandableCard
                          key={idea.id}
                          id={idea.id}
                          title={idea.title}
                          description={idea.description}
                          date={formatTimeAgo(idea.created_at)}
                          tags={idea.tags}
                          performance="Medium"
                          icon={IconComponent}
                          color={getCategoryColor(idea.content_pillar || '')}
                          isSelected={selectedItems.includes(idea.id)}
                          onSelect={handleSelectItem}
                          type={idea.content_pillar || 'general'}
                          onClick={() => setSelectedIdeaForOverlay(idea)}
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{idea.description}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                              <Button
                                onClick={() => {
                                  onUseThisContent?.(idea)
                                  setSelectedIdeaForOverlay(null)
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                size="sm"
                              >
                                Use This Topic
                              </Button>
                            </div>
                          </div>
                        </ExpandableCard>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
                    <p className="text-gray-600 mb-4">
                      {activeSection === 'active' 
                        ? "You haven't saved any ideas yet. Visit the Ideas Hub to start brainstorming!"
                        : activeSection === 'used'
                          ? "No used ideas yet. Complete a content creation workflow to see ideas here."
                          : "No archived ideas yet."
                      }
                    </p>
                    <Button onClick={() => router.push("/ideas-hub")} className="bg-emerald-600 hover:bg-emerald-700">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Create Your First Idea
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </GridBeams>

          {/* Rich Data Overlay Modal */}
      {selectedIdeaForOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{selectedIdeaForOverlay.title}</h3>
              <button
                onClick={() => setSelectedIdeaForOverlay(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedIdeaForOverlay.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdeaForOverlay.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-6">
              <Button
                onClick={() => {
                  onUseThisContent?.(selectedIdeaForOverlay)
                  setSelectedIdeaForOverlay(null)
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white text-lg font-medium rounded-lg hover:bg-teal-700 transition"
              >
                <ArrowRight className="w-5 h-5" />
                Use This Topic
              </Button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
