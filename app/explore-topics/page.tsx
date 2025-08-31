"use client"

import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Grid3X3,
  List,
  Filter,
  Save,
  Check,
  Home,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import React from "react"
import Link from "next/link"

const contentIdeas = [
  {
    id: 1,
    category: "From Chasing to...",
    title: "The Step-by-Step Guide to Closing Deals Confidently",
    description:
      "Learn the proven framework that transforms hesitant prospects into eager customers through strategic questioning and value demonstration.",
  },
  {
    id: 2,
    category: "From Chasing to...",
    title: "What Predictable Lead Flow Really Looks Like",
    description:
      "Discover the systematic approach to generating consistent, high-quality leads without the feast-or-famine cycle.",
  },
  {
    id: 3,
    category: "From Chasing to...",
    title: "Common Sales Mistakes Keeping You Stuck in Chase Mode",
    description:
      "Identify and eliminate the 5 critical errors that force you to constantly pursue prospects instead of attracting them.",
  },
  {
    id: 4,
    category: "From Chasing to...",
    title: "Quick Wins for Systematic Lead Generation",
    description:
      "Implement these 3 simple strategies today to start building a predictable pipeline of qualified prospects.",
  },
  {
    id: 5,
    category: "From Chasing to...",
    title: "The Psychology of Selling: Abundance vs. Scarcity",
    description:
      "Understand how your mindset directly impacts your sales results and learn to operate from a position of strength.",
  },
  {
    id: 6,
    category: "Growth Strategy",
    title: "Building Authority in Your Niche Market",
    description: "Position yourself as the go-to expert through strategic content creation and thought leadership.",
  },
  {
    id: 7,
    category: "Content Marketing",
    title: "The Content Framework That Converts",
    description: "Master the proven structure that turns casual readers into engaged prospects and paying customers.",
  },
  {
    id: 8,
    category: "LinkedIn Strategy",
    title: "LinkedIn Engagement Secrets for B2B Leaders",
    description:
      "Unlock the tactics that top performers use to build meaningful connections and drive business results.",
  },
  {
    id: 9,
    category: "Personal Branding",
    title: "Authentic Personal Branding That Attracts Clients",
    description:
      "Develop a compelling personal brand that resonates with your ideal audience and drives business growth.",
  },
  {
    id: 10,
    category: "Sales Psychology",
    title: "The Trust Factor: Building Rapport That Sells",
    description: "Learn the psychological principles that create instant connection and accelerate the sales process.",
  },
]

export default function ExploreTopicsPage() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [viewMode, setViewMode] = React.useState<"cards" | "list">("cards")
  const [dismissedCards, setDismissedCards] = React.useState<number[]>([])
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editingText, setEditingText] = React.useState("")

  const availableIdeas = contentIdeas.filter((idea) => !dismissedCards.includes(idea.id))
  const currentIdea = availableIdeas[currentIndex]
  const progress = ((currentIndex + 1) / availableIdeas.length) * 100

  const handleNext = () => {
    if (currentIndex < availableIdeas.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleDismiss = () => {
    if (currentIdea) {
      setDismissedCards([...dismissedCards, currentIdea.id])
      if (currentIndex >= availableIdeas.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1))
      }
    }
  }

  const handleGenerate = () => {
    console.log("Generate post for:", currentIdea?.title)
    // Handle post generation logic
  }

  const handleEdit = (idea: (typeof contentIdeas)[0]) => {
    setEditingId(idea.id)
    setEditingText(idea.title)
  }

  const handleSaveEdit = () => {
    const ideaIndex = contentIdeas.findIndex((idea) => idea.id === editingId)
    if (ideaIndex !== -1) {
      contentIdeas[ideaIndex].title = editingText
    }
    setEditingId(null)
    setEditingText("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50 min-h-screen">
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
                    <TrendingUp className="h-4 w-4" />
                    Explore Topics
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <Button variant="outline" className="bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600">
                <Filter className="h-4 w-4 mr-2" />
                Filter Ideas
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className={viewMode === "cards" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 ml-4">Post Credits</span>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-4">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Content Ideas ({availableIdeas.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availableIdeas.map((idea) => (
                      <Card key={idea.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Badge variant="secondary" className="mb-2 bg-emerald-100 text-emerald-700">
                                {idea.category}
                              </Badge>
                              {editingId === idea.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-900 rounded-lg resize-none font-medium text-gray-900"
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={handleSaveEdit}
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancelEdit}
                                      className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <h3 className="font-medium text-gray-900 mb-1">{idea.title}</h3>
                              )}
                            </div>
                            {editingId !== idea.id && (
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(idea)}>
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  <Save className="h-4 w-4 mr-2" />
                                  Save to Library
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                {currentIdea ? (
                  <div className="relative w-full max-w-4xl">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
                      onClick={handleNext}
                      disabled={currentIndex >= availableIdeas.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Card className="mx-16 bg-white shadow-xl min-h-[400px]">
                      <CardHeader className="text-center pb-4 relative">
                        <Badge variant="secondary" className="w-fit mx-auto mb-4 bg-emerald-100 text-emerald-700">
                          {currentIdea.category}
                        </Badge>
                        {editingId === currentIdea.id ? (
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4"
                            onClick={() => handleEdit(currentIdea)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        )}
                      </CardHeader>

                      <CardContent className="text-center space-y-6 px-8">
                        <div className="space-y-4">
                          {editingId === currentIdea.id ? (
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full p-4 border-2 border-gray-900 rounded-lg resize-none text-xl font-medium text-gray-900 text-center min-h-[120px]"
                              rows={4}
                            />
                          ) : (
                            <>
                              <h2 className="text-2xl font-medium text-gray-900 leading-tight">{currentIdea.title}</h2>
                              <p
                                className="text-emerald-600 cursor-pointer hover:underline"
                                onClick={() => handleEdit(currentIdea)}
                              >
                                Add additional context
                              </p>
                            </>
                          )}
                        </div>

                        {editingId !== currentIdea.id && (
                          <div className="flex items-center justify-center gap-4 pt-8">
                            <Button
                              variant="outline"
                              onClick={handleDismiss}
                              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            >
                              <X className="h-4 w-4" />
                              Dismiss Idea
                            </Button>

                            <Button
                              onClick={handleGenerate}
                              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save to Library
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="mx-16 bg-white shadow-xl min-h-[400px] flex items-center justify-center">
                    <CardContent className="text-center">
                      <h2 className="text-xl font-medium text-gray-900 mb-2">No more ideas!</h2>
                      <p className="text-gray-600">You've gone through all available content ideas.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {viewMode === "cards" && availableIdeas.length > 0 && (
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">
                  Ideas: {currentIndex + 1} of {availableIdeas.length}
                </div>
                <div className="max-w-xs mx-auto">
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-sm font-medium text-gray-900">{Math.round(progress)}%</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
