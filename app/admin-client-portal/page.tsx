"use client"

import { useState } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { InteractiveHoverButton } from "@/components/interactive-hover-button"
import {
  Home,
  FileText,
  ImageIcon,
  Video,
  Layers,
  Calendar,
  Eye,
  Send,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for available drafts
const availableDrafts = [
  {
    id: "1",
    title: "5 LinkedIn Growth Strategies That Actually Work",
    type: "text",
    content:
      "In today's competitive landscape, growing your LinkedIn presence requires more than just posting regularly. Here are 5 proven strategies...",
    funnelStage: "awareness",
    wordCount: 450,
    created: "2 hours ago",
    author: "You",
  },
  {
    id: "2",
    title: "Behind the Scenes: Building a Personal Brand",
    type: "carousel",
    content: "Personal branding isn't about being perfect—it's about being authentic. Let me share my journey...",
    funnelStage: "consideration",
    wordCount: 280,
    created: "1 day ago",
    author: "You",
  },
  {
    id: "3",
    title: "The Future of Remote Work: What Leaders Need to Know",
    type: "text",
    content:
      "Remote work is here to stay. As leaders, we need to adapt our strategies to support distributed teams effectively...",
    funnelStage: "awareness",
    wordCount: 520,
    created: "3 hours ago",
    author: "You",
  },
  {
    id: "4",
    title: "How I Increased My LinkedIn Engagement by 300%",
    type: "video",
    content:
      "Three months ago, my posts were getting minimal engagement. Today, I'm reaching thousands. Here's what changed...",
    funnelStage: "decision",
    wordCount: 380,
    created: "5 hours ago",
    author: "You",
  },
  {
    id: "5",
    title: "5 Tools Every Content Creator Should Use",
    type: "carousel",
    content:
      "Creating consistent, high-quality content doesn't have to be overwhelming. These 5 tools have transformed my workflow...",
    funnelStage: "consideration",
    wordCount: 310,
    created: "2 days ago",
    author: "You",
  },
]

// Mock clients
const clients = [
  { id: "1", name: "Patritia Pahladsingh", handle: "@PatritiaPahladsingh", avatar: "/images/patritia-avatar.jpeg" },
  { id: "2", name: "John Smith", handle: "@JohnSmith", avatar: "/placeholder-user.jpg" },
  { id: "3", name: "Sarah Johnson", handle: "@SarahJohnson", avatar: "/placeholder-user.jpg" },
]

// Mock media library
const mediaLibrary = [
  {
    id: "1",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224603624-rcymKKoSvcCZNAnAAE6PBuxzbVw5Bh.jpeg",
    type: "image",
    name: "Team Event Photo",
  },
  {
    id: "2",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758781418129-UaaR8Sn7AKK4MDbAjSBQFRCrlckzI1.jpeg",
    type: "image",
    name: "Effie Awards Team",
  },
  {
    id: "3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758889990427-yULNSUwoz49gu25lrRwsKvEvmCCVIN.jpeg",
    type: "image",
    name: "Accenture Song Team",
  },
  {
    id: "4",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752563597041-XX6ClL16Jnj44OBCY8yvUw89quQMhU.jpeg",
    type: "image",
    name: "Professional Workspace",
  },
  {
    id: "5",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224602530-WPiPSTca3yey7CQofy9YrxdaAL1j65.jpeg",
    type: "image",
    name: "Conference Photo",
  },
  {
    id: "6",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1750687434162-wy6V7HmyE2X45AuPe4WPppSBZ830Gw.jpeg",
    type: "image",
    name: "Quality Assurance",
  },
]

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case "text":
      return FileText
    case "image":
      return ImageIcon
    case "carousel":
      return Layers
    case "video":
      return Video
    default:
      return FileText
  }
}

const getFunnelStageBadge = (stage: string) => {
  const colors = {
    awareness: "bg-blue-100 text-blue-800",
    consideration: "bg-purple-100 text-purple-800",
    decision: "bg-green-100 text-green-800",
    retention: "bg-orange-100 text-orange-800",
  }
  return <Badge className={colors[stage as keyof typeof colors]}>{stage}</Badge>
}

export default function AdminClientPortalPage() {
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStage, setFilterStage] = useState<string>("all")
  const [scheduledDates, setScheduledDates] = useState<Record<string, string>>({})
  const [keyTakeaways, setKeyTakeaways] = useState<Record<string, string[]>>({})
  const [selectedMedia, setSelectedMedia] = useState<Record<string, string[]>>({})
  const [adminNotes, setAdminNotes] = useState<string>("")
  const [priority, setPriority] = useState<string>("normal")
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSelectDraft = (id: string) => {
    setSelectedDrafts((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleToggleMedia = (draftId: string, mediaId: string) => {
    setSelectedMedia((prev) => {
      const current = prev[draftId] || []
      const updated = current.includes(mediaId) ? current.filter((id) => id !== mediaId) : [...current, mediaId]
      return { ...prev, [draftId]: updated }
    })
  }

  const handleAddTakeaway = (draftId: string, takeaway: string) => {
    if (!takeaway.trim()) return
    setKeyTakeaways((prev) => ({
      ...prev,
      [draftId]: [...(prev[draftId] || []), takeaway],
    }))
  }

  const handleRemoveTakeaway = (draftId: string, index: number) => {
    setKeyTakeaways((prev) => ({
      ...prev,
      [draftId]: (prev[draftId] || []).filter((_, i) => i !== index),
    }))
  }

  const filteredDrafts = availableDrafts.filter((draft) => {
    const typeMatch = filterType === "all" || draft.type === filterType
    const stageMatch = filterStage === "all" || draft.funnelStage === filterStage
    return typeMatch && stageMatch
  })

  const selectedDraftObjects = availableDrafts.filter((draft) => selectedDrafts.includes(draft.id))

  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/production-pipeline">Production Pipeline</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submit for Approval</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-6">
              <TypingAnimation
                text="Submit Content for Client Approval"
                className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800 mb-2"
              />
              <p className="text-gray-600 text-pretty">
                Select drafts from your pipeline and submit them to clients for approval
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Drafts Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">{availableDrafts.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Clients Awaiting Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">12</div>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Panel: Available Drafts (60% width = 3 columns) */}
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Drafts</CardTitle>
                    <div className="flex gap-3 mt-4">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="text">Text Posts</SelectItem>
                          <SelectItem value="carousel">Carousels</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStage} onValueChange={setFilterStage}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Funnel stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="consideration">Consideration</SelectItem>
                          <SelectItem value="decision">Decision</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {filteredDrafts.map((draft) => {
                          const IconComponent = getContentTypeIcon(draft.type)
                          const isSelected = selectedDrafts.includes(draft.id)
                          return (
                            <Card
                              key={draft.id}
                              className={`p-4 cursor-pointer transition-all ${
                                isSelected ? "border-emerald-500 border-2 bg-emerald-50" : "hover:shadow-md"
                              }`}
                              onClick={() => handleSelectDraft(draft.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox checked={isSelected} onCheckedChange={() => handleSelectDraft(draft.id)} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <IconComponent className="h-4 w-4 text-gray-500" />
                                    {getFunnelStageBadge(draft.funnelStage)}
                                    <Badge variant="outline" className="text-xs">
                                      {draft.wordCount} words
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-sm mb-2">{draft.title}</h4>
                                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{draft.content}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>By {draft.author}</span>
                                    <span>{draft.created}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Bulk Actions Bar */}
                {selectedDrafts.length > 0 && (
                  <Card className="bg-emerald-50 border-emerald-200">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <span className="font-medium text-emerald-900">
                            {selectedDrafts.length} draft{selectedDrafts.length > 1 ? "s" : ""} selected
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDrafts([])}>
                          Clear Selection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Panel: Submission Details (40% width = 2 columns) */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {/* Selected Content Summary */}
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Selected Content</Label>
                          {selectedDrafts.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">No drafts selected</div>
                          ) : (
                            <div className="space-y-2">
                              {selectedDraftObjects.map((draft) => (
                                <div
                                  key={draft.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                                >
                                  <span className="line-clamp-1">{draft.title}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSelectDraft(draft.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Client Assignment */}
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Assign to Client</Label>
                          <Select value={selectedClient} onValueChange={setSelectedClient}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{client.name}</span>
                                    <span className="text-xs text-gray-500">{client.handle}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        {/* Scheduling Suggestions */}
                        {selectedDrafts.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Proposed Publication Dates</Label>
                            <div className="space-y-3">
                              {selectedDraftObjects.map((draft) => (
                                <div key={draft.id} className="space-y-2">
                                  <Label className="text-xs text-gray-600">{draft.title}</Label>
                                  <Input
                                    type="date"
                                    value={scheduledDates[draft.id] || ""}
                                    onChange={(e) =>
                                      setScheduledDates((prev) => ({ ...prev, [draft.id]: e.target.value }))
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Key Takeaways */}
                        {selectedDrafts.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Key Takeaways</Label>
                            <div className="space-y-4">
                              {selectedDraftObjects.map((draft) => (
                                <div key={draft.id} className="space-y-2">
                                  <Label className="text-xs text-gray-600">{draft.title}</Label>
                                  <div className="space-y-2">
                                    {(keyTakeaways[draft.id] || []).map((takeaway, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1 text-sm bg-gray-50 p-2 rounded">{takeaway}</div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveTakeaway(draft.id, index)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Input
                                      placeholder="Add key takeaway..."
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleAddTakeaway(draft.id, e.currentTarget.value)
                                          e.currentTarget.value = ""
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Media Management */}
                        {selectedDrafts.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Attach Media</Label>
                            <div className="space-y-4">
                              {selectedDraftObjects.map((draft) => (
                                <div key={draft.id} className="space-y-2">
                                  <Label className="text-xs text-gray-600">{draft.title}</Label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {mediaLibrary.map((media) => {
                                      const isSelected = (selectedMedia[draft.id] || []).includes(media.id)
                                      return (
                                        <div
                                          key={media.id}
                                          className={`relative cursor-pointer rounded border-2 overflow-hidden ${
                                            isSelected ? "border-emerald-500" : "border-gray-200"
                                          }`}
                                          onClick={() => handleToggleMedia(draft.id, media.id)}
                                        >
                                          <img
                                            src={media.url || "/placeholder.svg"}
                                            alt={media.name}
                                            className="w-full h-20 object-cover"
                                          />
                                          {isSelected && (
                                            <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-1">
                                              <CheckCircle2 className="h-3 w-3 text-white" />
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Additional Notes */}
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Admin Notes</Label>
                          <Textarea
                            placeholder="Add notes for the client..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={4}
                          />
                        </div>

                        {/* Priority */}
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Priority Level</Label>
                          <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <Card className="mt-6 sticky bottom-0 bg-white shadow-lg">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {selectedDrafts.length > 0 && selectedClient ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>
                          Ready to submit {selectedDrafts.length} draft{selectedDrafts.length > 1 ? "s" : ""} to{" "}
                          {clients.find((c) => c.id === selectedClient)?.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span>Select drafts and assign a client to continue</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <InteractiveHoverButton
                      text="Submit for Approval"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={selectedDrafts.length === 0 || !selectedClient}
                    >
                      <Send className="h-4 w-4 mr-2" />
                    </InteractiveHoverButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview: Client View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              This is how the content will appear in {clients.find((c) => c.id === selectedClient)?.name}'s approval
              portal
            </div>
            {selectedDraftObjects.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{draft.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {getFunnelStageBadge(draft.funnelStage)}
                    {scheduledDates[draft.id] && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {scheduledDates[draft.id]}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{draft.content}</p>
                  {keyTakeaways[draft.id] && keyTakeaways[draft.id].length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Key Takeaways:</Label>
                      <ul className="list-disc list-inside space-y-1">
                        {keyTakeaways[draft.id].map((takeaway, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedMedia[draft.id] && selectedMedia[draft.id].length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Attached Media:</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedMedia[draft.id].map((mediaId) => {
                          const media = mediaLibrary.find((m) => m.id === mediaId)
                          return (
                            media && (
                              <img
                                key={mediaId}
                                src={media.url || "/placeholder.svg"}
                                alt={media.name}
                                className="w-full h-20 object-cover rounded"
                              />
                            )
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
