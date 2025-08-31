"use client"

import { useState } from "react"
import { Wand2, ImageIcon, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarNavigation } from "@/components/sidebar-navigation"

// Sample content data
const sampleContent = [
  {
    id: 1,
    title: "Dual-Path Experience Breakdown",
    preview:
      "I raised $300K in VC for my first startup. I've bootstrapped my current LinkedIn content agency to $9M ARR.",
    date: "26/08/2025",
    shares: 107,
    type: "Framework",
  },
  {
    id: 2,
    title: "Dual-Path Experience Breakdown",
    preview: "I raised $300K in VC for my first startup. I've bootstrapped my...",
    date: "22/08/2025",
    shares: 1560,
    type: "Framework",
  },
  {
    id: 3,
    title: "Confession Formula",
    preview: "",
    date: "18/08/2025",
    shares: 0,
    type: "Framework",
  },
  {
    id: 4,
    title: "Confession Formula",
    preview: "...",
    date: "18/08/2025",
    shares: 0,
    type: "Framework",
  },
  {
    id: 5,
    title: "Confession Formula",
    preview: "...",
    date: "18/08/2025",
    shares: 0,
    type: "Framework",
  },
  {
    id: 6,
    title: "Standard Mode - From Burnout to Boundaries: The Family Trip That Changed Everything",
    preview: "I'm going to be direct. From Burnout to Boundaries: The...",
    date: "06/08/2025",
    shares: 575,
    type: "Framework",
  },
]

export default function ImageGenerationPage() {
  const [selectedContent, setSelectedContent] = useState(sampleContent[0])
  const [activeTab, setActiveTab] = useState("framework")
  const [activeSubTab, setActiveSubTab] = useState("ai-suggested")

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Image Generation</h2>
                <p className="text-xs text-gray-500">Create AI images for your content</p>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-auto">
            <div className="p-2">
              {/* Status filters */}
              <div className="flex gap-2 mb-4 px-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  📝 Draft (7)
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  📅 Scheduled (2)
                </Button>
              </div>

              {/* Content items */}
              <div className="space-y-1">
                {sampleContent.map((content) => (
                  <div
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContent?.id === content.id
                        ? "bg-emerald-50 border border-emerald-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center mt-0.5">
                        <FileText className="h-2.5 w-2.5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                          {content.title}
                        </h3>
                        {content.preview && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{content.preview}</p>
                        )}
                      </div>
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">✏️</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{content.date}</span>
                      <span>{content.shares} shares</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Breadcrumbs */}
          <div className="bg-white border-b px-6 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Image Generation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="bg-white border-b px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Generate Image for Content</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="framework">📋 Framework</TabsTrigger>
                <TabsTrigger value="draft">📝 Draft</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="ai-suggested">✨ AI Suggested</TabsTrigger>
                <TabsTrigger value="custom-prompt">✏️ Custom Prompt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Example Images for Your Content
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                          {num === 1 && <ImageIcon className="h-6 w-6 text-teal-600" />}
                          {num === 2 && <FileText className="h-6 w-6 text-teal-600" />}
                          {num === 3 && <Wand2 className="h-6 w-6 text-teal-600" />}
                        </div>
                        <p className="text-sm font-medium text-teal-800">Sample Style {num}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Images
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Our AI will create images perfectly matched to your framework content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
